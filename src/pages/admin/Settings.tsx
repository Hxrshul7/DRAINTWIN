import { useState } from 'react'
import { Database, Boxes, BrainCircuit, Gauge, MonitorSmartphone, Users, ArrowDown, MapPinned, Palette, Check, Home, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Panel from '../../components/ui/Panel'
import SimBadge from '../../components/ui/SimBadge'
import { useTheme, THEME_OPTIONS } from '../../context/ThemeContext'

const stack = [
  { label: 'Data Sources', items: ['OpenStreetMap', 'QGIS / GeoJSON', 'Municipal GIS', 'Rainfall', 'Historical flooding', 'Desilting records', 'Sensors'], icon: MapPinned },
  { label: 'Data Layer', items: ['PostgreSQL', 'PostGIS'], icon: Database },
  { label: 'Digital Twin', items: ['NetworkX', 'SWMM', 'PySWMM'], icon: Boxes },
  { label: 'AI / Analytics', items: ['Python', 'Pandas', 'NumPy', 'Scikit-learn'], icon: BrainCircuit },
  { label: 'Risk Engine', items: ['Waterlogging Risk Score'], icon: Gauge },
  { label: 'Frontend', items: ['React', 'Leaflet', 'Recharts'], icon: MonitorSmartphone },
  { label: 'Users', items: ['Municipal Administrator', 'Municipal Worker'], icon: Users },
]

const wardOptions = [5, 10, 20, 40]

export default function Settings() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [wards, setWards] = useState(10)
  const [networkKm, setNetworkKm] = useState(300)
  const [sensorCount, setSensorCount] = useState(50)
  const [hasGIS, setHasGIS] = useState(false)
  const [hasICCC, setHasICCC] = useState(false)

  const scaleTier = wards <= 5 ? 'ward' : wards <= 20 ? 'multi' : 'large'
  const tierLabel = { ward: 'Ward Pilot', multi: 'Multi-Ward Deployment', large: 'Large City Deployment' }[scaleTier]
  const tierRange = { ward: '₹10–25 lakh', multi: '₹65 lakh – ₹1.5 crore', large: '₹2–10+ crore' }[scaleTier]

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings &amp; Platform Architecture</h1>
          <p className="mt-1 text-sm text-slate-400">Configure display themes, digital-twin architecture and deployment planning</p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={14} className="text-cyan-400" /> Back to Portal Selection
        </button>
      </div>

      {/* Theme Preference Settings */}
      <Panel title="Interface Theme & Appearance" subtitle="Select your preferred high-visibility theme for operations">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                theme === opt.id
                  ? 'border-cyan-500 bg-cyan-500/10 shadow-glow'
                  : 'border-white/10 bg-white/[0.02] hover:bg-white/5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className="h-4 w-4 rounded-full border border-white/20"
                    style={{ backgroundColor: opt.accentColor }}
                  />
                  {theme === opt.id && <Check size={16} className="text-cyan-400" />}
                </div>
                <h4 className="mt-3 text-sm font-bold text-white">{opt.name}</h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{opt.description}</p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400">
                <span>{theme === opt.id ? 'Active' : 'Apply theme'}</span>
              </div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Future Digital Twin Architecture" subtitle="The current prototype frontend simulates this backend">
        <div className="flex flex-col items-stretch gap-2">
          {stack.map((s, i) => (
            <div key={s.label}>
              <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <s.icon size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
                  <p className="text-sm text-slate-200">{s.items.join(' · ')}</p>
                </div>
              </div>
              {i < stack.length - 1 && <ArrowDown size={14} className="mx-auto my-1 text-slate-600" />}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Deployment Cost Estimator" action={<SimBadge label="Concept-stage planning estimate" />}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Number of Wards</p>
            <div className="flex flex-wrap gap-2">
              {wardOptions.map((w) => (
                <button
                  key={w}
                  onClick={() => setWards(w)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${wards === w ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}
                >
                  {w}
                </button>
              ))}
            </div>

            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Drain Network Length (km)</p>
            <input
              type="range" min={20} max={1200} value={networkKm}
              onChange={(e) => setNetworkKm(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
            <p className="text-xs text-slate-400 font-mono mt-1">{networkKm} km</p>

            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Number of Sensors</p>
            <input
              type="range" min={0} max={500} value={sensorCount}
              onChange={(e) => setSensorCount(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
            <p className="text-xs text-slate-400 font-mono mt-1">{sensorCount} sensors</p>

            <div className="mt-4 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={hasGIS} onChange={(e) => setHasGIS(e.target.checked)} className="accent-cyan-500" />
                Existing GIS available
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={hasICCC} onChange={(e) => setHasICCC(e.target.checked)} className="accent-cyan-500" />
                Existing ICCC available
              </label>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.05] p-6 text-center shadow-glow">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">{tierLabel}</p>
            <p className="mt-2 font-mono text-3xl font-bold text-white">{tierRange}</p>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Actual deployment depends on infrastructure, sensor density, integration and procurement.
              {(hasGIS || hasICCC) && ' Existing GIS/ICCC infrastructure may reduce integration cost.'}
            </p>
          </div>
        </div>
      </Panel>
    </div>
  )
}
