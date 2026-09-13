const DAY_MS = 24 * 60 * 60 * 1000

function toDayIndex(isoDate: string): number {
  return Math.floor(new Date(`${isoDate}T00:00:00`).getTime() / DAY_MS)
}

export interface StreakInfo {
  current: number
  longest: number
}

/** Computes current & longest consecutive-day streaks from a list of ISO activity dates. */
export function computeStreak(activityDates: string[]): StreakInfo {
  if (activityDates.length === 0) return { current: 0, longest: 0 }

  const days = Array.from(new Set(activityDates.map(toDayIndex))).sort((a, b) => a - b)

  let longest = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    if (days[i] === days[i - 1] + 1) {
      run += 1
    } else {
      longest = Math.max(longest, run)
      run = 1
    }
  }
  longest = Math.max(longest, run)

  const todayIndex = toDayIndex(new Date().toISOString().slice(0, 10))
  const lastDay = days[days.length - 1]
  if (lastDay !== todayIndex && lastDay !== todayIndex - 1) {
    return { current: 0, longest }
  }

  let current = 1
  for (let i = days.length - 1; i > 0; i--) {
    if (days[i] === days[i - 1] + 1) {
      current += 1
    } else {
      break
    }
  }

  return { current, longest }
}
