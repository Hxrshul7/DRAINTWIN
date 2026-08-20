import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  fullWidth?: boolean
}

const variants: Record<string, string> = {
  primary: 'bg-cyan-500 text-navy-950 hover:bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]',
  secondary: 'bg-white/5 text-slate-100 border border-white/10 hover:bg-white/10 hover:border-white/20',
  ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
  danger: 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 hover:border-red-500/50',
  success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 hover:border-emerald-500/50',
}

const sizes: Record<string, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-xl',
  md: 'text-sm px-4 py-2.5 rounded-xl',
  lg: 'text-base px-6 py-3.5 rounded-2xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
