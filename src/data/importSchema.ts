export const IMPORT_OPENAPI_SCHEMA = {
  openapi: '3.0.3',
  info: {
    title: 'Kitaabghar Bulk Import',
    version: '1.0.0',
    description:
      'Schema for the JSON file accepted by Kitaabghar\'s bulk import. The import file is a single JSON array of BookImportItem objects.',
  },
  paths: {},
  components: {
    schemas: {
      ReadingStatus: {
        type: 'string',
        enum: ['want-to-read', 'reading', 'paused', 'read'],
        default: 'want-to-read',
      },
      BookImportItem: {
        type: 'object',
        required: ['title', 'author'],
        properties: {
          title: { type: 'string', minLength: 1 },
          author: { type: 'string', minLength: 1 },
          coverUrl: { type: 'string', format: 'uri', nullable: true },
          genre: { type: 'string', nullable: true },
          status: { $ref: '#/components/schemas/ReadingStatus' },
          rating: { type: 'integer', minimum: 1, maximum: 5, nullable: true },
          pages: { type: 'integer', minimum: 1, nullable: true },
          notes: { type: 'string', nullable: true },
          dateStarted: { type: 'string', format: 'date', nullable: true },
          dateFinished: { type: 'string', format: 'date', nullable: true },
        },
      },
      BookImportFile: {
        type: 'array',
        items: { $ref: '#/components/schemas/BookImportItem' },
      },
    },
  },
} as const

export const IMPORT_SAMPLE = [
  {
    title: 'The Left Hand of Darkness',
    author: 'Ursula K. Le Guin',
    genre: 'Science Fiction',
    status: 'want-to-read',
    pages: 304,
  },
  {
    title: 'Circe',
    author: 'Madeline Miller',
    genre: 'Fantasy',
    status: 'reading',
    pages: 385,
    dateStarted: '2026-05-01',
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Memoir',
    status: 'read',
    rating: 5,
    pages: 334,
    dateStarted: '2026-01-02',
    dateFinished: '2026-01-20',
  },
]

export const AI_IMPORT_PROMPT = `Convert my reading list into a JSON array for Kitaabghar's bulk import.

Match this OpenAPI schema exactly (I'm attaching/pasting it below this prompt): only "title" and "author" are required; "status" must be one of want-to-read / reading / paused / read (default want-to-read); "genre", "pages", "rating" (1-5, only when status is "read"), "notes", "dateStarted", "dateFinished" (YYYY-MM-DD) are optional.

For each book, also look up a real cover image and include it as "coverUrl":
1. Try Google Books first: https://www.googleapis.com/books/v1/volumes?q=intitle:TITLE+inauthor:AUTHOR — use volumeInfo.imageLinks.thumbnail if present.
2. If Google Books has no cover, try Open Library: https://openlibrary.org/search.json?title=TITLE&author=AUTHOR — take the first result's cover_i and build https://covers.openlibrary.org/b/id/COVER_ID-L.jpg.
3. If neither has a cover, just omit "coverUrl" — Kitaabghar can fetch one automatically on import.

Output ONLY the raw JSON array — no explanation, no markdown code fences.

My books:
- [Title] by [Author]
- [Title] by [Author]`
