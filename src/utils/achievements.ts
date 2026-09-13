import type { Book } from '../types/book'

export interface Achievement {
  id: string
  label: string
  description: string
  icon: string
  unlocked: boolean
}

export function computeAchievements(books: Book[], longestStreak: number): Achievement[] {
  const readCount = books.filter((b) => b.status === 'read').length
  const genreCount = new Set(books.map((b) => b.genre).filter(Boolean)).size
  const hasFiveStar = books.some((b) => b.rating === 5)

  return [
    {
      id: 'first-book',
      label: 'First Chapter',
      description: 'Finish your first book',
      icon: '📖',
      unlocked: readCount >= 1,
    },
    {
      id: 'five-books',
      label: 'Bookworm',
      description: 'Finish 5 books',
      icon: '🐛',
      unlocked: readCount >= 5,
    },
    {
      id: 'ten-books',
      label: 'Bibliophile',
      description: 'Finish 10 books',
      icon: '📚',
      unlocked: readCount >= 10,
    },
    {
      id: 'twenty-five-books',
      label: 'Library Legend',
      description: 'Finish 25 books',
      icon: '🏛️',
      unlocked: readCount >= 25,
    },
    {
      id: 'genre-explorer',
      label: 'Genre Explorer',
      description: 'Read across 3+ genres',
      icon: '🧭',
      unlocked: genreCount >= 3,
    },
    {
      id: 'five-star',
      label: 'Instant Classic',
      description: 'Give a book 5 stars',
      icon: '✨',
      unlocked: hasFiveStar,
    },
    {
      id: 'week-streak',
      label: 'On a Roll',
      description: 'Hit a 7-day reading streak',
      icon: '🔥',
      unlocked: longestStreak >= 7,
    },
    {
      id: 'month-streak',
      label: 'Devoted Reader',
      description: 'Hit a 30-day reading streak',
      icon: '🕯️',
      unlocked: longestStreak >= 30,
    },
  ]
}
