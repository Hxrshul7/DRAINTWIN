import type { RainfallPoint } from '../types'

export const currentRainfallMmH = 32

export const rainfallForecast24h: RainfallPoint[] = Array.from({ length: 24 }, (_, h) => {
  // Simulated bell-curve style storm intensity peaking mid-afternoon
  const peak = 12
  const spread = 5
  const base = 30 * Math.exp(-((h - peak) ** 2) / (2 * spread * spread))
  const noise = (Math.sin(h * 1.7) + 1) * 3
  return {
    hour: `${String(h).padStart(2, '0')}:00`,
    mmPerHour: Number(Math.max(1, base + noise).toFixed(1)),
  }
})

export const rainfallScenarios: Record<'NORMAL' | 'HEAVY' | 'EXTREME', RainfallPoint[]> = {
  NORMAL: rainfallForecast24h.map((p) => ({ ...p, mmPerHour: Number((p.mmPerHour * 0.5).toFixed(1)) })),
  HEAVY: rainfallForecast24h,
  EXTREME: rainfallForecast24h.map((p) => ({ ...p, mmPerHour: Number((p.mmPerHour * 1.8).toFixed(1)) })),
}
