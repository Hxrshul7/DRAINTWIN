import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Flame, HardHat, ListChecks, MapPinned, Play } from 'lucide-react'
import { useAppStore } from '../../context/AppStore'
import { currentWorker } from '../../data/workers'
import TaskCard from '../../components/tasks/TaskCard'

export default function WorkerDashboard() {
  const navigate = useNavigate()
  const drains = useAppStore((s) => s.drains)

  const myTasks = useMemo(
    () => drains.filter((d) => d.assignedTo === currentWorker.id && d.status !== 'completed').sort((a, b) => b.riskScore - a.riskScore),
    [drains]
  )

  const completedToday = useMemo(
    () => drains.filter((d) => d.assignedTo === currentWorker.id && d.status === 'completed').length,
    [drains]
  )

  const criticalCount = useMemo(
    () => myTasks.filter((d) => d.riskLevel === 'critical' || d.riskLevel === 'high').length,
    [myTasks]
  )

  return (
    <div className="px-4 py-5 max-w-4xl mx-auto space-y-5">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Good morning, {currentWorker.name.split(' ')[0]}
          </p>
          <h1 className="mt-0.5 text-2xl font-bold text-white">
            {myTasks.length} Task{myTasks.length !== 1 ? 's' : ''} Assigned Today
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Assigned Ward: {currentWorker.ward}</p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={13} className="text-cyan-400" /> Back to Portal Selection
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <div className="glass rounded-2xl p-3.5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">Active</span>
            <ListChecks size={14} className="text-cyan-400" />
          </div>
          <p className="mt-1 text-2xl font-bold text-white font-mono">{myTasks.length}</p>
        </div>

        <div className="glass rounded-2xl p-3.5 border border-red-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="text-[10px] uppercase font-bold text-red-400">Critical</span>
            <Flame size={14} className="text-red-400" />
          </div>
          <p className="mt-1 text-2xl font-bold text-white font-mono">{criticalCount}</p>
        </div>

        <div className="glass rounded-2xl p-3.5 border border-green-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="text-[10px] uppercase font-bold text-green-400">Completed</span>
            <CheckCircle2 size={14} className="text-green-400" />
          </div>
          <p className="mt-1 text-2xl font-bold text-white font-mono">{completedToday}</p>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate('/worker/map')}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-slate-200 transition-all hover:bg-white/10"
        >
          <MapPinned size={14} className="text-cyan-400" /> View Map Overview
        </button>
        <button
          onClick={() => navigate('/worker/tasks')}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-slate-200 transition-all hover:bg-white/10"
        >
          <ListChecks size={14} className="text-amber-400" /> All Task Queue
        </button>
      </div>

      {/* Task List */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">High-Priority Interventions</p>
        <div className="space-y-3">
          {myTasks.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center text-sm text-slate-400">
              <CheckCircle2 size={28} className="mx-auto text-green-400 mb-2" />
              <p className="font-semibold text-white">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">No pending work orders assigned for your ward right now.</p>
            </div>
          )}
          {myTasks.map((d, i) => (
            <TaskCard key={d.id} drain={d} distanceKm={Number((1.2 + i * 0.6).toFixed(1))} />
          ))}
        </div>
      </div>
    </div>
  )
}
