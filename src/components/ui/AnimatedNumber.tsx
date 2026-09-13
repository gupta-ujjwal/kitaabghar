import { useEffect, useState } from 'react'
import { motion, useSpring } from 'motion/react'

/**
 * Spring-based count-up. Technique adapted from Skiper UI's "Animated Number"
 * (skiper-ui.com/components, skiper37), rebuilt as a single-purpose component
 * driven by motion/react instead of the original's number-flow dependency.
 */
interface AnimatedNumberProps {
  value: number
  className?: string
  formatter?: (n: number) => string
}

export function AnimatedNumber({ value, className, formatter }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0)
  const spring = useSpring(0, { bounce: 0, duration: 1200 })

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplay(Math.round(latest))
    })
    return unsubscribe
  }, [spring])

  return (
    <motion.span className={className}>
      {formatter ? formatter(display) : display.toLocaleString()}
    </motion.span>
  )
}
