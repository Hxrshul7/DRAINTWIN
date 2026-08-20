import { useNavigate } from 'react-router-dom'
import { HardHat, MapPin, Phone, Mail, ArrowLeft, Home, Shield, LogOut } from 'lucide-react'
import { currentWorker } from '../../data/workers'
import ThemeSwitcher from '../../components/ui/ThemeSwitcher'

export default function WorkerProfile() {
  const navigate = useNavigate()

  return (
    <div className="px-4 py-5 max-w-xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/worker')}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
          >
            <ArrowLeft size={13} className="text-cyan-400" /> Dashboard
          </button>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <Home size={13} /> Exit to Portal Selection
        </button>
      </div>

      <div className="glass glow-card flex flex-col items-center rounded-3xl p-6 text-center border border-amber-500/20">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <HardHat size={32} />
        </div>
        <h1 className="mt-3 text-lg font-bold text-white">{currentWorker.name}</h1>
        <p className="text-xs text-slate-400">Municipal Field Worker · Drainage Dept.</p>
        <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[10px] font-bold text-green-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> ON ACTIVE DUTY
        </span>
      </div>

      <div className="space-y-2">
        <div className="glass rounded-xl p-3.5 flex items-center gap-3 text-xs text-slate-300">
          <MapPin size={16} className="text-cyan-400 shrink-0" />
          <div>
            <p className="text-[10px] uppercase text-slate-500 font-bold">Designated Ward</p>
            <p className="text-sm font-semibold text-white mt-0.5">{currentWorker.ward} (PMC South-East)</p>
          </div>
        </div>

        <div className="glass rounded-xl p-3.5 flex items-center gap-3 text-xs text-slate-300">
          <Phone size={16} className="text-cyan-400 shrink-0" />
          <div>
            <p className="text-[10px] uppercase text-slate-500 font-bold">Field Emergency Contact</p>
            <p className="text-sm font-semibold text-white font-mono mt-0.5">+91 98234 56789</p>
          </div>
        </div>

        <div className="glass rounded-xl p-3.5 flex items-center gap-3 text-xs text-slate-300">
          <Mail size={16} className="text-cyan-400 shrink-0" />
          <div>
            <p className="text-[10px] uppercase text-slate-500 font-bold">Municipal Govt ID</p>
            <p className="text-sm font-semibold text-white font-mono mt-0.5">rajesh.kumar@pmc.gov.in</p>
          </div>
        </div>
      </div>

      <div className="pt-2 flex flex-col gap-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-500/15 border border-red-500/30 py-3 text-xs font-bold text-red-300 hover:bg-red-500/25 transition-all"
        >
          <LogOut size={15} /> Switch Portal / Logout
        </button>
      </div>
    </div>
  )
}
