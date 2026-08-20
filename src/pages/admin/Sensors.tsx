import { useState } from 'react'
import { Radio, Waves, Gauge, Activity, CloudRain, X } from 'lucide-react'
import Panel from '../../components/ui/Panel'
import StatCard from '../../components/ui/StatCard'
import SensorCard from '../../components/sensors/SensorCard'
import DrainMap from '../../components/maps/DrainMap'
import SimBadge from '../../components/ui/SimBadge'
import { sensors, sensorSummary } from '../../data/sensors'
import { drainSegments } from '../../data/drains'
import type { Sensor } from '../../types'

const typeIcons: Record<string, React.ElementType> = {
  'Ultrasonic Water Level': Waves,
  'Radar Water Level': Radio,
  'Pressure Level': Gauge,
  'Area Velocity / Doppler': Activity,
  'Rain Gauge': CloudRain,
}

export default function Sensors() {
  const [selected, setSelected] = useState<Sensor | null>(null)

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Drainage Sensor Network</h1>
          <p className="mt-1 text-sm text-slate-400">Sensors are a future deployment layer — data below is simulated</p>
        </div>
        <SimBadge />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Sensors" value={String(sensorSummary.total)} icon={Radio} tone="accent" />
        <StatCard label="Online" value={String(sensorSummary.online)} icon={Radio} tone="low" />
        <StatCard label="Offline" value={String(sensorSummary.offline)} icon={Radio} tone="default" />
        <StatCard label="Maintenance" value={String(sensorSummary.maintenance)} icon={Radio} tone="medium" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.05] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Current Prototype</p>
          <p className="mt-1 text-sm text-slate-300">Simulated sensor data across representative junctions.</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Future Pilot</p>
          <p className="mt-1 text-sm text-slate-300">Strategic sensor deployment at high-risk junctions.</p>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-green-500/[0.05] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-400">Production</p>
          <p className="mt-1 text-sm text-slate-300">Real-time IoT network feeding the digital twin continuously.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Panel noPadding className="h-[420px] overflow-hidden" title="Sensor Map">
          <div className="h-[380px]">
            <DrainMap drains={drainSegments} sensors={sensors} showSensors selectedId={null} />
          </div>
        </Panel>

        {selected ? (
          <Panel title={selected.id} action={<button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white"><X size={16} /></button>}>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-400">Type</dt><dd className="text-white">{selected.type}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-400">Location</dt><dd className="text-white">{selected.junctionId}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-400">Water Level</dt><dd className="font-mono text-white">{selected.waterLevelM.toFixed(2)} m</dd></div>
              <div className="flex justify-between"><dt className="text-slate-400">Normal Level</dt><dd className="font-mono text-white">{selected.normalLevelM.toFixed(2)} m</dd></div>
              <div className="flex justify-between"><dt className="text-slate-400">Status</dt><dd className="font-semibold uppercase text-amber-400">{selected.alertLevel}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-400">Battery</dt><dd className="font-mono text-white">{selected.batteryPct}%</dd></div>
              <div className="flex justify-between"><dt className="text-slate-400">Last Update</dt><dd className="text-white">{selected.lastUpdateSec} sec ago</dd></div>
            </dl>
          </Panel>
        ) : (
          <Panel title="Sensor Types">
            <div className="space-y-2 text-sm text-slate-300">
              {Object.entries(typeIcons).map(([name, Icon]) => (
                <div key={name} className="flex items-center gap-2">
                  <Icon size={14} className="text-cyan-400" /> {name}
                </div>
              ))}
            </div>
          </Panel>
        )}
      </div>

      <Panel title="All Sensors" noPadding>
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {sensors.slice(0, 18).map((s) => (
            <SensorCard key={s.id} sensor={s} onClick={() => setSelected(s)} />
          ))}
        </div>
      </Panel>
    </div>
  )
}
