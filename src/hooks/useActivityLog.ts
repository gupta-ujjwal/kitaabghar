import { useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { computeStreak } from '../utils/streak'

const STORAGE_KEY = 'kitaabghar:activity'

export function useActivityLog() {
  const [dates, setDates] = useLocalStorage<string[]>(STORAGE_KEY, [])

  function logActivity() {
    const today = new Date().toISOString().slice(0, 10)
    setDates((prev) => (prev.includes(today) ? prev : [...prev, today]))
  }

  const streak = useMemo(() => computeStreak(dates), [dates])

  return { streak, logActivity }
}
