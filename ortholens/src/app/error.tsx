'use client'

import { Button } from '@/components/ui'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-base)] px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="mono-label">An unexpected error occurred</div>
        <p style={{ maxWidth: 480, color: 'var(--color-text-secondary)', fontSize: 13 }}>
          {error.message}
        </p>
        <Button variant="outline" onClick={reset}>
          Reload
        </Button>
      </div>
    </div>
  )
}
