import { useMemo, useState } from 'react'
import { Download, UserPlus, Eye, IndianRupee } from 'lucide-react'
import Panel from '../../components/ui/Panel'
import Button from '../../components/ui/Button'
import RiskBadge from '../../components/risk/RiskBadge'
import SimBadge from '../../components/ui/SimBadge'
import { useAppStore } from '../../context/AppStore'
import { workers } from '../../data/workers'

const statusStyle: Record<string, string> = {
  normal: 'text-slate-400 bg-slate-500/10',
  pending: 'text-slate-300 bg-slate-500/15',
  assigned: 'text-blue-400 bg-blue-500/10',
  in_progress: 'text-amber-400 bg-amber-500/10',
  completed: 'text-green-400 bg-green-500/10',
  watch: 'text-yellow-400 bg-yellow-500/10',
}

export default function Interventions() {
  const drains = useAppStore((s) => s.drains)
  const createWorkOrder = useAppStore((s) => s.createWorkOrder)
  const [wardFilter, setWardFilter] = useState('All')
  const [actionFilter, setActionFilter] = useState('All')

  const wards = useMemo(() => ['All', ...Array.from(new Set(drains.map((d) => d.ward)))], [drains])
  const actions = useMemo(() => ['All', ...Array.from(new Set(drains.map((d) => d.recommendedAction)))], [drains])

  const rows = useMemo(() => {
    return drains
      .filter((d) => (wardFilter === 'All' ? true : d.ward === wardFilter))
      .filter((d) => (actionFilter === 'All' ? true : d.recommendedAction === actionFilter))
      .sort((a, b) => b.riskScore - a.riskScore)
  }, [drains, wardFilter, actionFilter])

  const totalCost = drains.reduce((sum, d) => sum + d.estimatedCostINR, 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Priority Intervention Planner</h1>
          <p className="mt-1 text-sm text-slate-400">Ranked action list — what to fix first, and where</p>
        </div>
        <Button size="sm" variant="secondary" icon={<Download size={14} />}>Export Report</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="glass rounded-xl p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Available Maintenance Budget</p>
          <p className="mt-1 flex items-center gap-1 font-mono text-2xl font-bold text-white"><IndianRupee size={18} />5.0 Cr</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Recommended Allocation</p>
          <p className="mt-1 flex items-center gap-1 font-mono text-2xl font-bold text-cyan-400"><IndianRupee size={18} />3.7 Cr</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Potentially Optimized</p>
          <p className="mt-1 flex items-center gap-1 font-mono text-2xl font-bold text-green-400"><IndianRupee size={18} />1.3 Cr</p>
          <SimBadge label="Prototype estimation" />
        </div>
      </div>

      <Panel
        title="Intervention Queue"
        subtitle={`${rows.length} segments · sorted by risk`}
        noPadding
        action={
          <div className="flex flex-wrap gap-2">
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-200"
            >
              {wards.map((w) => <option key={w}>{w}</option>)}
            </select>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-200"
            >
              {actions.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-semibold">Priority</th>
                <th className="px-3 py-3 font-semibold">Drain ID</th>
                <th className="px-3 py-3 font-semibold">Location</th>
                <th className="px-3 py-3 font-semibold">Risk</th>
                <th className="px-3 py-3 font-semibold">Issue</th>
                <th className="px-3 py-3 font-semibold">Action</th>
                <th className="px-3 py-3 font-semibold">Est. Cost</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 font-mono font-bold text-cyan-400">{d.priority}</td>
                  <td className="px-3 py-3 font-mono font-semibold text-white">{d.id}</td>
                  <td className="px-3 py-3 text-slate-300">{d.ward}</td>
                  <td className="px-3 py-3"><RiskBadge level={d.riskLevel} size="sm" /></td>
                  <td className="px-3 py-3 text-slate-400">
                    {d.siltLevel > 40 ? 'High silt + low capacity' : d.historicalFloods > 2 ? 'Historical flooding' : 'Blockage risk'}
                  </td>
                  <td className="px-3 py-3 font-semibold text-slate-200">{d.recommendedAction.replace('_', ' ')}</td>
                  <td className="px-3 py-3 font-mono text-slate-300">₹{(d.estimatedCostINR / 100000).toFixed(1)}L</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusStyle[d.status]}`}>
                      {d.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5">
                      {d.status === 'normal' || d.status === 'pending' ? (
                        <button
                          onClick={() => createWorkOrder(d.id, workers[0].id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400"
                          title="Assign"
                        >
                          <UserPlus size={14} />
                        </button>
                      ) : (
                        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white" title="View">
                          <Eye size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <p className="text-[11px] text-slate-600">
        Total estimated intervention cost across all listed segments: ₹{(totalCost / 100000).toFixed(1)} lakh. Prototype
        estimation only — actual costs depend on ground survey and procurement.
      </p>
    </div>
  )
}
