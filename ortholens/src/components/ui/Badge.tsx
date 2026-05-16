import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
  label: string
  variant: 'accent' | 'fracture' | 'normal' | 'warning' | 'dim'
  size?: 'xs' | 'sm'
  className?: string
}

const VARIANTS: Record<Props['variant'], React.CSSProperties> = {
  accent: {
    background: 'var(--color-accent-dim)',
    color: 'var(--color-accent)',
    border: '1px solid var(--color-border-soft)',
  },
  fracture: {
    background: 'var(--color-fracture-dim)',
    color: 'var(--color-fracture)',
    border: '1px solid rgba(255,56,96,0.25)',
  },
  normal: {
    background: 'var(--color-normal-dim)',
    color: 'var(--color-normal)',
    border: '1px solid rgba(0,214,143,0.25)',
  },
  warning: {
    background: 'var(--color-warning-dim)',
    color: 'var(--color-warning)',
    border: '1px solid rgba(255,184,77,0.25)',
  },
  dim: {
    background: 'var(--color-bg-elevated)',
    color: 'var(--color-text-muted)',
    border: '1px solid var(--color-border-dim)',
  },
}

export default function Badge({ label, variant, size = 'sm', className }: Props) {
  const style = VARIANTS[variant]
  const sizeStyle: React.CSSProperties = size === 'xs'
    ? { fontSize: 10, padding: '2px 6px' }
    : { fontSize: 11, padding: '3px 8px' }

  return (
    <span
      className={cn('inline-flex items-center', className)}
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        borderRadius: 4,
        ...style,
        ...sizeStyle,
      }}
    >
      {label}
    </span>
  )
}
// TODO: Prompt 3

export default function Badge() {
  return null
}
