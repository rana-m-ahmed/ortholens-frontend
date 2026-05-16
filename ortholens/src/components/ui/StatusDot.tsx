import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
  status: 'online' | 'offline' | 'checking'
  label?: string
  className?: string
}

export default function StatusDot({ status, label, className }: Props) {
  const dotBase = 'relative inline-flex items-center'
  const dotColor =
    status === 'online'
      ? 'var(--color-normal)'
      : status === 'offline'
      ? 'var(--color-fracture)'
      : 'var(--color-text-muted)'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={dotBase} style={{ width: 8, height: 8 }}>
        {status === 'online' && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 8,
              height: 8,
              borderRadius: 8,
              background: 'var(--color-normal)',
              animation: 'status-ping 1200ms ease-out infinite',
              opacity: 0.35,
            }}
          />
        )}

        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 8,
            background: dotColor,
          }}
          className={status === 'checking' ? 'animate-pulse' : undefined}
        />
      </div>

      {label ? <span className="mono-label">{label}</span> : null}
    </div>
  )
}
// TODO: Prompt 3

export default function StatusDot() {
  return null
}
