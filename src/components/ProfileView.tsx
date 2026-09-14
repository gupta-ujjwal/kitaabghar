import { useState } from 'react'
import { useModalDismiss } from '../hooks/useModalDismiss'
import type { Book } from '../types/book'
import type { Profile } from '../types/profile'
import { downloadJson } from '../utils/download'
import type { StreakInfo } from '../utils/streak'
import { AnimatedNumber } from './ui/AnimatedNumber'

interface ProfileViewProps {
  profile: Profile
  onUpdateProfile: (updates: Partial<Profile>) => void
  books: Book[]
  streak: StreakInfo
  onDeleteAll: () => void
}

const fieldClass =
  'rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 focus:border-[var(--color-accent)] focus:outline-none'

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-5">
      <p className="text-sm text-[var(--color-ink-soft)]">{label}</p>
      <p className="mt-1 font-mono text-3xl font-semibold text-[var(--color-accent)]">
        <AnimatedNumber value={value} />
      </p>
    </div>
  )
}

const CONFIRM_PHRASE = 'DELETE'

export function ProfileView({ profile, onUpdateProfile, books, streak, onDeleteAll }: ProfileViewProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  useModalDismiss(() => setConfirmOpen(false), confirmOpen)

  const [name, setName] = useState(profile.name)
  const [favoriteGenre, setFavoriteGenre] = useState(profile.favoriteGenre ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [syncedProfile, setSyncedProfile] = useState(profile)

  if (syncedProfile !== profile) {
    setSyncedProfile(profile)
    setName(profile.name)
    setFavoriteGenre(profile.favoriteGenre ?? '')
    setBio(profile.bio ?? '')
  }

  const readCount = books.filter((b) => b.status === 'read').length
  const readingCount = books.filter((b) => b.status === 'reading').length

  function openConfirm() {
    setConfirmText('')
    setConfirmOpen(true)
  }

  function handleConfirmDelete() {
    onDeleteAll()
    setConfirmOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>
        <p className="mt-1 text-[var(--color-ink-soft)]">Your library, at a glance.</p>
      </div>

      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-5">
        <h2 className="text-lg font-semibold">About you</h2>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          A few details that personalize Kitaabghar — saved locally in this browser.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              Display name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => onUpdateProfile({ name: name.trim() })}
                placeholder="Your name"
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Favorite genre
              <input
                type="text"
                value={favoriteGenre}
                onChange={(e) => setFavoriteGenre(e.target.value)}
                onBlur={() => onUpdateProfile({ favoriteGenre: favoriteGenre.trim() || undefined })}
                placeholder="e.g. Science fiction"
                className={fieldClass}
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            Bio
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              onBlur={() => onUpdateProfile({ bio: bio.trim() || undefined })}
              placeholder="A little about your reading taste…"
              className={`resize-none ${fieldClass}`}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Total Books" value={books.length} />
        <StatTile label="Currently Reading" value={readingCount} />
        <StatTile label="Finished" value={readCount} />
        <StatTile label="Current Streak" value={streak.current} />
      </div>

      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-5">
        <h2 className="text-lg font-semibold">Your data</h2>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Kitaabghar is local-first — everything above lives only in this browser's storage.
          Nothing is ever sent to a server.
        </p>
        <button
          type="button"
          onClick={() => downloadJson('kitaabghar-library.json', books)}
          disabled={books.length === 0}
          className="mt-4 rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Export library as JSON
        </button>
      </div>

      <div className="rounded-2xl border border-[var(--color-destructive)]/40 bg-[var(--color-destructive-soft)] p-5">
        <h2 className="text-lg font-semibold text-[var(--color-destructive)]">Danger zone</h2>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Permanently delete every book, your reading streak, your yearly goal, and your
          profile from this browser. This can't be undone.
        </p>
        <button
          type="button"
          onClick={openConfirm}
          className="mt-4 rounded-full bg-[var(--color-destructive)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Delete all data
        </button>
      </div>

      {confirmOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/40 p-4 backdrop-blur-[2px]"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-6 shadow-[0_20px_50px_rgba(20,20,25,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold">Delete all data?</h3>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
              This permanently removes {books.length} book{books.length === 1 ? '' : 's'}, your
              streak, and your reading goal from this browser. Type{' '}
              <strong className="text-[var(--color-ink)]">{CONFIRM_PHRASE}</strong> to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              autoFocus
              className="mt-3 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 text-sm focus:border-[var(--color-destructive)] focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmText !== CONFIRM_PHRASE}
                onClick={handleConfirmDelete}
                className="rounded-full bg-[var(--color-destructive)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Delete everything
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
