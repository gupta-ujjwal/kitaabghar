const DB_NAME = 'kitaabghar'
const DB_VERSION = 1
const STORE_NAME = 'kv'

const BOOKS_KEY = 'kitaabghar:books'
const ACTIVITY_KEY = 'kitaabghar:activity'
const GOAL_KEY_RE = /^kitaabghar:goal:\d{4}$/

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME)
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    dbPromise.catch(() => {
      dbPromise = null
    })
  }
  return dbPromise
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDb()
  const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(key)
  return requestToPromise<T | undefined>(request)
}

export async function idbSet<T>(key: string, value: T): Promise<void> {
  const db = await openDb()
  const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(value, key)
  await requestToPromise(request)
}

export async function idbDelete(key: string): Promise<void> {
  const db = await openDb()
  const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(key)
  await requestToPromise(request)
}

export async function migrateFromLocalStorage(): Promise<void> {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key === null) continue
    if (key === BOOKS_KEY || key === ACTIVITY_KEY || GOAL_KEY_RE.test(key)) {
      keys.push(key)
    }
  }
  if (keys.length === 0) return

  for (const key of keys) {
    const raw = localStorage.getItem(key)
    if (raw === null) continue
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      localStorage.removeItem(key)
      continue
    }
    try {
      await idbSet(key, parsed)
      localStorage.removeItem(key)
    } catch {}
  }
}
