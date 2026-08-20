import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/TopBar'
import { Card } from '../../components/Card'
import { scenarios } from '../../content'
import { DOMAIN_LABELS, REGISTER_LABELS } from '../../types/content'

export function ScenarioList() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      <TopBar title="Mock Conversations" />
      <p className="mt-3 mb-4 text-sm text-slate-400">
        Practice full exchanges, not just isolated words — the way these conversations actually happen on site, with
        clients, and in daily life.
      </p>
      <div className="space-y-2">
        {scenarios.map((s) => (
          <button key={s.id} className="block w-full text-left" onClick={() => navigate(`/scenarios/${s.id}`)}>
            <Card className="hover:border-amber-500/40">
              <p className="text-sm font-semibold text-slate-100">{s.title}</p>
              <p className="mt-1 text-xs text-slate-500">{s.setup}</p>
              <p className="mt-2 text-[11px] uppercase tracking-wide text-amber-500/80">
                {DOMAIN_LABELS[s.domain]} · {REGISTER_LABELS[s.register]}
              </p>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
