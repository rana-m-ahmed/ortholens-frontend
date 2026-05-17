import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-base)] px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="mono-label">404 · PAGE NOT FOUND</div>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '9px 20px',
            borderRadius: 8,
            border: '1px solid var(--color-border-soft)',
            background: 'transparent',
            color: 'var(--color-accent)',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.04em',
            textDecoration: 'none',
          }}
        >
          Return home
        </Link>
      </div>
    </div>
  )
}
