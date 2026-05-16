'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSpring } from 'framer-motion'

export function useCountUp(
  target: number,
  options?: { duration?: number; decimals?: number; delay?: number }
): number {
  const spring = useSpring(0, { stiffness: 80, damping: 20 })
  const [value, setValue] = useState(0)

  const safeTarget = useMemo(() => Math.max(0, target), [target])
  const decimals = options?.decimals ?? 1
  const delay = options?.delay ?? 0

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      spring.set(safeTarget)
    }, delay)

    const unsubscribe = spring.on('change', (latest) => {
      const clamped = Math.min(Math.max(latest, 0), safeTarget)
      const rounded = Number(clamped.toFixed(decimals))
      setValue(rounded)
    })

    return () => {
      window.clearTimeout(timeoutId)
      unsubscribe()
    }
  }, [decimals, delay, safeTarget, spring])

  return value
}

export default useCountUp
