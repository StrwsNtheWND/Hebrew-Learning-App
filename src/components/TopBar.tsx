import { useNavigate } from 'react-router-dom'

export function TopBar({ title, onBack }: { title: string; onBack?: boolean }) {
  const navigate = useNavigate()
  return (
    <header className="safe-top sticky top-0 z-10 flex items-center gap-3 border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur">
      {onBack && (
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-200" aria-label="Back">
          ←
        </button>
      )}
      <h1 className="text-base font-semibold text-slate-100">{title}</h1>
    </header>
  )
}
