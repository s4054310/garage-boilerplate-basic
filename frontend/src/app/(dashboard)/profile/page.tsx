import type { Metadata } from 'next'
import { getServerSession } from '@/actions/auth.actions'
import { getBio, updateBioForm } from '@/actions/profile.actions'

export const metadata: Metadata = {
  title: 'Profile',
}

export default async function ProfilePage() {
  const session = await getServerSession()
  const bio = await getBio()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your account details.</p>
      </div>

      <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <p className="text-xs font-medium tracking-wide text-zinc-400 uppercase">Email</p>
          <p className="mt-1 text-sm">{session?.email ?? '—'}</p>
        </div>

        <form action={updateBioForm} className="space-y-2">
          <label htmlFor="bio" className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={bio ?? ''}
            maxLength={280}
            rows={4}
            placeholder="Tell us a little about yourself..."
            className="w-full rounded-md border border-zinc-300 bg-transparent p-2 text-sm dark:border-zinc-700"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  )
}
