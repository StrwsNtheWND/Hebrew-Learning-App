import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-4 ${className}`} {...rest} />
}
