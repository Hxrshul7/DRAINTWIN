import { useNavigate } from 'react-router-dom'
import {
  Building2, HardHat, Droplets, ArrowRight, FlaskConical, UserRound, Shield, Activity,
  Layers, Waves, ChevronRight, CheckCircle2, Sparkles
} from 'lucide-react'
import { useAppStore } from '../context/AppStore'
import ThemeSwitcher from '../components/ui/ThemeSwitcher'

export default function Landing() {
  const navigate = useNavigate()
  const setRole = useAppStore((s) => s.setRole)

  const go = (role: 'admin' | 'worker' | 'citizen') => {
    setRole(role)
    navigate(role === 'admin' ? '/admin' : role === 'worker' ? '/worker' : '/citizen')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-navy-950 text-slate-100 selection:bg-cyan-500 selection:text-navy-950">
      {/* Ambient animated network backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.14]">
        <svg width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          {[...Array(10)].map((_, i) => (
            <path
              key={i}
              d={`M ${i * 125 - 60} 0 L ${i * 125 + 60} 260 L ${i * 125 - 40} 500 L ${i * 125 + 100} 800`}
              stroke="url(#lineGrad)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="6 10"
              className="animate-flow"
            />
          ))}
          {[...Array(16)].map((_, i) => (
            <circle key={`c${i}`} cx={(i * 971) % 1200} cy={(i * 653) % 800} r="3" fill="#22d3ee" opacity="0.6" />
          ))}
        </svg>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/80 to-navy-950" />

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-white/10 bg-navy-900/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-glow">
              <Droplets size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white">DRAINTWIN AI</span>
                <span className="rounded-full bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.2 text-[9px] font-bold text-cyan-300">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Urban Drainage Digital Twin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Smart City Pilot Mode</span>
            </div>

            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main Hero & Role Selection */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-65px)] max-w-6xl flex-col items-center px-4 py-12 sm:px-6">
        {/* Prototype Header Pill */}
        <div className="mb-4 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 shadow-glow">
          <Sparkles size={13} className="text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            AI-Powered Urban Drainage Intelligence
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="mt-2 max-w-3xl text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Predict waterlogging <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">before it happens.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-center text-sm leading-relaxed text-slate-300 sm:text-base">
          Turn hydraulic data, high-resolution rainfall forecasts, and digital-twin simulation into prioritized municipal action for a flood-resilient city.
        </p>

        {/* Access Role Selection Title */}
        <div className="mt-12 flex items-center gap-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-500/50" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Select Access Portal</p>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-500/50" />
        </div>

        {/* Role Cards Grid */}
        <div className="mt-6 grid w-full max-w-5xl gap-6 md:grid-cols-3">
          {/* Admin Card */}
          <button
            onClick={() => go('admin')}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-500/[0.10] via-cyan-500/[0.03] to-transparent p-7 text-left transition-all duration-300 hover:border-cyan-400/70 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)] hover:-translate-y-1.5"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 group-hover:scale-110 transition-transform">
                  <Building2 size={26} />
                </div>
                <span className="rounded-full bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 uppercase">
                  Central Control
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Municipal Administrator
              </h3>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                Full network topology, AI waterlogging risk heatmaps, digital-twin hydraulic simulation, and automated work order dispatch.
              </p>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-cyan-500/20 pt-4 text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
              <span>Enter Command Center</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* Worker Card */}
          <button
            onClick={() => go('worker')}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.10] via-amber-500/[0.03] to-transparent p-7 text-left transition-all duration-300 hover:border-amber-400/70 hover:shadow-[0_0_30px_rgba(245,158,11,0.18)] hover:-translate-y-1.5"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 group-hover:scale-110 transition-transform">
                  <HardHat size={26} />
                </div>
                <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 uppercase">
                  Field Ops
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Municipal Worker
              </h3>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                View dispatched desilting tasks on map, execute mobile site inspections, upload before/after photos, and mark tasks resolved.
              </p>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-amber-500/20 pt-4 text-xs font-bold text-amber-400 group-hover:text-amber-300">
              <span>Enter Field Dashboard</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* Citizen Card */}
          <button
            onClick={() => go('citizen')}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.10] via-emerald-500/[0.03] to-transparent p-7 text-left transition-all duration-300 hover:border-emerald-400/70 hover:shadow-[0_0_30px_rgba(16,185,129,0.18)] hover:-translate-y-1.5"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                  <UserRound size={26} />
                </div>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 uppercase">
                  Public Grievance
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                Citizen Portal
              </h3>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                Report waterlogged roads, blocked drains, or garbage accumulation with instant GPS and photo proof, then track municipal resolution.
              </p>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-emerald-500/20 pt-4 text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
              <span>Report an Issue</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </div>

        {/* SIH Innovation Callout */}
        <div className="mt-14 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center backdrop-blur">
          <p className="text-xs leading-relaxed text-slate-400">
            <span className="font-semibold text-cyan-300">DrainTwin AI Closed-Loop Governance:</span> Real-time citizen inputs and sensor telemetry continuously calibrate the digital twin, automatically recommending high-priority desilting interventions before flood damage occurs.
          </p>
        </div>
      </div>
    </div>
  )
}
