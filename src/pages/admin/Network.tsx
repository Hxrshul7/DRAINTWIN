import { useMemo, useState } from 'react'
import { Gauge, Droplets, History, Radio as RadioIcon, CloudRain, ListChecks } from 'lucide-react'
import DrainMap from '../../components/maps/DrainMap'
import DrainDetailsPanel from '../../components/maps/DrainDetailsPanel'
import Panel from '../../components/ui/Panel'
import { useAppStore } from '../../context/AppStore'
import { sensors } from '../../data/sensors'

const layers = [
  { id: 'risk', label: 'Risk', icon: Gauge },
  { id: 'sensors', label: 'Sensors', icon: RadioIcon },
]

export default function Network() {
  const drains = useAppStore((s) => s.drains)
  const createWorkOrder = useAppStore((s) => s.createWorkOrder)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeLayer, setActiveLayer] = useState('risk')

  const selected = useMemo(() => drains.find((d) => d.id === selectedId) || null, [drains, selectedId])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Drainage Network</h1>
        <p className="mt-1 text-sm text-slate-400">Synthetic demo topology · capacity, silt, and historical flooding overlays</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr_360px]">
        <Panel title="Map Layers" className="h-fit">
          <div className="space-y-1">
            {layers.map((l) => (
              <button
                key={l.id}
                onClick={() => setActiveLayer(l.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeLayer === l.id ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                <l.icon size={15} /> {l.label}
              </button>
            ))}
            <div className="mt-3 space-y-1 border-t border-white/5 pt-3 text-xs text-slate-500">
              <p className="flex items-center gap-2"><Droplets size={12} /> Drain capacity</p>
              <p className="flex items-center gap-2"><History size={12} /> Historical flooding</p>
              <p className="flex items-center gap-2"><CloudRain size={12} /> Rainfall overlay</p>
              <p className="flex items-center gap-2"><ListChecks size={12} /> Interventions</p>
              <p className="mt-1 text-[10px] text-slate-600">Additional overlays available in full deployment.</p>
            </div>
          </div>
        </Panel>

        <Panel noPadding className="h-[600px] overflow-hidden">
          <div className="h-[600px]">
            <DrainMap
              drains={drains}
              sensors={sensors}
              showSensors={activeLayer === 'sensors'}
              selectedId={selectedId}
              onSelectDrain={setSelectedId}
            />
          </div>
        </Panel>

        <div className="h-[600px]">
          {selected ? (
            <DrainDetailsPanel
              drain={selected}
              onClose={() => setSelectedId(null)}
              onCreateWorkOrder={(d) => createWorkOrder(d.id, 'W-01')}
            />
          ) : (
            <Panel className="flex h-full items-center justify-center text-center" title="Segment Details">
              <p className="text-sm text-slate-400">Select a drain segment on the map to inspect its condition.</p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  )
}
