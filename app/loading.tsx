export default function Loading() {
  return (
    <div
      className="min-h-dvh flex items-center justify-center"
      style={{ background: 'var(--void)' }}
      role="status"
      aria-label="Loading"
    >
      <div className="flex items-center gap-3">
        <span className="dot-pulse" aria-hidden="true" />
        <span className="t-system">loading…</span>
      </div>
    </div>
  )
}
