import type { RiskLevel } from '../types'

// Prototype risk model — to be calibrated with real city data.
// Risk Score = Rainfall Severity + Drain Capacity Stress + Silt/Blockage
//              Condition + Historical Flooding + Upstream Catchment Load
// Normalized to 0-100.

export function classifyRisk(score: number): RiskLevel {
  if (score >= 76) return 'critical'
  if (score >= 51) return 'high'
  if (score >= 26) return 'medium'
  return 'low'
}

export const riskLabel: Record<RiskLevel, string> = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MODERATE',
  low: 'LOW',
}

export const riskColor: Record<RiskLevel, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
}

export const riskTextClass: Record<RiskLevel, string> = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
}

export const riskBgClass: Record<RiskLevel, string> = {
  critical: 'bg-red-500/15 text-red-400 border-red-500/30',
  high: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/15 text-green-400 border-green-500/30',
}
