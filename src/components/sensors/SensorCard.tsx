import { Radio, BatteryMedium, Clock } from 'lucide-react'
import type { Sensor } from '../../types'

const statusColor: Record<Sensor['status'], string> = {
  online: 'text-green-400 bg-green-500/10 border-green-500/25',
  offline: 'text-slate-400 bg-slate-500/10 border-slate-500/25',
  maintenance: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25',
}

const alertColor: Record<Sensor['alertLevel'], string> = {
  normal: 'text-green-400',
  warning: 'text-yellow-400',
  critical: 'text-red-400',
}

export default function SensorCard({ sensor, onClick }: { sensor: Sensor; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-white/5 bg-white/[0.02] p-3.5 text-left transition-colors hover:bg-white/[0.05]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio size={13} className="text-cyan-400" />
          <span className="font-mono text-sm font-bold text-white">{sensor.id}</span>
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${statusColor[sensor.status]}`}>
          {sensor.status}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-400">{sensor.type}</p>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className={`font-semibold ${alertColor[sensor.alertLevel]}`}>
          {sensor.waterLevelM.toFixed(2)}m {sensor.alertLevel !== 'normal' && `(${sensor.alertLevel})`}
        </span>
        <div className="flex items-center gap-2 text-slate-500">
          <span className="flex items-center gap-1"><BatteryMedium size={12} />{sensor.batteryPct}%</span>
          <span className="flex items-center gap-1"><Clock size={12} />{sensor.lastUpdateSec}s</span>
        </div>
      </div>
    </button>
  )
}
