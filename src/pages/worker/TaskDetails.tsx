import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, MapPinned, CheckCircle2, Home, Droplets } from 'lucide-react'
import { useAppStore } from '../../context/AppStore'
import RiskBadge from '../../components/risk/RiskBadge'
import Button from '../../components/ui/Button'
import type { InspectionRecord, InterventionAction } from '../../types'

type Stage = 'overview' | 'inspection' | 'completion' | 'done'

const conditions: InspectionRecord['condition'][] = ['Clean', 'Moderate Silt', 'Heavy Silt', 'Blocked', 'Damaged']
const waterLevels: InspectionRecord['waterLevel'][] = ['Normal', 'High', 'Critical']
const workTypes: InterventionAction[] = ['DESILT', 'CLEAR_BLOCKAGE', 'REPAIR', 'INSPECT']

export default function TaskDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const drain = useAppStore((s) => s.drains.find((d) => d.id === id))
  const submitInspection = useAppStore((s) => s.submitInspection)
  const completeWork = useAppStore((s) => s.completeWork)

  const [stage, setStage] = useState<Stage>('overview')

  // Inspection form state
  const [condition, setCondition] = useState<InspectionRecord['condition']>('Heavy Silt')
  const [waterLevel, setWaterLevel] = useState<InspectionRecord['waterLevel']>('Normal')
  const [siltLevel, setSiltLevel] = useState(50)
  const [blockage, setBlockage] = useState(false)
  const [notes, setNotes] = useState('')
  const [photoName, setPhotoName] = useState<string | null>(null)

  // Completion form state
  const [workPerformed, setWorkPerformed] = useState<InterventionAction[]>(['DESILT'])
  const [siltRemoved, setSiltRemoved] = useState(120)
  const [volume, setVolume] = useState(3.2)
  const [completionNotes, setCompletionNotes] = useState('')

  if (!drain) {
    return (
      <div className="p-8 text-center text-sm text-slate-400">
        Task not found.
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={() => navigate('/worker')} className="rounded-xl bg-cyan-500/20 px-4 py-2 text-xs font-bold text-cyan-300">
            Back to Worker Tasks
          </button>
          <button onClick={() => navigate('/')} className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-300">
            Back to Portal Selection
          </button>
        </div>
      </div>
    )
  }

  const toggleWorkType = (t: InterventionAction) => {
    setWorkPerformed((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  const handleSubmitInspection = () => {
    const record: InspectionRecord = {
      condition,
      waterLevel,
      siltLevel,
      blockage,
      notes,
      photoName: photoName ?? undefined,
      submittedAt: new Date().toISOString(),
    }
    submitInspection(drain.id, record)
    setStage('completion')
  }

  const handleComplete = () => {
    completeWork(drain.id, {
      workPerformed,
      siltRemovedKg: siltRemoved,
      volumeM3: volume,
      notes: completionNotes,
      beforePhotoName: 'before_site.jpg',
      afterPhotoName: 'after_site.jpg',
    })
    setStage('done')
  }

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      {/* Navigation Buttons Bar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/worker/tasks')}
            className="group flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1 text-cyan-400" />
            <span>Back to Tasks</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200"
            title="Back to Portal Selection"
          >
            <Home size={13} />
          </button>
        </div>

        <span className="text-xs font-mono text-cyan-400 font-bold">{drain.id}</span>
      </div>

      {stage === 'overview' && (
        <div className="space-y-4 animate-fadeIn">
          <div className={`rounded-2xl border p-5 ${drain.riskLevel === 'critical' ? 'border-red-500/30 bg-red-500/[0.08]' : 'border-white/10 bg-white/[0.03]'}`}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Assigned Work Order</p>
            <h1 className="text-xl font-bold text-white mt-0.5">{drain.recommendedAction.replace('_', ' ')} DRAIN</h1>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/[0.02] p-2.5 border border-white/5">
                <p className="text-[10px] uppercase text-slate-400">Segment ID</p>
                <p className="font-mono font-bold text-cyan-400 mt-0.5">{drain.id}</p>
              </div>
              <div className="rounded-xl bg-white/[0.02] p-2.5 border border-white/5">
                <p className="text-[10px] uppercase text-slate-400">Ward Location</p>
                <p className="font-semibold text-white mt-0.5">{drain.ward}</p>
              </div>
              <div className="rounded-xl bg-white/[0.02] p-2.5 border border-white/5">
                <p className="text-[10px] uppercase text-slate-400">Dispatch Priority</p>
                <p className="font-semibold text-amber-400 mt-0.5">{drain.priority}</p>
              </div>
              <div className="rounded-xl bg-white/[0.02] p-2.5 border border-white/5">
                <p className="text-[10px] uppercase text-slate-400">Assessed Risk</p>
                <div className="mt-1"><RiskBadge level={drain.riskLevel} size="sm" /></div>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Risk Triggers</p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">• <span className="text-amber-400 font-bold">{drain.siltLevel}%</span> estimated silt buildup</li>
              <li className="flex items-center gap-2">• Effective capacity reduced to {drain.effectiveCapacity.toFixed(1)} m³/s</li>
              <li className="flex items-center gap-2">• {drain.historicalFloods} historical monsoon flooding incidents</li>
            </ul>
          </div>

          <div className="glass rounded-xl p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Field Protocol Instructions</p>
            <ol className="list-decimal space-y-1 pl-4 text-xs text-slate-300">
              <li>Inspect drain inlet for physical trash and silt depth</li>
              <li>Record condition and verify water flow level</li>
              <li>Execute desilting / blockage clearance</li>
              <li>Upload before and after photo evidence</li>
            </ol>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="secondary" fullWidth icon={<MapPinned size={14} />}>Navigate GPS</Button>
            <Button fullWidth onClick={() => setStage('inspection')}>Begin Inspection</Button>
          </div>
        </div>
      )}

      {stage === 'inspection' && (
        <div className="glass rounded-2xl p-5 space-y-5 animate-fadeIn">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-lg font-bold text-white">Site Inspection Log</h2>
            <p className="text-xs text-slate-400">Step 1 of 2 · Record current ground conditions</p>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Drain Condition</p>
            <div className="flex flex-wrap gap-2">
              {conditions.map((c) => (
                <button
                  key={c}
                  onClick={() => setCondition(c)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                    condition === c ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-glow' : 'border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Water Level</p>
            <div className="flex flex-wrap gap-2">
              {waterLevels.map((w) => (
                <button
                  key={w}
                  onClick={() => setWaterLevel(w)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                    waterLevel === w ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-glow' : 'border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider text-slate-400">Measured Silt Level</span>
              <span className="font-mono font-bold text-cyan-400">{siltLevel}%</span>
            </div>
            <input type="range" min={0} max={100} value={siltLevel} onChange={(e) => setSiltLevel(Number(e.target.value))} className="w-full accent-cyan-500" />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <span className="text-xs font-semibold text-slate-200">Physical Blockage Present</span>
            <div className="flex gap-2">
              <button onClick={() => setBlockage(true)} className={`rounded-lg px-3 py-1 text-xs font-semibold ${blockage ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-slate-400'}`}>Yes</button>
              <button onClick={() => setBlockage(false)} className={`rounded-lg px-3 py-1 text-xs font-semibold ${!blockage ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-slate-400'}`}>No</button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Field Notes</p>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400" placeholder="Observed silt, plastic debris, or structural crack..." />
          </div>

          <button
            onClick={() => setPhotoName('site_inspection.jpg')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.02] py-4 text-xs font-semibold text-slate-300 transition-all hover:border-cyan-500/40 hover:bg-white/[0.05]"
          >
            <Camera size={16} className="text-cyan-400" /> {photoName ? `${photoName} attached` : 'Upload site inspection photo'}
          </button>

          <Button fullWidth onClick={handleSubmitInspection}>Save Inspection &amp; Proceed</Button>
        </div>
      )}

      {stage === 'completion' && (
        <div className="glass rounded-2xl p-5 space-y-5 animate-fadeIn">
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-3.5 py-2.5 text-xs font-bold text-green-400 flex items-center gap-2">
            <CheckCircle2 size={16} /> Inspection recorded successfully
          </div>

          <div className="border-b border-white/10 pb-3">
            <h2 className="text-lg font-bold text-white">Record Work Completion</h2>
            <p className="text-xs text-slate-400">Step 2 of 2 · Log maintenance metrics</p>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Action Performed</p>
            <div className="flex flex-wrap gap-2">
              {workTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleWorkType(t)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                    workPerformed.includes(t) ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-glow' : 'border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Silt Removed (kg)</p>
              <input type="number" value={siltRemoved} onChange={(e) => setSiltRemoved(Number(e.target.value))} className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-xs font-mono text-white" />
            </div>
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Volume Cleared (m³)</p>
              <input type="number" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-xs font-mono text-white" />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Completion Summary</p>
            <textarea value={completionNotes} onChange={(e) => setCompletionNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-400" placeholder="Summary of maintenance work performed..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/20 bg-white/[0.02] py-3 text-xs text-slate-300">
              <Camera size={14} className="text-cyan-400" /> Before photo
            </button>
            <button className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/20 bg-white/[0.02] py-3 text-xs text-slate-300">
              <Camera size={14} className="text-emerald-400" /> After photo
            </button>
          </div>

          <Button fullWidth onClick={handleComplete}>Finalize &amp; Close Work Order</Button>
        </div>
      )}

      {stage === 'done' && (
        <div className="glass rounded-3xl p-8 text-center animate-fadeIn">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="mt-4 text-xl font-bold text-white">Work Order Completed!</h2>
          <p className="mt-2 text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            Asset risk score has been updated in the digital twin and logged in municipal maintenance history.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => navigate('/worker/tasks')}>Back to Worker Tasks</Button>
            <button
              onClick={() => navigate('/')}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
            >
              Back to Portal Selection
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
