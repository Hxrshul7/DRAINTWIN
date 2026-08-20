import type { ReactNode } from 'react'

export default function Panel({
  title,
  subtitle,
  action,
  children,
  className = '',
  noPadding = false,
}: {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  noPadding?: boolean
}) {
  return (
    <div className={`glass rounded-2xl overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-white/[0.01]">
          <div>
            {title && <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  )
}
