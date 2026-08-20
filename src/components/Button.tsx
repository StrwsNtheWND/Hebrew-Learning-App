import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-amber-500 text-slate-950 hover:bg-amber-400 active:bg-amber-600',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-600',
  ghost: 'bg-transparent text-slate-300 hover:bg-slate-800',
  danger: 'bg-red-900/40 text-red-300 hover:bg-red-900/60',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
}

export function Button({ variant = 'primary', fullWidth, className = '', ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    />
  )
}
