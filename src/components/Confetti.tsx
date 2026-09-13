import { useMemo } from 'react'

const COLORS = ['var(--color-accent)', 'var(--color-amber)', 'var(--color-green)']

interface Piece {
  id: number
  left: number
  delay: number
  duration: number
  color: string
  size: number
  drift: number
  spin: number
}

/** Lightweight CSS-only confetti burst — no external dependency. */
export function Confetti({ count = 24 }: { count?: number }) {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: Math.random() * 0.15,
        duration: 0.9 + Math.random() * 0.6,
        color: COLORS[id % COLORS.length],
        size: 6 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 220,
        spin: 180 + Math.random() * 360,
      })),
    [count],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-1/3 rounded-sm"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 0.4,
              backgroundColor: p.color,
              animation: `confetti-fall ${p.duration}s ease-in forwards`,
              animationDelay: `${p.delay}s`,
              '--fall-distance': `${240 + p.drift}px`,
              '--spin': `${p.spin}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
