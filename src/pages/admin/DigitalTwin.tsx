import { useState } from 'react'
import { PlayCircle, Loader2, CloudRain, Layers, Waves, ArrowDown, CheckCircle2 } from 'lucide-react'
import Panel from '../../components/ui/Panel'
import Button from '../../components/ui/Button'
import SimBadge from '../../components/ui/SimBadge'
import { runDigitalTwin, type TwinRunResult } from '../../services/simulationService'

const stages = [
  { label: 'Rainfall', icon: CloudRain },
  { label: 'Catchment', icon: Layers },
  { label: 'Drain Network', icon: Waves },
  { label: 'Junctions', icon: Layers },
  { label: 'Outfall', icon: ArrowDown },
]

export default function DigitalTwin() {
  const [status, setStatus] = useState<'ready' | 'running' | 'done'>('ready')
  const [result, setResult] = useState<TwinRunResult | null>(null)

  const run = () => {
    setStatus('running')
    setTimeout(() => {
      setResult(runDigitalTwin(true))
      setStatus('done')
    }, 1600)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Digital Twin Simulation</h1>
        <p className="mt-1 text-sm text-slate-400">Rainfall-to-outfall hydraulic flow model for the drainage network</p>
      </div>

      <Panel title="Network Flow Model" action={<SimBadge />}>
        <div className="flex flex-col items-center gap-0 sm:flex-row sm:justify-between">
          {stages.map((s, i) => (
            <div key={s.label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-colors ${
                  status !== 'ready' ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300' : 'border-white/10 bg-white/[0.03] text-slate-400'
                }`}
              >
                <s.icon size={22} />
              </div>
              <p className="text-xs font-medium text-slate-300">{s.label}</p>
              {i < stages.length - 1 && (
                <div className="hidden h-px w-full flex-1 sm:block">
                  <svg width="100%" height="2" className="overflow-visible">
                    <line
                      x1="0" y1="1" x2="100%" y2="1"
                      stroke={status !== 'ready' ? '#22d3ee' : '#24405f'}
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className={status !== 'ready' ? 'animate-flow' : ''}
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Current Scenario">
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <dt className="text-slate-400">Rainfall</dt>
              <dd className="font-mono font-semibold text-white">120 mm / 24h</dd>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <dt className="text-slate-400">Network Condition</dt>
              <dd className="font-semibold text-amber-400">Moderate</dd>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <dt className="text-slate-400">Estimated Silt</dt>
              <dd className="font-mono font-semibold text-white">31%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Simulation Status</dt>
              <dd className={`font-semibold ${status === 'ready' ? 'text-slate-300' : status === 'running' ? 'text-amber-400' : 'text-green-400'}`}>
                {status === 'ready' ? 'READY' : status === 'running' ? 'RUNNING' : 'COMPLETE'}
              </dd>
            </div>
          </dl>

          <Button
            className="mt-5"
            fullWidth
            onClick={run}
            disabled={status === 'running'}
            icon={status === 'running' ? <Loader2 size={16} className="animate-spin" /> : <PlayCircle size={16} />}
          >
            {status === 'running' ? 'Simulating…' : 'Run Simulation'}
          </Button>
        </Panel>

        <Panel title="Simulation Results">
          {!result ? (
            <div className="flex h-full min-h-[180px] items-center justify-center text-center text-sm text-slate-500">
              Run the simulation to see predicted hotspots and risk comparison.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-green-400">
                <CheckCircle2 size={16} /> Simulation complete · {result.processingTimeSec}s processing time
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Predicted Hotspots</p>
                  <p className="mt-1 font-mono text-xl font-bold text-white">{result.predictedHotspots}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Critical Segments</p>
                  <p className="mt-1 font-mono text-xl font-bold text-white">{result.criticalSegments}</p>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">D-104 Risk Comparison</p>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-red-400">Before Intervention</p>
                    <p className="font-mono text-3xl font-bold text-red-400">{result.riskBefore}</p>
                  </div>
                  <ArrowDown className="rotate-[-90deg] text-slate-600" size={20} />
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-green-400">After Simulated Desilting</p>
                    <p className="font-mono text-3xl font-bold text-green-400">{result.riskAfter}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Panel>
      </div>

      <Panel className="border border-cyan-500/20 bg-cyan-500/[0.04]">
        <p className="text-sm leading-relaxed text-slate-300">
          <span className="font-semibold text-cyan-300">This is how DrainTwin closes the loop</span> between
          prediction, field action and measured improvement — DrainTwin doesn't just predict where waterlogging may
          happen, it tells the municipality what to do, where to do it, and which intervention should happen first.
        </p>
      </Panel>
    </div>
  )
}
