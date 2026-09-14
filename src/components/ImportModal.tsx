import { useRef, useState } from 'react'
import { AI_IMPORT_PROMPT, IMPORT_OPENAPI_SCHEMA, IMPORT_SAMPLE } from '../data/importSchema'
import { useModalDismiss } from '../hooks/useModalDismiss'
import type { Book } from '../types/book'
import { parseImportFile, type ImportResult } from '../utils/bookImport'
import { fillMissingCovers } from '../utils/coverLookup'
import { downloadJson } from '../utils/download'

interface ImportModalProps {
  books: Book[]
  onImport: (books: Book[]) => void
  onClose: () => void
}

export function ImportModal({ books, onImport, onClose }: ImportModalProps) {
  const [text, setText] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)
  const [autoFetchCovers, setAutoFetchCovers] = useState(true)
  const [coverProgress, setCoverProgress] = useState<{ done: number; total: number } | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [promptCopied, setPromptCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const duplicateCount = result
    ? result.books.filter((nb) =>
        books.some(
          (existing) =>
            existing.title.trim().toLowerCase() === nb.title.trim().toLowerCase() &&
            existing.author.trim().toLowerCase() === nb.author.trim().toLowerCase(),
        ),
      ).length
    : 0

  useModalDismiss(() => {
    if (coverProgress === null) onClose()
  })

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
    setFileName(file.name)
    file.text().then(handleParse)
  }

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(AI_IMPORT_PROMPT)
      setPromptCopied(true)
      setTimeout(() => setPromptCopied(false), 2000)
    } catch {
      setPromptCopied(false)
    }
  }

  async function handleConfirmImport() {
    if (!result || result.books.length === 0) return

    let booksToImport = result.books
    const missingCovers = booksToImport.filter((b) => !b.coverUrl).length

    if (autoFetchCovers && missingCovers > 0) {
      setCoverProgress({ done: 0, total: missingCovers })
      booksToImport = await fillMissingCovers(booksToImport, (done, total) =>
        setCoverProgress({ done, total }),
      )
      setCoverProgress(null)
    }

    onImport(booksToImport)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/40 p-4 backdrop-blur-[2px]"
      onClick={() => {
        if (coverProgress === null) onClose()
      }}
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
            disabled={coverProgress !== null}
            className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
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

          <details className="rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-3 text-sm">
            <summary className="cursor-pointer font-medium">✨ Generate this with AI</summary>
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-xs text-[var(--color-ink-soft)]">
                Download the OpenAPI schema above, then paste it into ChatGPT, Claude, or any AI
                assistant along with your book list and the prompt below. Paste the JSON it gives you
                into the box below, or save it to a file and upload it.
              </p>
              <pre className="whitespace-pre-wrap rounded-lg border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-3 font-mono text-xs">
                {AI_IMPORT_PROMPT}
              </pre>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="self-start rounded-full border border-[var(--color-line)] bg-[var(--color-paper-raised)] px-4 py-1.5 text-xs font-semibold transition-colors hover:border-[var(--color-accent)]"
              >
                {promptCopied ? 'Copied!' : 'Copy prompt'}
              </button>
            </div>
          </details>

          <div className="flex flex-col gap-1 text-sm">
            Upload a JSON file
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 rounded-full border border-[var(--color-line)] bg-[var(--color-paper-raised)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-accent)]"
              >
                Choose File
              </button>
              <span className="truncate text-xs text-[var(--color-ink-soft)]">
                {fileName ?? 'No file selected'}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

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
              {duplicateCount > 0 ? (
                <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                  {duplicateCount} already in your library
                </p>
              ) : null}
              {result.errors.length > 0 ? (
                <ul className="mt-2 flex flex-col gap-1 text-xs text-[var(--color-destructive)]">
                  {result.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {result && result.books.some((b) => !b.coverUrl) ? (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoFetchCovers}
                onChange={(e) => setAutoFetchCovers(e.target.checked)}
              />
              Fetch missing covers automatically (via Open Library)
            </label>
          ) : null}

          <div className="flex items-center justify-end gap-3">
            {coverProgress ? (
              <span className="text-xs text-[var(--color-ink-soft)]">
                Fetching covers… {coverProgress.done}/{coverProgress.total}
              </span>
            ) : null}
            <button
              type="button"
              disabled={!result || result.books.length === 0 || coverProgress !== null}
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
