import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
  variant?: 'default' | 'bright' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

const PADDING_MAP: Record<NonNullable<Props['padding']>, string> = {
  none: '0px',
  sm: '12px',
  md: '20px',
  lg: '28px',
}

export default function Panel({ variant = 'default', padding = 'md', className, style, children }: Props) {
  const mergedStyle: React.CSSProperties = {
    padding: PADDING_MAP[padding],
    ...style,
  }

  if (variant === 'elevated') {
    Object.assign(mergedStyle, {
      background: 'var(--color-bg-elevated)',
      border: '1px solid var(--color-border-dim)',
      borderRadius: 12,
    })
    return (
      <div className={cn(className)} style={mergedStyle}>
        {children}
      </div>
    )
  }

  const classForGlass = variant === 'bright' ? 'glass-bright' : 'glass'
  return (
    <div className={cn(classForGlass, className)} style={mergedStyle}>
      {children}
    </div>
  )
}
