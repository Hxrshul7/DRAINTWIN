import { ChevronRight, Home, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  to?: string
  icon?: React.ElementType
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  showBackButton?: boolean
  backTo?: string
  backLabel?: string
  className?: string
}

export default function Breadcrumb({
  items,
  showBackButton = true,
  backTo = '/',
  backLabel = 'Back',
  className = '',
}: BreadcrumbProps) {
  const navigate = useNavigate()

  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs ${className}`}>
      {showBackButton && (
        <button
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          className="group inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 font-medium text-slate-300 backdrop-blur transition-all hover:border-cyan-500/40 hover:bg-white/[0.08] hover:text-white"
        >
          <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5 text-cyan-400" />
          <span>{backLabel}</span>
        </button>
      )}

      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-slate-400">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-cyan-300 transition-colors p-1 rounded-md"
          title="Back to Home / Portal Selection"
        >
          <Home size={13} />
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const Icon = item.icon

          return (
            <div key={item.label + index} className="flex items-center gap-1.5">
              <ChevronRight size={12} className="text-slate-600" />
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="flex items-center gap-1 font-medium hover:text-cyan-300 transition-colors"
                >
                  {Icon && <Icon size={12} />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className={`flex items-center gap-1 font-semibold ${isLast ? 'text-white' : 'text-slate-400'}`}>
                  {Icon && <Icon size={12} />}
                  <span>{item.label}</span>
                </span>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
