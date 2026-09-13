import type { ReactNode } from 'react'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

/**
 * Pointer-following 3D tilt wrapper. Interaction technique adapted from
 * React Bits' "Tilted Card" (reactbits.dev), generalized to wrap arbitrary
 * card content instead of a single image.
 */
interface TiltCardProps {
  children: ReactNode
  className?: string
  rotateAmplitude?: number
  scaleOnHover?: number
}

const springValues = { damping: 24, stiffness: 220, mass: 1 }

export function TiltCard({
  children,
  className = '',
  rotateAmplitude = 8,
  scaleOnHover = 1.03,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(useMotionValue(0), springValues)
  const rotateY = useSpring(useMotionValue(0), springValues)
  const scale = useSpring(1, springValues)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude)
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, scale, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => scale.set(scaleOnHover)}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}
