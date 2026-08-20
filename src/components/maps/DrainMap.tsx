import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip } from 'react-leaflet'
import type { DrainSegment, Sensor } from '../../types'
import { riskColor } from '../../services/riskService'

const CENTER: [number, number] = [18.5204, 73.8567]

const importanceWidth: Record<DrainSegment['importance'], number> = {
  trunk: 6,
  secondary: 4,
  lateral: 2.5,
}

export default function DrainMap({
  drains,
  sensors = [],
  showSensors = false,
  selectedId,
  onSelectDrain,
  height = '100%',
}: {
  drains: DrainSegment[]
  sensors?: Sensor[]
  showSensors?: boolean
  selectedId?: string | null
  onSelectDrain?: (id: string) => void
  height?: string
}) {
  return (
    <div style={{ height, width: '100%' }} className="overflow-hidden rounded-xl">
      <MapContainer center={CENTER} zoom={14} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {drains.map((d) => {
          const isSelected = selectedId === d.id
          return (
            <Polyline
              key={d.id}
              positions={d.path.map((p) => [p.lat, p.lng])}
              pathOptions={{
                color: riskColor[d.riskLevel],
                weight: isSelected ? importanceWidth[d.importance] + 3 : importanceWidth[d.importance],
                opacity: isSelected ? 1 : 0.85,
                dashArray: d.status === 'completed' ? undefined : undefined,
              }}
              eventHandlers={{
                click: () => onSelectDrain?.(d.id),
              }}
            >
              <Tooltip sticky>
                <div className="text-xs font-semibold">
                  {d.id} · {d.name}
                  <br />
                  Risk {d.riskScore}/100
                </div>
              </Tooltip>
            </Polyline>
          )
        })}

        {drains
          .filter((d) => d.riskLevel === 'critical')
          .map((d) => (
            <CircleMarker
              key={`hotspot-${d.id}`}
              center={[d.path[0].lat, d.path[0].lng]}
              radius={9}
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.35, weight: 2 }}
              eventHandlers={{ click: () => onSelectDrain?.(d.id) }}
            >
              <Tooltip direction="top">Critical hotspot · {d.id}</Tooltip>
            </CircleMarker>
          ))}

        {showSensors &&
          sensors.map((s) => (
            <CircleMarker
              key={s.id}
              center={[s.lat, s.lng]}
              radius={4}
              pathOptions={{
                color: s.status === 'offline' ? '#64748b' : s.alertLevel === 'critical' ? '#ef4444' : s.alertLevel === 'warning' ? '#eab308' : '#22d3ee',
                fillColor: s.status === 'offline' ? '#64748b' : '#22d3ee',
                fillOpacity: 0.6,
                weight: 1.5,
              }}
            >
              <Tooltip>
                {s.id} · {s.type} · {s.status.toUpperCase()}
              </Tooltip>
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  )
}
