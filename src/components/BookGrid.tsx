import type { Book } from '../types/book'
import { BookCard } from './BookCard'

interface BookGridProps {
  books: Book[]
  onSelectBook: (book: Book) => void
}

export function BookGrid({ books, onSelectBook }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-24 text-center text-gray-500 dark:text-gray-400">
        <span className="text-4xl">🔍</span>
        <p className="font-medium">No books match your filters</p>
        <p className="text-sm">Try adjusting your search or add a new book.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onClick={() => onSelectBook(book)} />
      ))}
    </div>
  )
}
