import { useEffect } from 'react'

/**
 * Standard modal behavior: locks background scroll and closes on Escape while active.
 * Pass `active` for a modal that's conditionally shown within an always-mounted component
 * (e.g. a confirm dialog inside a page); omit it for a modal that's only mounted while open.
 */
export function useModalDismiss(onClose: () => void, active = true) {
  useEffect(() => {
    if (!active) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [active, onClose])
}
