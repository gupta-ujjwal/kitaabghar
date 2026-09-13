import { useLocalStorage } from './useLocalStorage'

const currentYear = new Date().getFullYear()

export function useReadingGoal() {
  const [goal, setGoal] = useLocalStorage(`kitaabghar:goal:${currentYear}`, {
    year: currentYear,
    target: 24,
  })

  function setTarget(target: number) {
    setGoal({ year: currentYear, target: Math.max(1, target) })
  }

  return { goal, setTarget }
}
