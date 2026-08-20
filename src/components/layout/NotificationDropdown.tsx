import { AlertTriangle, AlertCircle, Info, Radio, Bell } from 'lucide-react'
import { useAppStore } from '../../context/AppStore'
import type { NotificationItem } from '../../types'

const config: Record<NotificationItem['level'], { icon: React.ElementType; color: string }> = {
  CRITICAL: { icon: AlertTriangle, color: 'text-red-400 bg-red-500/15 border border-red-500/30' },
  HIGH: { icon: AlertCircle, color: 'text-orange-400 bg-orange-500/15 border border-orange-500/30' },
  INFO: { icon: Info, color: 'text-cyan-400 bg-cyan-500/15 border border-cyan-500/30' },
  SENSOR: { icon: Radio, color: 'text-purple-400 bg-purple-500/15 border border-purple-500/30' },
}

export default function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const notifications = useAppStore((s) => s.notifications)
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 z-50 mt-2 w-84 overflow-hidden rounded-2xl border border-white/10 bg-navy-900/95 shadow-2xl backdrop-blur-xl animate-fadeIn">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-cyan-400" />
            <p className="text-xs font-bold uppercase tracking-wider text-white">Live System Alerts</p>
          </div>
          <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
            {notifications.length} New
          </span>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.slice(0, 8).map((n) => {
            const c = config[n.level] || config.INFO
            const Icon = c.icon
            return (
              <div key={n.id} className="flex gap-3 border-b border-white/5 px-4 py-3 last:border-0 hover:bg-white/[0.04] transition-colors">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${c.color}`}>
                  <Icon size={14} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-100">{n.message}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{n.timeAgo}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
