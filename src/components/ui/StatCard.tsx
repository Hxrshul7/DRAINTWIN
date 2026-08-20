import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  sublabel?: string
  icon: LucideIcon
  tone?: 'default' | 'critical' | 'high' | 'medium' | 'low' | 'accent'
  delay?: number
}

const toneClasses: Record<string, { badge: string; text: string }> = {
  default: { badge: 'bg-slate-500/15 border-slate-500/30 text-slate-300', text: 'text-white' },
  critical: { badge: 'bg-red-500/20 border-red-500/40 text-red-400', text: 'text-red-400' },
  high: { badge: 'bg-orange-500/20 border-orange-500/40 text-orange-400', text: 'text-orange-400' },
  medium: { badge: 'bg-amber-500/20 border-amber-500/40 text-amber-400', text: 'text-amber-400' },
  low: { badge: 'bg-green-500/20 border-green-500/40 text-green-400', text: 'text-green-400' },
  accent: { badge: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400', text: 'text-cyan-300' },
}

export default function StatCard({ label, value, sublabel, icon: Icon, tone = 'default', delay = 0 }: StatCardProps) {
  const currentTone = toneClasses[tone] || toneClasses.default

  return (
    <div
      className="glass group rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <div className={`rounded-xl border p-2 transition-transform group-hover:scale-110 ${currentTone.badge}`}>
          <Icon size={15} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-extrabold font-mono tabular-nums text-white tracking-tight">{value}</p>
      {sublabel && <p className="mt-1 text-[11px] text-slate-400 font-medium">{sublabel}</p>}
    </div>
  )
}
