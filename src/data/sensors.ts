import type { Sensor } from '../types'
import { junctions } from './drains'

const types: Sensor['type'][] = [
  'Ultrasonic Water Level',
  'Radar Water Level',
  'Pressure Level',
  'Area Velocity / Doppler',
  'Rain Gauge',
]

function makeSensor(i: number): Sensor {
  const j = junctions[i % junctions.length]
  const status: Sensor['status'] = i % 13 === 0 ? 'offline' : i % 11 === 0 ? 'maintenance' : 'online'
  const alert: Sensor['alertLevel'] = i === 2 ? 'critical' : i % 5 === 0 ? 'warning' : 'normal'
  const normal = 0.5 + (i % 4) * 0.1
  const water = alert === 'critical' ? normal + 0.95 : alert === 'warning' ? normal + 0.4 : normal + (i % 3) * 0.05
  return {
    id: `WL-${String((i + 1) * 3).padStart(3, '0')}`,
    type: types[i % types.length],
    junctionId: j.id,
    ward: j.ward,
    lat: j.lat + (i % 3) * 0.0015,
    lng: j.lng - (i % 4) * 0.0015,
    status,
    alertLevel: status === 'offline' ? 'normal' : alert,
    waterLevelM: Number(water.toFixed(2)),
    normalLevelM: Number(normal.toFixed(2)),
    batteryPct: status === 'offline' ? 0 : Math.max(12, 100 - i * 4),
    lastUpdateSec: status === 'offline' ? 5400 : 15 + i * 7,
  }
}

export const sensors: Sensor[] = Array.from({ length: 52 }, (_, i) => makeSensor(i))

export const sensorSummary = {
  total: sensors.length,
  online: sensors.filter((s) => s.status === 'online').length,
  offline: sensors.filter((s) => s.status === 'offline').length,
  maintenance: sensors.filter((s) => s.status === 'maintenance').length,
}
