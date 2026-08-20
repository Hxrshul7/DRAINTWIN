// Core domain types for DrainTwin AI
// These mirror the shape we expect a future FastAPI + PostGIS backend to return,
// so the API layer can be swapped in without changing component props.

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export type DrainStatus = 'normal' | 'watch' | 'pending' | 'assigned' | 'in_progress' | 'completed'

export type InterventionAction =
  | 'DESILT'
  | 'INSPECT'
  | 'REPAIR'
  | 'CLEAR_BLOCKAGE'
  | 'CAPACITY_UPGRADE'
  | 'SENSOR_DEPLOY'

export type InterventionPriority = 'P1' | 'P2' | 'P3' | 'P4'

export interface LatLng {
  lat: number
  lng: number
}

export interface DrainSegment {
  id: string // e.g. D-104
  name: string
  ward: string
  path: LatLng[] // polyline geometry
  capacity: number // m3/s
  effectiveCapacity: number // m3/s, accounting for silt/blockage
  siltLevel: number // 0-100 %
  historicalFloods: number
  lastDesilted: string // ISO date
  upstreamCatchmentKm2: number
  riskScore: number // 0-100
  riskLevel: RiskLevel
  status: DrainStatus
  recommendedAction: InterventionAction
  priority: InterventionPriority
  estimatedCostINR: number
  assignedTo?: string // worker id
  predictedWaterlogging: RiskLevel
  importance: 'trunk' | 'secondary' | 'lateral'
}

export interface JunctionNode {
  id: string
  lat: number
  lng: number
  ward: string
}

export interface Hotspot {
  id: string
  name: string
  lat: number
  lng: number
  riskLevel: RiskLevel
  drainId: string
}

export type SensorType =
  | 'Ultrasonic Water Level'
  | 'Radar Water Level'
  | 'Pressure Level'
  | 'Area Velocity / Doppler'
  | 'Rain Gauge'

export type SensorStatus = 'online' | 'offline' | 'maintenance'
export type SensorAlert = 'normal' | 'warning' | 'critical'

export interface Sensor {
  id: string // e.g. WL-042
  type: SensorType
  junctionId: string
  ward: string
  lat: number
  lng: number
  status: SensorStatus
  alertLevel: SensorAlert
  waterLevelM: number
  normalLevelM: number
  batteryPct: number
  lastUpdateSec: number
}

export interface RainfallPoint {
  hour: string // "00:00"
  mmPerHour: number
}

export type RainfallScenario = 'NORMAL' | 'HEAVY' | 'EXTREME'

export interface Worker {
  id: string
  name: string
  status: 'on_duty' | 'off_duty'
  ward: string
}

export interface WorkOrder {
  id: string
  drainId: string
  assignedTo: string // worker id
  createdAt: string
  status: DrainStatus
  priority: InterventionPriority
  action: InterventionAction
  inspection?: InspectionRecord
  completion?: CompletionRecord
}

export interface InspectionRecord {
  condition: 'Clean' | 'Moderate Silt' | 'Heavy Silt' | 'Blocked' | 'Damaged'
  waterLevel: 'Normal' | 'High' | 'Critical'
  siltLevel: number
  blockage: boolean
  notes: string
  photoName?: string
  location?: LatLng
  submittedAt: string
}

export interface CompletionRecord {
  workPerformed: InterventionAction[]
  siltRemovedKg: number
  volumeM3: number
  notes: string
  beforePhotoName?: string
  afterPhotoName?: string
  completedAt: string
  riskBefore: number
  riskAfter: number
}

export interface NotificationItem {
  id: string
  level: 'CRITICAL' | 'HIGH' | 'INFO' | 'SENSOR'
  message: string
  timeAgo: string
}

export interface ScenarioInput {
  rainfallMm: number
  durationHours: number
  capacityReductionPct: number
}

export interface ScenarioResult {
  criticalHotspotsBefore: number
  criticalHotspotsAfter: number
  waterloggedAreaKm2: number
  populationExposure: number
  criticalInfraExposure: number
}


export type ComplaintStatus = 'Submitted' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved'

export interface CitizenComplaint {
  id: string
  issue: 'Waterlogging' | 'Blocked Drain' | 'Heavy Silt / Garbage' | 'Damaged Drain' | 'Other'
  location: string
  description: string
  severity: 'Low' | 'Medium' | 'High'
  photoName?: string
  status: ComplaintStatus
  createdAt: string
}
