import { useIndexedDB } from './useIndexedDB'

const currentYear = new Date().getFullYear()

export function useReadingGoal() {
  const [goal, setGoal, loaded] = useIndexedDB(`kitaabghar:goal:${currentYear}`, {
    year: currentYear,
    target: 24,
  })

  function setTarget(target: number) {
    setGoal({ year: currentYear, target: Math.max(1, target) })
  }

  function resetGoal() {
    setGoal({ year: currentYear, target: 24 })
  }

  return { goal, setTarget, resetGoal, loaded }
}
