import type { Achievement } from '../utils/achievements'

export function AchievementsShelf({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-5">
      <h3 className="mb-4 text-lg font-semibold">Achievements</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {achievements.map((a) => (
          <div
            key={a.id}
            title={a.description}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-opacity ${
              a.unlocked
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
                : 'border-[var(--color-line)] opacity-40 grayscale'
            }`}
          >
            <span className="text-2xl">{a.icon}</span>
            <span className="text-xs font-medium leading-tight">{a.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
