export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-slate-800 ${className}`}>
      <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${pct}%` }} />
    </div>
  )
}
