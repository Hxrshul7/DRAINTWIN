import { FlaskConical } from 'lucide-react'

export default function SimBadge({ label = 'SIMULATED PROTOTYPE DATA' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
      <FlaskConical size={10} />
      {label}
    </span>
  )
}
