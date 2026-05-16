import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
  variant?: 'default' | 'bright' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
}

const PADDING_MAP: Record<NonNullable<Props['padding']>, string> = {
  none: '0px',
  sm: '12px',
  md: '20px',
  lg: '28px',
}

export default function Panel({ variant = 'default', padding = 'md', className, children }: Props) {
  const style: React.CSSProperties = {
    padding: PADDING_MAP[padding],
  }

  if (variant === 'elevated') {
    Object.assign(style, {
      background: 'var(--color-bg-elevated)',
      border: '1px solid var(--color-border-dim)',
      borderRadius: 12,
    })
    return (
      <div className={cn(className)} style={style}>
        {children}
      </div>
    )
  }

  const classForGlass = variant === 'bright' ? 'glass-bright' : 'glass'
  return (
    <div className={cn(classForGlass, className)} style={style}>
      {children}
    </div>
  )
}
// TODO: Prompt 3

export default function Panel() {
  return null
}
