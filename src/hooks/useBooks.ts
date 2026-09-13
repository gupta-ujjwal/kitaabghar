import type { Book } from '../types/book'
import { generateId } from '../utils/id'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'kitaabghar:books'

export function useBooks() {
  const [books, setBooks] = useLocalStorage<Book[]>(STORAGE_KEY, [])

  function addBook(book: Omit<Book, 'id' | 'dateAdded'>) {
    const newBook: Book = {
      ...book,
      id: generateId(),
      dateAdded: new Date().toISOString().slice(0, 10),
    }
    setBooks((prev) => [newBook, ...prev])
  }

  function updateBook(id: string, updates: Partial<Book>) {
    setBooks((prev) =>
      prev.map((book) => (book.id === id ? { ...book, ...updates } : book)),
    )
  }

  function deleteBook(id: string) {
    setBooks((prev) => prev.filter((book) => book.id !== id))
  }

  function importBooks(newBooks: Book[]) {
    setBooks((prev) => [...newBooks, ...prev])
  }

  function clearBooks() {
    setBooks([])
  }

  return { books, addBook, updateBook, deleteBook, importBooks, clearBooks }
}
