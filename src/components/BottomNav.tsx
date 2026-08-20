import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/review', label: 'Review', icon: '🔁' },
  { to: '/scenarios', label: 'Talk', icon: '💬' },
  { to: '/stats', label: 'Stats', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export function BottomNav() {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-slate-800 bg-slate-950/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {tabs.map((tab) => (
          <li key={tab.to} className="flex-1">
            <NavLink
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
                  isActive ? 'text-amber-400' : 'text-slate-500'
                }`
              }
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
