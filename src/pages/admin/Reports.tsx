import { useState } from 'react'
import { FileText, Download, Eye, X } from 'lucide-react'
import Panel from '../../components/ui/Panel'
import Button from '../../components/ui/Button'

const reports = [
  { id: 'r1', name: 'Pre-Monsoon Risk Report', desc: 'Network-wide risk classification ahead of monsoon onset.' },
  { id: 'r2', name: 'Drain Desilting Priority Report', desc: 'Ranked desilting queue by risk score and silt level.' },
  { id: 'r3', name: 'Waterlogging Hotspot Report', desc: 'Predicted hotspot locations and exposure estimates.' },
  { id: 'r4', name: 'Sensor Health Report', desc: 'Sensor uptime, battery status and maintenance needs.' },
  { id: 'r5', name: 'Ward Risk Report', desc: 'Risk aggregated by administrative ward.' },
]

export default function Reports() {
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="mt-1 text-sm text-slate-400">Generate municipal reports from current drainage intelligence</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Panel key={r.id}>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <FileText size={18} />
            </div>
            <h3 className="text-sm font-semibold text-white">{r.name}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{r.desc}</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => setPreview(r.name)}>Generate</Button>
              <Button size="sm" variant="secondary" icon={<Eye size={13} />} onClick={() => setPreview(r.name)}>Preview</Button>
              <Button size="sm" variant="ghost" icon={<Download size={13} />}>PDF</Button>
            </div>
          </Panel>
        ))}
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass w-full max-w-lg rounded-xl p-6 animate-fadeIn">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">{preview} — Preview</h3>
              <button onClick={() => setPreview(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-2 rounded-lg border border-white/10 bg-white/[0.02] p-4 text-xs text-slate-400">
              <p>Generated for: Pune Municipal Area</p>
              <p>Period: Pre-monsoon 2026</p>
              <p>Critical segments: 8 · High-risk segments: 37</p>
              <p>Top priority: D-104 (Ward 12) — DESILT, Risk 87/100</p>
              <p className="pt-2 text-slate-600">This is a mock report preview generated from prototype data.</p>
            </div>
            <Button className="mt-4" fullWidth onClick={() => setPreview(null)}>Close Preview</Button>
          </div>
        </div>
      )}
    </div>
  )
}
