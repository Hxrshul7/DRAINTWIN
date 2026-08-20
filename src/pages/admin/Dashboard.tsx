import { useMemo, useState } from 'react'
import { Route, Ruler, AlertTriangle, Flame, Wrench, Radio, MapPin } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import DrainMap from '../../components/maps/DrainMap'
import DrainDetailsPanel from '../../components/maps/DrainDetailsPanel'
import { useAppStore } from '../../context/AppStore'
import { sensorSummary, sensors } from '../../data/sensors'
import Panel from '../../components/ui/Panel'
import Button from '../../components/ui/Button'

export default function Dashboard() {
  const drains = useAppStore((s) => s.drains)
  const createWorkOrder = useAppStore((s) => s.createWorkOrder)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [layer, setLayer] = useState<'risk' | 'sensors'>('risk')

  const selected = useMemo(() => drains.find((d) => d.id === selectedId) || null, [drains, selectedId])

  const stats = useMemo(() => {
    const high = drains.filter((d) => d.riskLevel === 'high').length
    const critical = drains.filter((d) => d.riskLevel === 'critical').length
    const desilt = drains.filter((d) => d.recommendedAction === 'DESILT' || d.siltLevel > 35).length
    return { high, critical, desilt }
  }, [drains])

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">City Drainage Command Center</h1>
          <p className="mt-1 text-sm text-slate-400">Pre-monsoon risk intelligence and drainage network monitoring</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <MapPin size={13} className="text-cyan-400" /> Pune Municipal Area
          <span className="mx-1 text-slate-600">•</span>
          {new Date().toLocaleString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Drain Network" value="1,248 km" icon={Route} tone="accent" delay={0} />
        <StatCard label="Monitored Segments" value="3,842" icon={Ruler} delay={40} />
        <StatCard label="High-Risk Segments" value={String(stats.high + 29)} icon={AlertTriangle} tone="high" delay={80} />
        <StatCard label="Critical Hotspots" value={String(stats.critical + 6)} icon={Flame} tone="critical" delay={120} />
        <StatCard label="Desilting Priority" value={`${stats.desilt} segments`} icon={Wrench} tone="medium" delay={160} />
        <StatCard label="Sensors Online" value={`${sensorSummary.online} / ${sensorSummary.total}`} icon={Radio} tone="low" delay={200} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Panel
          noPadding
          className="h-[560px] overflow-hidden"
          title="Live Drainage Network"
          subtitle="Click a segment to view details"
          action={
            <div className="flex gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-0.5 text-xs">
              <button
                onClick={() => setLayer('risk')}
                className={`rounded-md px-2.5 py-1 font-semibold ${layer === 'risk' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              >
                Risk
              </button>
              <button
                onClick={() => setLayer('sensors')}
                className={`rounded-md px-2.5 py-1 font-semibold ${layer === 'sensors' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              >
                Sensors
              </button>
            </div>
          }
        >
          <div className="h-[500px]">
            <DrainMap
              drains={drains}
              sensors={sensors}
              showSensors={layer === 'sensors'}
              selectedId={selectedId}
              onSelectDrain={setSelectedId}
            />
          </div>
        </Panel>

        <div className="h-[560px]">
          {selected ? (
            <DrainDetailsPanel
              drain={selected}
              onClose={() => setSelectedId(null)}
              onCreateWorkOrder={(d) => createWorkOrder(d.id, 'W-01')}
            />
          ) : (
            <Panel className="flex h-full items-center justify-center text-center" title="Segment Details">
              <div>
                <p className="text-sm text-slate-400">Select a drain segment on the map to view risk details and recommended action.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                  <Button size="sm" variant="secondary" onClick={() => setSelectedId('D-104')}>
                    View D-104 (Critical)
                  </Button>
                </div>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  )
}
