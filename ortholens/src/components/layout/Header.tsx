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
    let intervalId: number | undefined

    const checkHealth = async () => {
      if (!isMounted) return

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        if (isMounted) setStatus('offline')
        return
      }

      try {
        if (isMounted) setStatus('checking')

        const controller = new AbortController()
        const timeout = window.setTimeout(() => controller.abort(), 5000)

        let response: Response
        try {
          response = await fetch(HEALTH_URL, {
            signal: controller.signal,
            cache: 'no-store',
          })
        } finally {
          clearTimeout(timeout)
        }

        let payload: any = null
        try {
          payload = await response.json()
        } catch {
          payload = null
        }

        const isOk = response.ok && payload?.status === 'ok'
        if (isMounted) setStatus(isOk ? 'online' : 'offline')
      } catch {
        if (isMounted) setStatus('offline')
      }
    }

    // Initial check and periodic polling
    checkHealth()
    intervalId = window.setInterval(checkHealth, 30000)

    const handleOnline = () => {
      checkHealth()
    }

    const handleOffline = () => {
      if (isMounted) setStatus('offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      isMounted = false
      if (intervalId) clearInterval(intervalId)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
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
