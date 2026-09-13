import { useRef, useState } from 'react'
import { IMPORT_OPENAPI_SCHEMA, IMPORT_SAMPLE } from '../data/importSchema'
import type { Book } from '../types/book'
import { parseImportFile, type ImportResult } from '../utils/bookImport'
import { downloadJson } from '../utils/download'

interface ImportModalProps {
  onImport: (books: Book[]) => void
  onClose: () => void
}

export function ImportModal({ onImport, onClose }: ImportModalProps) {
  const [text, setText] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleParse(raw: string) {
    setText(raw)
    if (!raw.trim()) {
      setResult(null)
      return
    }
    try {
      const parsed = JSON.parse(raw)
      setResult(parseImportFile(parsed))
    } catch {
      setResult({ books: [], errors: ['That file is not valid JSON.'] })
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    file.text().then(handleParse)
  }

  function handleConfirmImport() {
    if (!result || result.books.length === 0) return
    onImport(result.books)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/40 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] shadow-[0_20px_50px_rgba(20,20,25,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-4">
          <p className="text-base font-semibold">Import Books</p>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-wrap gap-4 text-xs">
            <button
              type="button"
              onClick={() => downloadJson('kitaabghar-import.schema.json', IMPORT_OPENAPI_SCHEMA)}
              className="font-semibold text-[var(--color-accent)] hover:underline"
            >
              Download OpenAPI Schema
            </button>
            <button
              type="button"
              onClick={() => downloadJson('kitaabghar-sample.json', IMPORT_SAMPLE)}
              className="font-semibold text-[var(--color-accent)] hover:underline"
            >
              Download Sample File
            </button>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            Upload a JSON file
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleFileChange}
              className="text-sm"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            …or paste JSON directly
            <textarea
              rows={6}
              value={text}
              onChange={(e) => handleParse(e.target.value)}
              placeholder="[ { &quot;title&quot;: &quot;...&quot;, &quot;author&quot;: &quot;...&quot; } ]"
              className="resize-none rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 font-mono text-xs focus:border-[var(--color-accent)] focus:outline-none"
            />
          </label>

          {result ? (
            <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-3 text-sm">
              <p className="font-medium">
                {result.books.length} book{result.books.length === 1 ? '' : 's'} ready to import
                {result.errors.length > 0 ? `, ${result.errors.length} skipped` : ''}
              </p>
              {result.errors.length > 0 ? (
                <ul className="mt-2 flex flex-col gap-1 text-xs text-[var(--color-destructive)]">
                  {result.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!result || result.books.length === 0}
              onClick={handleConfirmImport}
              className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Import {result?.books.length ? result.books.length : ''} Book
              {result?.books.length === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
