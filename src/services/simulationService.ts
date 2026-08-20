import type { ScenarioInput, ScenarioResult } from '../types'

// Simulated prototype hydraulic model.
// This stands in for a future PySWMM / SWMM digital-twin engine running
// against the real drain network. Outputs are illustrative only.

export function runScenario(input: ScenarioInput): ScenarioResult {
  const rainFactor = input.rainfallMm / 100
  const durationFactor = Math.log2(input.durationHours + 1) / 2
  const capacityFactor = 1 + input.capacityReductionPct / 100

  const severity = rainFactor * durationFactor * capacityFactor

  const criticalHotspotsBefore = 8
  const criticalHotspotsAfter = Math.min(60, Math.round(criticalHotspotsBefore + severity * 12))

  return {
    criticalHotspotsBefore,
    criticalHotspotsAfter,
    waterloggedAreaKm2: Number((2.1 + severity * 3.4).toFixed(1)),
    populationExposure: Math.round(6000 + severity * 15000),
    criticalInfraExposure: Math.round(4 + severity * 10),
  }
}

export interface TwinRunResult {
  processingTimeSec: number
  predictedHotspots: number
  criticalSegments: number
  riskBefore: number
  riskAfter: number
}

export function runDigitalTwin(siltReductionAssumed = true): TwinRunResult {
  return {
    processingTimeSec: 2.4,
    predictedHotspots: 14,
    criticalSegments: 5,
    riskBefore: 87,
    riskAfter: siltReductionAssumed ? 49 : 87,
  }
}
