import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, Camera, CheckCircle2, Droplets, FileText, LocateFixed, MapPin, Send,
  ShieldCheck, ArrowLeft, Clock3, Home, LayoutDashboard, HardHat, Check
} from 'lucide-react'
import { useAppStore } from '../context/AppStore'
import ThemeSwitcher from '../components/ui/ThemeSwitcher'
import Breadcrumb from '../components/ui/Breadcrumb'

const issueOptions = ['Waterlogging', 'Blocked Drain', 'Heavy Silt / Garbage', 'Damaged Drain', 'Other'] as const

type Issue = typeof issueOptions[number]

export default function Citizen() {
  const navigate = useNavigate()
  const submitComplaint = useAppStore((s) => s.submitComplaint)
  const complaints = useAppStore((s) => s.complaints)
  const [issue, setIssue] = useState<Issue>('Waterlogging')
  const [location, setLocation] = useState('Ward 12 · Sample Road, Pune')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [photoName, setPhotoName] = useState('')
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  const useLocation = () => {
    if (!navigator.geolocation) return setLocation('Location unavailable — select on map')
    navigator.geolocation.getCurrentPosition(
      (position) => setLocation(`Current GPS · ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)} (Ward 12)`),
      () => setLocation('Location permission denied — Pune Ward 12')
    )
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const complaint = submitComplaint({ issue, location, description, severity, photoName })
    setSubmittedId(complaint.id)
  }

  const latest = complaints.slice(0, 4)

  const breadcrumbItems = [
    { label: 'Citizen Public Portal' },
    { label: 'Report Issue' }
  ]

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-navy-900/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="group flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-all hover:border-cyan-500/40 hover:bg-white/10 hover:text-white"
              title="Back to Portal Selection"
            >
              <ArrowLeft size={14} className="text-cyan-400 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Droplets size={16} />
              </div>
              <div>
                <p className="text-sm font-extrabold tracking-tight text-white leading-none">DRAINTWIN AI</p>
                <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">Citizen Portal</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeSwitcher />

            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <ShieldCheck size={14} /> Municipal Response Guaranteed
            </div>

            <button
              onClick={() => navigate('/admin')}
              className="hidden lg:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
              title="Admin Portal"
            >
              <LayoutDashboard size={13} className="text-cyan-400" /> Admin
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <Breadcrumb items={breadcrumbItems} showBackButton={false} />
          <p className="text-xs text-slate-400">Pune Municipal Corporation Drainage Grievance Cell</p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1.15fr_.85fr]">
          <section>
            <div className="mb-6">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                <MapPin size={13} /> Real-Time Citizen Grievance Portal
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Report a Drainage Issue in Your Area
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                Pinpoint waterlogging, silt buildup, or drain damage. Your report triggers an automated digital-twin risk evaluation and dispatches municipal field teams.
              </p>
            </div>

            {submittedId ? (
              <div className="glass glow-card rounded-3xl p-7 border border-emerald-500/30 animate-fadeIn">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 size={30} />
                </div>
                <h2 className="mt-5 text-2xl font-bold text-white">Report Successfully Registered</h2>
                <p className="mt-2 text-sm text-slate-300">
                  Your grievance has been ingested by DrainTwin AI and mapped to the municipal drainage topology.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Complaint Reference ID</div>
                    <div className="mt-1 font-mono text-lg font-bold text-cyan-400">{submittedId}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tracking Status</div>
                    <div className="mt-1 font-bold text-amber-400 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" /> Assigned to Field Worker
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setSubmittedId(null)
                      setDescription('')
                      setPhotoName('')
                    }}
                    className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-navy-950 transition-all hover:bg-cyan-400 shadow-glow"
                  >
                    Submit Another Report
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-200 hover:bg-white/10"
                  >
                    Return to Portal Selection
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="glass rounded-3xl p-6 shadow-xl sm:p-8">
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">Complaint Submission Form</h2>
                    <p className="text-xs text-slate-400">Verified direct pipeline to municipal response team</p>
                  </div>
                  <FileText className="text-cyan-400" size={22} />
                </div>

                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Select Issue Type</label>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {issueOptions.map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => setIssue(option)}
                      className={`flex items-center justify-between rounded-xl border p-3.5 text-left text-sm font-semibold transition-all ${
                        issue === option
                          ? 'border-cyan-500/60 bg-cyan-500/15 text-cyan-300 shadow-glow'
                          : 'border-white/10 bg-white/[0.02] text-slate-300 hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <AlertTriangle size={15} className={issue === option ? 'text-cyan-400' : 'text-slate-400'} />
                        {option}
                      </span>
                      {issue === option && <Check size={14} className="text-cyan-400" />}
                    </button>
                  ))}
                </div>

                <label className="mt-6 block text-xs font-bold uppercase tracking-wider text-slate-400">2. Affected Location</label>
                <div className="mt-2 flex gap-2">
                  <div className="flex min-h-11 flex-1 items-center rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-sm text-slate-200">
                    <MapPin size={16} className="mr-2 shrink-0 text-cyan-400" />
                    <span>{location}</span>
                  </div>
                  <button
                    type="button"
                    onClick={useLocation}
                    className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-3.5 text-xs font-bold text-cyan-300 transition-all hover:bg-cyan-500/25"
                    title="Detect current GPS location"
                  >
                    <LocateFixed size={16} />
                    <span className="hidden sm:inline">Detect GPS</span>
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-slate-400">Auto-detected or mapped to nearest Pune drainage junction.</p>

                <label className="mt-6 block text-xs font-bold uppercase tracking-wider text-slate-400">3. Observed Severity</label>
                <div className="mt-2 flex gap-2">
                  {(['Low', 'Medium', 'High'] as const).map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setSeverity(s)}
                      className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                        severity === s
                          ? s === 'High'
                            ? 'bg-red-500 text-white shadow-lg border border-red-400'
                            : s === 'Medium'
                            ? 'bg-amber-500 text-navy-950 font-extrabold border border-amber-400'
                            : 'bg-green-600 text-white border border-green-500'
                          : 'border border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <label className="mt-6 block text-xs font-bold uppercase tracking-wider text-slate-400">4. Attach Photo Evidence</label>
                <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-4 transition-all hover:border-cyan-500/40 hover:bg-white/[0.05]">
                  <Camera size={22} className="text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-white">Upload Ground Photo</div>
                    <div className="text-xs text-slate-400">Optional evidence for rapid verification</div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? '')}
                  />
                  {photoName && (
                    <span className="ml-auto max-w-36 truncate rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-2 py-1 text-xs font-semibold text-emerald-300">
                      {photoName}
                    </span>
                  )}
                </label>

                <label className="mt-6 block text-xs font-bold uppercase tracking-wider text-slate-400">5. Description / Notes</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe specific blockage, stagnant water depth, or nearby landmarks..."
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />

                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3.5 text-sm font-bold text-navy-950 shadow-glow transition-all hover:brightness-110"
                >
                  <Send size={16} /> Submit Grievance to DrainTwin
                </button>
              </form>
            )}
          </section>

          <aside className="space-y-6">
            <div className="glass glow-card rounded-3xl p-6 shadow-xl border border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <Droplets size={22} />
                </div>
                <div>
                  <div className="font-bold text-white">How DrainTwin Resolves Issues</div>
                  <div className="text-xs text-slate-400">Citizen → AI Engine → Municipal Worker</div>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  'Your GPS and report are correlated with the hydraulic drainage network.',
                  'The AI Risk Engine estimates overflow probability and prioritizes urgency.',
                  'A work order is automatically dispatched to the ward field worker.',
                  'Inspection & desilting photos verify resolution back into the digital twin.'
                ].map((text, i) => (
                  <div key={text} className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                      {i + 1}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-white">Recent Citizen Reports</h3>
                <Clock3 size={16} className="text-slate-400" />
              </div>
              <div className="mt-4 space-y-3">
                {latest.length ? (
                  latest.map((c) => (
                    <div key={c.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition-all hover:bg-white/5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-cyan-400">{c.id}</span>
                        <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                          {c.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-semibold text-white">{c.issue}</div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                        <MapPin size={11} className="text-slate-500" />
                        <span>{c.location}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400">
                    Your submitted reports will appear here with live tracking.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Navigation helper */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <p className="text-xs text-slate-400">Are you a municipal official or field worker?</p>
              <div className="mt-3 flex justify-center gap-2">
                <button
                  onClick={() => navigate('/admin')}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300"
                >
                  Admin Portal
                </button>
                <button
                  onClick={() => navigate('/worker')}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-amber-500/10 hover:text-amber-300"
                >
                  Worker Portal
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
                >
                  Home
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
