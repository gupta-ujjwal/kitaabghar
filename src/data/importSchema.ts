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
