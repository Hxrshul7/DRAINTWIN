import { useNavigate } from 'react-router-dom'
import { MapPin, ArrowRight, AlertTriangle } from 'lucide-react'
import type { DrainSegment } from '../../types'
import RiskBadge from '../risk/RiskBadge'

export default function TaskCard({ drain, distanceKm }: { drain: DrainSegment; distanceKm?: number }) {
  const navigate = useNavigate()
  const urgent = drain.riskLevel === 'critical'

  return (
    <button
      onClick={() => navigate(`/worker/task/${drain.id}`)}
      className={`group w-full rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${
        urgent
          ? 'border-red-500/40 bg-red-500/[0.08] shadow-[0_0_20px_rgba(239,68,68,0.12)] hover:border-red-500/60'
          : 'border-white/10 bg-white/[0.03] hover:border-cyan-500/30 hover:bg-white/[0.06]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {urgent && (
            <span className="flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-white">
              <AlertTriangle size={10} /> URGENT
            </span>
          )}
          <span className="font-mono text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">{drain.id}</span>
        </div>
        <RiskBadge level={drain.riskLevel} size="sm" />
      </div>

      <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
        <MapPin size={12} className="text-cyan-400 shrink-0" />
        <span>{drain.ward}</span>
        <span className="text-slate-600">•</span>
        <span className="text-amber-400 font-semibold">{drain.siltLevel}% Silt</span>
      </div>

      <div className="mt-3.5 flex items-center justify-between border-t border-white/5 pt-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {drain.recommendedAction.replace('_', ' ')}
          </p>
          <p className="text-xs font-semibold text-slate-200">Dispatch Priority #{drain.priority}</p>
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform">
          {distanceKm && <span className="text-xs text-slate-400 font-mono">{distanceKm} km</span>}
          <ArrowRight size={15} />
        </div>
      </div>
    </button>
  )
}
