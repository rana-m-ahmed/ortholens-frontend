'use client'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error }: ErrorPageProps) {
  return (
    <div role="alert" style={{ padding: 24, color: 'var(--color-text-secondary)' }}>
      {error.message}
    </div>
  )
}
