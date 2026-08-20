import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileCheck2, ArrowLeft, Home, FileText } from 'lucide-react'
import { useAppStore } from '../../context/AppStore'
import { currentWorker } from '../../data/workers'

export default function WorkerReports() {
  const navigate = useNavigate()
  const drains = useAppStore((s) => s.drains)
  const completed = useMemo(
    () => drains.filter((d) => d.assignedTo === currentWorker.id && d.status === 'completed'),
    [drains]
  )

  return (
    <div className="px-4 py-5 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white">Work History &amp; Reports</h1>
          <p className="text-xs text-slate-400">Inspections and desilting completed by {currentWorker.name}</p>
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

      <div className="mt-5 space-y-2.5">
        {completed.length === 0 && (
          <div className="glass rounded-2xl p-8 text-center text-xs text-slate-400">
            <FileText size={28} className="mx-auto text-slate-500 mb-2" />
            <p className="font-semibold text-white">No completed work reports yet</p>
            <p className="text-slate-400 mt-1">When you finish a task, full inspection logs and before/after records will appear here.</p>
          </div>
        )}
        {completed.map((d) => (
          <div key={d.id} className="glass rounded-xl p-4 flex items-center gap-3.5 border border-white/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/15 text-green-400 border border-green-500/30">
              <FileCheck2 size={18} />
            </div>
            <div className="flex-1">
              <p className="font-mono text-sm font-bold text-white">{d.id} — {d.recommendedAction.replace('_', ' ')}</p>
              <p className="text-xs text-slate-400 mt-0.5">{d.ward} · Resolved on {new Date(d.lastDesilted).toLocaleDateString('en-IN')}</p>
            </div>
            <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-1 text-[10px] font-bold text-green-400">
              VERIFIED
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
