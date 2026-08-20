import type { Worker, NotificationItem } from '../types'

export const workers: Worker[] = [
  { id: 'W-01', name: 'Rajesh Kumar', status: 'on_duty', ward: 'Ward 12' },
  { id: 'W-02', name: 'Sunita Pawar', status: 'on_duty', ward: 'Ward 7' },
  { id: 'W-03', name: 'Vikram Shinde', status: 'off_duty', ward: 'Ward 4' },
]

export const currentWorker = workers[0]

export const initialNotifications: NotificationItem[] = [
  { id: 'n1', level: 'CRITICAL', message: 'Waterlogging risk increased at D-104', timeAgo: '4 min ago' },
  { id: 'n2', level: 'HIGH', message: 'Heavy rainfall forecast for next 6 hours', timeAgo: '22 min ago' },
  { id: 'n3', level: 'INFO', message: 'D-221 inspection completed', timeAgo: '1 hr ago' },
  { id: 'n4', level: 'SENSOR', message: 'WL-042 battery below 20%', timeAgo: '2 hr ago' },
]
