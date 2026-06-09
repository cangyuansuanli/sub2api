import { apiClient } from './client'

export interface CheckInRules {
  daily_reward: number
  day4_total: number
  day16_total: number
}

export interface CheckInRecord {
  date: string
  streak_day: number
  daily_reward: number
  bonus_reward: number
  total_reward: number
}

export interface CheckInRewardPreview {
  daily_reward: number
  bonus_reward: number
  total_reward: number
  milestone?: string
}

export interface CheckInStatus {
  checked_in_today: boolean
  streak: number
  next_milestone: number
  today_reward?: CheckInRewardPreview
  rules: CheckInRules
  calendar_month: string
  month_check_ins: CheckInRecord[]
}

export interface CheckInResult {
  message: string
  daily_reward: number
  bonus_reward: number
  total_reward: number
  streak: number
  new_balance: number
  milestone?: string
  date: string
}

export async function getStatus(month?: string): Promise<CheckInStatus> {
  const { data } = await apiClient.get<CheckInStatus>('/check-in/status', {
    params: month ? { month } : undefined
  })
  return data
}

export async function checkIn(): Promise<CheckInResult> {
  const { data } = await apiClient.post<CheckInResult>('/check-in')
  return data
}

export const checkInAPI = {
  getStatus,
  checkIn
}

export default checkInAPI
