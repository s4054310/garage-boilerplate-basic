'use server'

import { adminDb } from '@/lib/firebase/admin'
import { requireAuth } from '@/actions/auth.actions'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types'

const MAX_BIO_LENGTH = 280

/**
 * Fetch the current user's bio from Firestore.
 * Returns null if the user has not set one yet.
 */
export async function getBio(): Promise<string | null> {
  const session = await requireAuth()
  const doc = await adminDb.collection('users').doc(session.uid).get()
  const data = doc.data()
  return (data?.bio as string | null | undefined) ?? null
}

/**
 * Update the current user's bio in Firestore.
 */
export async function updateBio(formData: FormData): Promise<ActionResult> {
  const session = await requireAuth()
  const bio = String(formData.get('bio') ?? '').trim()

  if (bio.length > MAX_BIO_LENGTH) {
    return { success: false, error: `Bio must be ${MAX_BIO_LENGTH} characters or fewer` }
  }

  try {
    await adminDb
      .collection('users')
      .doc(session.uid)
      .set(
        {
          bio: bio.length > 0 ? bio : null,
          updatedAt: new Date(),
        },
        { merge: true },
      )

    revalidatePath('/profile')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update bio' }
  }
}


export async function updateBioForm(formData: FormData): Promise<void> {
  await updateBio(formData)
}
