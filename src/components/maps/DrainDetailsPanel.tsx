import { X, Droplets, Gauge, History, CalendarClock, MapPinned, IndianRupee } from 'lucide-react'
import type { DrainSegment } from '../../types'
import RiskBadge from '../risk/RiskBadge'
import Button from '../ui/Button'

function Row({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2.5 last:border-0">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Icon size={13} />
        {label}
      </div>
      <span className="text-sm font-semibold text-white font-mono">{value}</span>
    </div>
  )
}

export default function DrainDetailsPanel({
  drain,
  onClose,
  onCreateWorkOrder,
}: {
  drain: DrainSegment
  onClose: () => void
  onCreateWorkOrder?: (drain: DrainSegment) => void
}) {
  return (
    <div className="glass flex h-full w-full flex-col rounded-xl animate-slideIn">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Drain ID</p>
          <h3 className="text-lg font-bold text-white font-mono">{drain.id}</h3>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">{drain.name}</p>
            <p className="text-xs text-slate-400">{drain.ward}</p>
          </div>
          <RiskBadge level={drain.riskLevel} />
        </div>

        <div className="mb-4 rounded-lg border border-white/5 bg-white/[0.02] p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Risk Score</span>
            <span className="font-mono text-2xl font-bold text-white">{drain.riskScore}<span className="text-sm text-slate-500">/100</span></span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${drain.riskScore}%`, backgroundColor: drain.riskLevel === 'critical' ? '#ef4444' : drain.riskLevel === 'high' ? '#f97316' : drain.riskLevel === 'medium' ? '#eab308' : '#22c55e' }}
            />
          </div>
        </div>

        <Row icon={Gauge} label="Drain Capacity" value={`${drain.capacity.toFixed(1)} m³/s`} />
        <Row icon={Droplets} label="Effective Capacity" value={`${drain.effectiveCapacity.toFixed(1)} m³/s`} />
        <Row icon={Gauge} label="Estimated Silt Level" value={`${drain.siltLevel}%`} />
        <Row icon={History} label="Historical Flooding" value={`${drain.historicalFloods} incidents`} />
        <Row icon={CalendarClock} label="Last Desilted" value={new Date(drain.lastDesilted).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} />
        <Row icon={MapPinned} label="Upstream Catchment" value={`${drain.upstreamCatchmentKm2} km²`} />
        <Row icon={IndianRupee} label="Est. Intervention Cost" value={`₹${(drain.estimatedCostINR / 100000).toFixed(1)}L`} />

        <div className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
          <p className="text-[11px] uppercase tracking-wider text-cyan-400">Predicted Waterlogging</p>
          <p className="text-sm font-bold text-white">{drain.predictedWaterlogging.toUpperCase()}</p>
        </div>

        <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="text-[11px] uppercase tracking-wider text-amber-400">Recommended Action</p>
          <p className="text-sm font-bold text-white">{drain.recommendedAction.replace('_', ' ')}</p>
          <p className="mt-1 text-xs text-slate-400">Priority {drain.priority}</p>
        </div>

        {drain.status !== 'completed' && drain.status !== 'assigned' && drain.status !== 'in_progress' && (
          <Button className="mt-4" fullWidth onClick={() => onCreateWorkOrder?.(drain)}>
            Create Work Order
          </Button>
        )}
        {drain.status === 'assigned' && (
          <div className="mt-4 rounded-lg bg-blue-500/10 border border-blue-500/25 px-3 py-2 text-center text-xs font-semibold text-blue-300">
            Assigned to {drain.assignedTo} — awaiting field action
          </div>
        )}
        {drain.status === 'in_progress' && (
          <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/25 px-3 py-2 text-center text-xs font-semibold text-amber-300">
            Inspection in progress
          </div>
        )}
        {drain.status === 'completed' && (
          <div className="mt-4 rounded-lg bg-green-500/10 border border-green-500/25 px-3 py-2 text-center text-xs font-semibold text-green-300">
            Work completed — condition improved
          </div>
        )}
      </div>
    </div>
  )
}
