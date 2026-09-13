import { useEffect, useState } from 'react'
import { idbGet, idbSet } from '../lib/db'

export function useIndexedDB<T>(
  key: string,
  initialValue: T,
): [T, (updater: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    idbGet<T>(key)
      .then((stored) => {
        if (cancelled) return
        if (stored !== undefined) setValue(stored)
        setLoaded(true)
      })
      .catch(() => {
        if (cancelled) return
        setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [key])

  useEffect(() => {
    if (!loaded) return
    idbSet(key, value).catch(() => {})
  }, [key, value, loaded])

  return [value, setValue, loaded]
}
