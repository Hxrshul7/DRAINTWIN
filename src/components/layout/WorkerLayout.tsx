import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Home, MapPinned, ListChecks, FileBarChart, User, Droplets, LayoutDashboard, ArrowLeft, UserRound } from 'lucide-react'
import { currentWorker } from '../../data/workers'
import ThemeSwitcher from '../ui/ThemeSwitcher'

const navItems = [
  { to: '/worker', label: 'Home', icon: Home, end: true },
  { to: '/worker/map', label: 'Map', icon: MapPinned },
  { to: '/worker/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/worker/reports', label: 'Reports', icon: FileBarChart },
  { to: '/worker/profile', label: 'Profile', icon: User },
]

export default function WorkerLayout() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-navy-950 text-slate-100">
      {/* Worker Sticky Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-navy-900/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {/* Back to Portal Selection Button */}
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-cyan-500/40 hover:bg-white/10 hover:text-white"
            title="Back to Portal Selection"
          >
            <ArrowLeft size={14} className="text-cyan-400 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-sm">
              <Droplets size={16} />
            </div>
            <div>
              <p className="text-sm font-extrabold leading-none tracking-tight text-white">DRAINTWIN</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-amber-400 font-semibold">Field Ops</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher compact={true} />

          {/* Quick Portal Switchers */}
          <button
            onClick={() => navigate('/admin')}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300"
            title="Switch to Admin Dashboard"
          >
            <LayoutDashboard size={13} className="text-cyan-400" /> Admin
          </button>

          <button
            onClick={() => navigate('/citizen')}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-300"
            title="Switch to Citizen Portal"
          >
            <UserRound size={13} className="text-emerald-400" /> Citizen
          </button>
        </div>
      </header>

      {/* Sub-bar with Worker Status & Ward */}
      <div className="flex items-center justify-between border-b border-white/5 bg-navy-900/50 px-4 py-2 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span>Worker:</span>
          <span className="font-semibold text-slate-200">{currentWorker.name}</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400">{currentWorker.ward}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-[10px] font-bold text-green-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> ON DUTY
        </span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      {/* Bottom Sticky Mobile / Desktop Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-navy-900/95 backdrop-blur-xl shadow-2xl">
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-semibold transition-all ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
