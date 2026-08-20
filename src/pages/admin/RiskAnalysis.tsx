import { useState } from 'react'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis,
  LineChart, Line, Legend,
} from 'recharts'
import { PlayCircle, Loader2 } from 'lucide-react'
import Panel from '../../components/ui/Panel'
import Button from '../../components/ui/Button'
import SimBadge from '../../components/ui/SimBadge'
import { riskDistribution, drainSegments } from '../../data/drains'
import { runScenario } from '../../services/simulationService'
import type { ScenarioInput, ScenarioResult } from '../../types'

const distData = [
  { name: 'Critical', value: riskDistribution.critical, fill: '#ef4444' },
  { name: 'High', value: riskDistribution.high, fill: '#f97316' },
  { name: 'Medium', value: riskDistribution.medium, fill: '#eab308' },
  { name: 'Low', value: riskDistribution.low, fill: '#22c55e' },
]

const segmentRisk = drainSegments.map((d) => ({ id: d.id, risk: d.riskScore }))
const riskVsRain = drainSegments.map((d) => ({
  rain: 40 + d.riskScore * 1.2,
  risk: d.riskScore,
  z: d.upstreamCatchmentKm2,
}))
const capacityUtil = drainSegments.map((d) => ({
  id: d.id,
  used: Number(((1 - d.effectiveCapacity / d.capacity) * 100).toFixed(0)),
}))
const historyVsPredicted = drainSegments.map((d) => ({
  id: d.id,
  historical: d.historicalFloods * 12,
  predicted: d.riskScore,
}))

const rainfallOptions = [50, 100, 150, 200]
const durationOptions = [1, 3, 6, 24]
const reductionOptions = [0, 20, 40, 60]

export default function RiskAnalysis() {
  const [scenario, setScenario] = useState<ScenarioInput>({ rainfallMm: 100, durationHours: 6, capacityReductionPct: 20 })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScenarioResult | null>(null)

  const run = () => {
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      setResult(runScenario(scenario))
      setLoading(false)
    }, 1400)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Waterlogging Risk Analysis</h1>
        <p className="mt-1 text-sm text-slate-400">Network-wide risk distribution and digital-twin scenario testing</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {distData.map((d) => (
          <div key={d.name} className="glass rounded-xl p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: d.fill }}>{d.name}</p>
            <p className="mt-1 text-2xl font-bold text-white font-mono">{d.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Risk by Drainage Segment">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={segmentRisk}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2f4a" />
              <XAxis dataKey="id" tick={{ fill: '#8ba3bd', fontSize: 11 }} axisLine={{ stroke: '#24405f' }} />
              <YAxis tick={{ fill: '#8ba3bd', fontSize: 11 }} axisLine={{ stroke: '#24405f' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#0d1a2e', border: '1px solid #24405f', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
                {segmentRisk.map((s, i) => (
                  <Cell key={i} fill={s.risk >= 76 ? '#ef4444' : s.risk >= 51 ? '#f97316' : s.risk >= 26 ? '#eab308' : '#22c55e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Risk vs Rainfall Intensity" subtitle="Bubble size = upstream catchment area">
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2f4a" />
              <XAxis type="number" dataKey="rain" name="Rainfall (mm)" tick={{ fill: '#8ba3bd', fontSize: 11 }} axisLine={{ stroke: '#24405f' }} />
              <YAxis type="number" dataKey="risk" name="Risk" tick={{ fill: '#8ba3bd', fontSize: 11 }} axisLine={{ stroke: '#24405f' }} />
              <ZAxis type="number" dataKey="z" range={[60, 300]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#0d1a2e', border: '1px solid #24405f', borderRadius: 8, fontSize: 12 }} />
              <Scatter data={riskVsRain} fill="#22d3ee" fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Drain Capacity Utilization">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={capacityUtil} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2f4a" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#8ba3bd', fontSize: 11 }} axisLine={{ stroke: '#24405f' }} />
              <YAxis type="category" dataKey="id" tick={{ fill: '#8ba3bd', fontSize: 11 }} axisLine={{ stroke: '#24405f' }} width={50} />
              <Tooltip contentStyle={{ background: '#0d1a2e', border: '1px solid #24405f', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="used" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Historical Flooding vs Predicted Risk">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={historyVsPredicted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2f4a" />
              <XAxis dataKey="id" tick={{ fill: '#8ba3bd', fontSize: 11 }} axisLine={{ stroke: '#24405f' }} />
              <YAxis tick={{ fill: '#8ba3bd', fontSize: 11 }} axisLine={{ stroke: '#24405f' }} />
              <Tooltip contentStyle={{ background: '#0d1a2e', border: '1px solid #24405f', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#8ba3bd' }} />
              <Line type="monotone" dataKey="historical" name="Historical (scaled)" stroke="#94a3b8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="predicted" name="Predicted Risk" stroke="#22d3ee" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel title="Run Scenario" subtitle="Digital-twin hydraulic scenario testing" action={<SimBadge />}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Rainfall</p>
            <div className="flex flex-wrap gap-2">
              {rainfallOptions.map((v) => (
                <button
                  key={v}
                  onClick={() => setScenario((s) => ({ ...s, rainfallMm: v }))}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${scenario.rainfallMm === v ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}
                >
                  {v} mm
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Duration</p>
            <div className="flex flex-wrap gap-2">
              {durationOptions.map((v) => (
                <button
                  key={v}
                  onClick={() => setScenario((s) => ({ ...s, durationHours: v }))}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${scenario.durationHours === v ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}
                >
                  {v}h
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Drain Capacity Reduction</p>
            <div className="flex flex-wrap gap-2">
              {reductionOptions.map((v) => (
                <button
                  key={v}
                  onClick={() => setScenario((s) => ({ ...s, capacityReductionPct: v }))}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${scenario.capacityReductionPct === v ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}
                >
                  {v}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button className="mt-5" onClick={run} disabled={loading} icon={loading ? <Loader2 size={16} className="animate-spin" /> : <PlayCircle size={16} />}>
          {loading ? 'Running hydraulic scenario…' : 'Run Digital Twin Simulation'}
        </Button>

        {result && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <p className="text-[10px] uppercase tracking-wider text-red-400">Predicted Critical Hotspots</p>
              <p className="mt-1 font-mono text-xl font-bold text-white">
                {result.criticalHotspotsBefore} → {result.criticalHotspotsAfter}
              </p>
            </div>
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
              <p className="text-[10px] uppercase tracking-wider text-orange-400">Waterlogged Area</p>
              <p className="mt-1 font-mono text-xl font-bold text-white">{result.waterloggedAreaKm2} km²</p>
            </div>
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
              <p className="text-[10px] uppercase tracking-wider text-yellow-400">Population Exposure</p>
              <p className="mt-1 font-mono text-xl font-bold text-white">{result.populationExposure.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
              <p className="text-[10px] uppercase tracking-wider text-cyan-400">Critical Infra Exposure</p>
              <p className="mt-1 font-mono text-xl font-bold text-white">{result.criticalInfraExposure}</p>
            </div>
          </div>
        )}
      </Panel>
    </div>
  )
}
