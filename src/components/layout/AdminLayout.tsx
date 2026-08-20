import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Network, TrendingUp, Boxes, ListChecks, Radio, CloudRain, FileText, Settings,
  Menu, X, Bell, ChevronDown, Users, Droplets, ArrowLeft, Home, UserRound, LogOut,
  ShieldAlert, Sparkles
} from 'lucide-react'
import { useAppStore } from '../../context/AppStore'
import NotificationDropdown from './NotificationDropdown'
import ThemeSwitcher from '../ui/ThemeSwitcher'
import Breadcrumb from '../ui/Breadcrumb'

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/network', label: 'Drainage Network', icon: Network },
  { to: '/admin/risk', label: 'Risk Analysis', icon: TrendingUp },
  { to: '/admin/digital-twin', label: 'Digital Twin', icon: Boxes },
  { to: '/admin/interventions', label: 'Interventions', icon: ListChecks },
  { to: '/admin/sensors', label: 'Sensors', icon: Radio },
  { to: '/admin/rainfall', label: 'Rainfall', icon: CloudRain },
  { to: '/admin/reports', label: 'Reports', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const notifications = useAppStore((s) => s.notifications)
  const navigate = useNavigate()
  const location = useLocation()
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Calculate current active label for breadcrumb
  const currentNav = navItems.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  )

  const breadcrumbItems = [
    { label: 'Admin Portal', to: '/admin' },
    ...(currentNav && currentNav.to !== '/admin' ? [{ label: currentNav.label, icon: currentNav.icon }] : []),
  ]

  const Sidebar = (
    <div className="flex h-full w-64 flex-col border-r border-white/10 bg-navy-900 shadow-xl">
      {/* Brand & Back Button Header */}
      <div className="border-b border-white/5 p-4">
        <button
          onClick={() => navigate('/')}
          className="group mb-3 flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
          title="Back to Portal Selection"
        >
          <ArrowLeft size={14} className="text-cyan-400 transition-transform group-hover:-translate-x-1" />
          <span>Back to Portal Selection</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-glow">
            <Droplets size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-extrabold tracking-tight text-white">DRAINTWIN AI</p>
              <span className="rounded bg-cyan-500/20 px-1 py-0.2 text-[9px] font-bold text-cyan-300 uppercase">Gov</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Municipal Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Navigation Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) =>
              `group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-500/5 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon size={17} className="transition-transform group-hover:scale-110" />
              <span>{item.label}</span>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Footer Role Switcher & User info */}
      <div className="border-t border-white/5 p-3 space-y-2">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => navigate('/worker')}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-2 text-[11px] font-semibold text-slate-300 transition-all hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-300"
            title="Switch to Municipal Worker Dashboard"
          >
            <Users size={13} className="text-amber-400" /> Worker
          </button>
          <button
            onClick={() => navigate('/citizen')}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-2 text-[11px] font-semibold text-slate-300 transition-all hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-300"
            title="Switch to Citizen Public Portal"
          >
            <UserRound size={13} className="text-emerald-400" /> Citizen
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/5 p-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Admin Command</p>
              <p className="text-[10px] text-slate-400">Pune Municipal Corp.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            title="Exit Admin & Return Home"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-navy-950 text-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">{Sidebar}</div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 h-full animate-slideIn">{Sidebar}</div>
          <button
            className="fixed right-4 top-4 z-[60] rounded-xl bg-navy-800 p-2 text-white shadow-lg border border-white/10"
            onClick={() => setDrawerOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-navy-900/80 px-4 py-3 backdrop-blur-xl lg:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 lg:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={18} />
            </button>

            {/* Prominent Back Button & Breadcrumb navigation */}
            <Breadcrumb
              items={breadcrumbItems}
              showBackButton={true}
              backTo="/"
              backLabel="Back to Home"
            />
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live Weather / Alert Pill */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>Heavy Rain Alert · Pune Ward 12</span>
            </div>

            {/* Theme Selector */}
            <ThemeSwitcher />

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                title="Notifications"
              >
                <Bell size={16} />
                {notifications.length > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>
              {notifOpen && <NotificationDropdown onClose={() => setNotifOpen(false)} />}
            </div>

            {/* User Profile Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 transition-colors hover:bg-white/10"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-bold text-cyan-300">
                  AD
                </div>
                <span className="hidden sm:inline text-xs font-medium text-slate-200">Admin</span>
                <ChevronDown size={13} className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-white/10 bg-navy-900/95 p-2 shadow-2xl backdrop-blur-xl animate-fadeIn">
                  <div className="px-3 py-2 border-b border-white/5">
                    <p className="text-xs font-bold text-white">Administrator Session</p>
                    <p className="text-[10px] text-slate-400">pmc-admin@pune.gov.in</p>
                  </div>
                  <div className="mt-1 space-y-1">
                    <button
                      onClick={() => {
                        navigate('/worker')
                        setUserMenuOpen(false)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <Users size={14} className="text-amber-400" />
                      <span>Switch to Worker Portal</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/citizen')
                        setUserMenuOpen(false)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <UserRound size={14} className="text-emerald-400" />
                      <span>Switch to Citizen Portal</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/admin/settings')
                        setUserMenuOpen(false)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <Settings size={14} className="text-cyan-400" />
                      <span>Admin &amp; Architecture Settings</span>
                    </button>
                    <div className="border-t border-white/5 my-1" />
                    <button
                      onClick={() => {
                        navigate('/')
                        setUserMenuOpen(false)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                    >
                      <Home size={14} />
                      <span>Exit to Portal Selection</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
