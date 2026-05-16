import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Spinner from './Spinner'

type Props = {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
  children: React.ReactNode
}

export default function Button({
  variant = 'outline',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading,
  disabled,
  onClick,
  type = 'button',
  className,
  children,
}: Props) {
  const isDisabled = Boolean(disabled || isLoading)

  const baseStyle: React.CSSProperties = {
    borderRadius: 8,
    fontFamily: 'JetBrains Mono, monospace',
    letterSpacing: '0.04em',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
  }

  const variantStyle: React.CSSProperties =
    variant === 'primary'
      ? { background: 'var(--color-accent)', color: 'var(--color-bg-base)', fontWeight: 500, border: 'none' }
      : variant === 'outline'
      ? { background: 'transparent', border: '1px solid var(--color-border-soft)', color: 'var(--color-accent)' }
      : { background: 'transparent', border: 'none', color: 'var(--color-text-secondary)' }

  const hoverStyles: React.CSSProperties =
    variant === 'outline'
      ? { borderColor: 'var(--color-border-bright)', background: 'var(--color-accent-dim)' }
      : variant === 'ghost'
      ? { color: 'var(--color-text-primary)' }
      : {}

  const sizeStyle: React.CSSProperties = size === 'sm' ? { padding: '6px 14px', fontSize: 13 } : { padding: '9px 20px', fontSize: 14 }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.97 }}
      transition={{ duration: 0.15 }}
      className={cn(className)}
      style={{ ...baseStyle, ...variantStyle, ...sizeStyle }}
      onMouseEnter={(e) => {
        if (isDisabled) return
        Object.assign((e.currentTarget as HTMLElement).style, hoverStyles)
      }}
      onMouseLeave={(e) => {
        if (isDisabled) return
        Object.assign((e.currentTarget as HTMLElement).style, { ...(variantStyle as object), ...sizeStyle })
      }}
    >
      {isLoading ? <Spinner size="sm" /> : leftIcon}
      <span>{children}</span>
      {rightIcon}
    </motion.button>
  )
}
// TODO: Prompt 3

export default function Button() {
  return null
}
