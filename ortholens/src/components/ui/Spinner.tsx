import React from 'react'
import { cn } from '@/lib/utils'

type Props = { size?: 'sm' | 'md' | 'lg'; className?: string }

const SIZE_MAP: Record<NonNullable<Props['size']>, number> = {
  sm: 16,
  md: 24,
  lg: 36,
}

export default function Spinner({ size = 'md', className }: Props) {
  const px = SIZE_MAP[size]
  return (
    <div
      role="status"
      aria-label="loading"
      className={cn(className)}
      style={{
        width: px,
        height: px,
        border: '2px solid var(--color-border-dim)',
        borderTopColor: 'var(--color-accent)',
        borderRadius: '50%',
        animation: 'spin 0.75s linear infinite',
      }}
    />
  )
}
// TODO: Prompt 3

export default function Spinner() {
  return null
}
