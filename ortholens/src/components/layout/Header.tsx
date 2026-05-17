'use client'

import { useEffect, useState } from 'react'
import Badge from '@/components/ui/Badge'
import StatusDot from '@/components/ui/StatusDot'
import { HEALTH_URL } from '@/lib/constants'

type BackendStatus = 'checking' | 'online' | 'offline'

export default function Header() {
  const [status, setStatus] = useState<BackendStatus>('checking')

  useEffect(() => {
    let isMounted = true

    const checkHealth = async () => {
      try {
        const response = await fetch(HEALTH_URL, {
          signal: AbortSignal.timeout(5000),
          cache: 'no-store',
        })

        const payload = await response.json().catch(() => null)
        const isOk = response.ok && payload?.status === 'ok'
        if (isMounted) {
          setStatus(isOk ? 'online' : 'offline')
        }
      } catch {
        if (isMounted) {
          setStatus('offline')
        }
      }
    }

    checkHealth()

    return () => {
      isMounted = false
    }
  }, [])

  const label =
    status === 'checking'
      ? 'checking…'
      : status === 'online'
      ? 'backend online'
      : 'backend offline'

  const statusElement = <StatusDot status={status} label={label} />

  return (
    <header
      role="banner"
      className="glass-bright sticky top-0 z-50"
      style={{ borderBottom: '1px solid var(--color-border-dim)', height: 56 }}
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <ellipse cx="12" cy="4.5" rx="4.2" ry="2.8" fill="var(--color-accent)" />
            <rect x="9.2" y="6.2" width="5.6" height="11.6" rx="2.4" fill="var(--color-accent)" />
            <ellipse cx="12" cy="19.5" rx="4.2" ry="2.8" fill="var(--color-accent)" />
          </svg>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                fontFamily: 'Space Grotesk, system-ui, sans-serif',
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              OrthoLens
            </span>
            <sup style={{ lineHeight: 1 }}>
              <Badge label="AI" variant="accent" size="xs" />
            </sup>
          </div>
        </div>

        {status === 'offline' ? (
          <span
            title="The analysis backend is currently unreachable. Uploads will fail."
            style={{ cursor: 'help' }}
          >
            {statusElement}
          </span>
        ) : (
          statusElement
        )}
      </div>
    </header>
  )
}
