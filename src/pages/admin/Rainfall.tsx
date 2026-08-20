import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CloudRain } from 'lucide-react'
import Panel from '../../components/ui/Panel'
import SimBadge from '../../components/ui/SimBadge'
import StatCard from '../../components/ui/StatCard'
import { currentRainfallMmH, rainfallScenarios } from '../../data/rainfall'
import type { RainfallScenario } from '../../types'

const scenarios: RainfallScenario[] = ['NORMAL', 'HEAVY', 'EXTREME']

export default function Rainfall() {
  const [active, setActive] = useState<RainfallScenario>('HEAVY')

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Rainfall Forecast</h1>
          <p className="mt-1 text-sm text-slate-400">24-hour precipitation outlook for the municipal area</p>
        </div>
        <SimBadge label="Demo Weather Data" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Current Rainfall" value={`${currentRainfallMmH} mm/h`} icon={CloudRain} tone="accent" />
        <StatCard label="Peak Forecast (24h)" value={`${Math.max(...rainfallScenarios[active].map((p) => p.mmPerHour))} mm/h`} icon={CloudRain} tone="high" />
        <StatCard label="Active Scenario" value={active} icon={CloudRain} tone="medium" />
      </div>

      <Panel
        title="Next 24 Hours"
        action={
          <div className="flex gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-0.5 text-xs">
            {scenarios.map((s) => (
              <button
                key={s}
                onClick={() => setActive(s)}
                className={`rounded-md px-3 py-1 font-semibold ${active === s ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              >
                {s}
              </button>
            ))}
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={rainfallScenarios[active]}>
            <defs>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2f4a" />
            <XAxis dataKey="hour" tick={{ fill: '#8ba3bd', fontSize: 11 }} axisLine={{ stroke: '#24405f' }} interval={2} />
            <YAxis tick={{ fill: '#8ba3bd', fontSize: 11 }} axisLine={{ stroke: '#24405f' }} label={{ value: 'mm/h', angle: -90, position: 'insideLeft', fill: '#8ba3bd', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0d1a2e', border: '1px solid #24405f', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="mmPerHour" stroke="#22d3ee" strokeWidth={2} fill="url(#rainGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <Panel className="border border-white/10">
        <p className="text-xs leading-relaxed text-slate-500">
          Future integration: live forecasts from <span className="text-slate-300">Open-Meteo</span> and{' '}
          <span className="text-slate-300">IMD Open Data</span> will replace this simulated series, feeding the digital
          twin in real time.
        </p>
      </Panel>
    </div>
  )
}
