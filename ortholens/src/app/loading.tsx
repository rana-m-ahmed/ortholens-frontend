export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-base)]">
      <div
        aria-label="Loading"
        className="animate-ping-slow"
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'var(--color-accent)',
          boxShadow: '0 0 18px rgba(0,229,255,0.6)',
        }}
      />
    </div>
  )
}
