import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigation, PlayCircle, ArrowLeft, Home, Layers } from 'lucide-react'
import DrainMap from '../../components/maps/DrainMap'
import RiskBadge from '../../components/risk/RiskBadge'
import Button from '../../components/ui/Button'
import { useAppStore } from '../../context/AppStore'
import { currentWorker } from '../../data/workers'

export default function WorkerMap() {
  const drains = useAppStore((s) => s.drains)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const navigate = useNavigate()

  const myDrains = useMemo(() => drains.filter((d) => d.assignedTo === currentWorker.id), [drains])
  const selected = drains.find((d) => d.id === selectedId)

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-navy-900/60 backdrop-blur">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/worker')}
            className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <ArrowLeft size={13} className="text-cyan-400" /> Back to Dashboard
          </button>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200"
          title="Back to Portal Selection"
        >
          <Home size={13} /> Home
        </button>
      </div>

      <div className="h-3/5">
        <DrainMap drains={drains} selectedId={selectedId} onSelectDrain={setSelectedId} height="100%" />
      </div>

      <div className="flex-1 overflow-y-auto border-t border-white/10 bg-navy-900/80 p-4">
        {!selected ? (
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Tasks In Your Ward</p>
            <div className="space-y-2">
              {myDrains.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedId(d.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-left transition-all hover:bg-white/5 hover:border-cyan-500/30"
                >
                  <div>
                    <p className="font-mono text-sm font-bold text-white">{d.id}</p>
                    <p className="text-xs text-slate-400">{d.ward} · {d.recommendedAction.replace('_', ' ')}</p>
                  </div>
                  <RiskBadge level={d.riskLevel} size="sm" />
                </button>
              ))}
              {myDrains.length === 0 && <p className="text-xs text-slate-400">No assigned drains on the map yet.</p>}
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between">
              <p className="font-mono text-lg font-bold text-white">{selected.id}</p>
              <button
                onClick={() => setSelectedId(null)}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                Clear Selection
              </button>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mt-0.5">
              {selected.recommendedAction === 'DESILT' ? 'DESILTING REQUIRED' : selected.recommendedAction.replace('_', ' ')}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <RiskBadge level={selected.riskLevel} />
              <span className="text-xs text-slate-400 font-mono">Risk: {selected.riskScore}/100</span>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Inspection Context</p>
            <ul className="mt-1 space-y-1 text-xs text-slate-300">
              {selected.siltLevel > 30 && <li>• {selected.siltLevel}% estimated silt depth</li>}
              <li>• Effective capacity {selected.effectiveCapacity.toFixed(1)} / {selected.capacity.toFixed(1)} m³/s</li>
              {selected.historicalFloods > 0 && <li>• {selected.historicalFloods} historical waterlogging events</li>}
            </ul>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" icon={<Navigation size={14} />} fullWidth>Navigate</Button>
              <Button icon={<PlayCircle size={14} />} fullWidth onClick={() => navigate(`/worker/task/${selected.id}`)}>
                Start Task
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
