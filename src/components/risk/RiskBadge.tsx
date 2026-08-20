import type { RiskLevel } from '../../types'
import { riskLabel, riskBgClass } from '../../services/riskService'
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react'

const icons: Record<RiskLevel, React.ElementType> = {
  critical: AlertTriangle,
  high: AlertCircle,
  medium: Info,
  low: CheckCircle2,
}

export default function RiskBadge({ level, size = 'md' }: { level: RiskLevel; size?: 'sm' | 'md' }) {
  const Icon = icons[level]
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5'
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold tracking-wide ${riskBgClass[level]} ${sizeClass}`}
    >
      <Icon size={size === 'sm' ? 10 : 12} />
      {riskLabel[level]}
    </span>
  )
}
