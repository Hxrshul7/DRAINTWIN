import { create } from 'zustand'
import type { DrainSegment, WorkOrder, InspectionRecord, CompletionRecord, NotificationItem, CitizenComplaint } from '../types'
import { drainSegments as initialDrains } from '../data/drains'
import { initialNotifications } from '../data/workers'
import { classifyRisk } from '../services/riskService'

interface AppState {
  drains: DrainSegment[]
  workOrders: WorkOrder[]
  notifications: NotificationItem[]
  role: 'admin' | 'worker' | 'citizen' | null
  complaints: CitizenComplaint[]

  setRole: (role: 'admin' | 'worker' | 'citizen' | null) => void
  submitComplaint: (complaint: Omit<CitizenComplaint, 'id' | 'status' | 'createdAt'>) => CitizenComplaint
  getDrain: (id: string) => DrainSegment | undefined
  createWorkOrder: (drainId: string, workerId: string) => void
  submitInspection: (drainId: string, record: InspectionRecord) => void
  completeWork: (drainId: string, record: Omit<CompletionRecord, 'riskBefore' | 'riskAfter' | 'completedAt'>) => void
  pushNotification: (n: Omit<NotificationItem, 'id' | 'timeAgo'>) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  drains: initialDrains,
  workOrders: [],
  notifications: initialNotifications,
  role: null,
  complaints: [],

  setRole: (role) => set({ role }),

  getDrain: (id) => get().drains.find((d) => d.id === id),

  submitComplaint: (data) => {
    const complaint: CitizenComplaint = {
      ...data,
      id: `DT-${String(Math.floor(1000 + Math.random() * 9000))}`,
      status: 'Submitted',
      createdAt: new Date().toISOString(),
    }
    set((s) => ({
      complaints: [complaint, ...s.complaints],
      notifications: [
        { id: `n-${Date.now()}`, level: 'INFO', message: `New citizen report: ${complaint.issue}`, timeAgo: 'just now' },
        ...s.notifications,
      ],
    }))
    return complaint
  },

  createWorkOrder: (drainId, workerId) => {
    const drain = get().getDrain(drainId)
    if (!drain) return
    const order: WorkOrder = {
      id: `WO-${drainId}-${Date.now()}`,
      drainId,
      assignedTo: workerId,
      createdAt: new Date().toISOString(),
      status: 'assigned',
      priority: drain.priority,
      action: drain.recommendedAction,
    }
    set((s) => ({
      workOrders: [...s.workOrders, order],
      drains: s.drains.map((d) => (d.id === drainId ? { ...d, status: 'assigned', assignedTo: workerId } : d)),
      notifications: [
        { id: `n-${Date.now()}`, level: 'INFO', message: `Work order created for ${drainId}`, timeAgo: 'just now' },
        ...s.notifications,
      ],
    }))
  },

  submitInspection: (drainId, record) => {
    set((s) => ({
      drains: s.drains.map((d) => (d.id === drainId ? { ...d, status: 'in_progress', siltLevel: record.siltLevel } : d)),
      workOrders: s.workOrders.map((w) => (w.drainId === drainId ? { ...w, status: 'in_progress', inspection: record } : w)),
      notifications: [
        { id: `n-${Date.now()}`, level: 'INFO', message: `Inspection recorded for ${drainId}`, timeAgo: 'just now' },
        ...s.notifications,
      ],
    }))
  },

  completeWork: (drainId, record) => {
    const drain = get().getDrain(drainId)
    if (!drain) return
    const riskBefore = drain.riskScore
    const riskAfter = Math.max(15, Math.round(riskBefore * 0.56))
    const completion: CompletionRecord = {
      ...record,
      riskBefore,
      riskAfter,
      completedAt: new Date().toISOString(),
    }
    set((s) => ({
      drains: s.drains.map((d) =>
        d.id === drainId
          ? {
              ...d,
              status: 'completed',
              riskScore: riskAfter,
              riskLevel: classifyRisk(riskAfter),
              siltLevel: Math.max(5, Math.round(d.siltLevel * 0.25)),
              effectiveCapacity: d.capacity * 0.92,
              lastDesilted: new Date().toISOString().slice(0, 10),
            }
          : d
      ),
      workOrders: s.workOrders.map((w) => (w.drainId === drainId ? { ...w, status: 'completed', completion } : w)),
      notifications: [
        { id: `n-${Date.now()}`, level: 'INFO', message: `${drainId} work order completed — risk ${riskBefore} → ${riskAfter}`, timeAgo: 'just now' },
        ...s.notifications,
      ],
    }))
  },

  pushNotification: (n) =>
    set((s) => ({ notifications: [{ ...n, id: `n-${Date.now()}`, timeAgo: 'just now' }, ...s.notifications] })),
}))
