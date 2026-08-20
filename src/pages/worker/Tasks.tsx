import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Home, ListChecks } from 'lucide-react'
import { useAppStore } from '../../context/AppStore'
import { currentWorker } from '../../data/workers'
import TaskCard from '../../components/tasks/TaskCard'
import RiskBadge from '../../components/risk/RiskBadge'

export default function WorkerTasks() {
  const navigate = useNavigate()
  const drains = useAppStore((s) => s.drains)

  const mine = useMemo(() => drains.filter((d) => d.assignedTo === currentWorker.id), [drains])
  const active = mine.filter((d) => d.status !== 'completed')
  const done = mine.filter((d) => d.status === 'completed')

  return (
    <div className="px-4 py-5 max-w-3xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white">Work Order Queue</h1>
          <p className="text-xs text-slate-400">Assigned field tasks for {currentWorker.ward}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/worker')}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
          >
            <ArrowLeft size={13} className="text-cyan-400" /> Dashboard
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200"
            title="Portal Selection"
          >
            <Home size={13} />
          </button>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-amber-400">
          Active Work Orders ({active.length})
        </p>
        <div className="space-y-3">
          {active.map((d) => (
            <TaskCard key={d.id} drain={d} />
          ))}
          {active.length === 0 && (
            <div className="glass rounded-xl p-6 text-center text-xs text-slate-400">
              No active tasks pending. Great job!
            </div>
          )}
        </div>
      </div>

      <div className="mt-7">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-green-400">
          Completed Today ({done.length})
        </p>
        <div className="space-y-2">
          {done.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-xl border border-green-500/20 bg-green-500/[0.05] px-3.5 py-3"
            >
              <div>
                <p className="font-mono text-sm font-bold text-white">{d.id}</p>
                <p className="text-xs text-slate-400">{d.ward} · {d.recommendedAction.replace('_', ' ')}</p>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge level={d.riskLevel} size="sm" />
                <CheckCircle2 size={16} className="text-green-400" />
              </div>
            </div>
          ))}
          {done.length === 0 && (
            <p className="text-xs text-slate-500">No completed tasks yet for this shift.</p>
          )}
        </div>
      </div>
    </div>
  )
}
