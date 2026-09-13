import { useMemo } from 'react'
import { useIndexedDB } from './useIndexedDB'
import { computeStreak } from '../utils/streak'

const STORAGE_KEY = 'kitaabghar:activity'

export function useActivityLog() {
  const [dates, setDates, loaded] = useIndexedDB<string[]>(STORAGE_KEY, [])

  function logActivity() {
    const today = new Date().toISOString().slice(0, 10)
    setDates((prev) => (prev.includes(today) ? prev : [...prev, today]))
  }

  function clearActivity() {
    setDates([])
  }

  const streak = useMemo(() => computeStreak(dates), [dates])

  return { streak, logActivity, clearActivity, loaded }
}
