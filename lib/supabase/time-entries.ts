import { createClient } from "@/utils/supabase/client"
import { getCurrentEmployee } from "./employee"
import { getWeekStartKey, getWeekStartUTC } from "@/lib/utils/date-helpers"

// How many Mon→Sun weeks (including the current one) to scan when deciding
// whether the employee meets the per-week eligibility threshold.
const ELIGIBILITY_LOOKBACK_WEEKS = 4


export const createTimeEntry = async (workDate: string, hoursWorked: number) => {
  const supabase = createClient()

  if (!/^\d{4}-\d{2}-\d{2}$/.test(workDate)) {
    throw new Error("workDate must be in YYYY-MM-DD format")
  }

  if (!Number.isFinite(hoursWorked) || hoursWorked < 0) {
    throw new Error("hoursWorked must be a non-negative number")
  }

  const { employee } = await getCurrentEmployee()

  const { data, error } = await supabase
    .from("time_entries")
    .insert([
      {
        employee_id: employee.id,
        work_date: workDate,
        hours_worked: hoursWorked,
        status: "PENDING",
      },
    ])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export const getRecentTimeEntries = async () => {
  const supabase = createClient()
  const { employee } = await getCurrentEmployee()

  const { data, error } = await supabase
    .from("time_entries")
    .select("id, work_date, hours_worked, status, created_at")
    .eq("employee_id", employee.id)
    .order("work_date", { ascending: false })
    .limit(5)

  if (error) {
    throw error
  }

  return data ?? []
}

export const getApprovedHoursWorked = async (referenceDate?: Date): Promise<number> => {
  const supabase = createClient()
  const { employee } = await getCurrentEmployee()

  // Scan the last ELIGIBILITY_LOOKBACK_WEEKS Mon→Sun UTC weeks and return the
  // highest single-week total. A single look-back week is too narrow — on a
  // Monday morning the current week is empty, so a worker with 40 approved
  // hours last week would otherwise read as 0 and fail the gate.
  const currentMonday = getWeekStartUTC(referenceDate ?? new Date())
  const windowStart = new Date(currentMonday)
  windowStart.setUTCDate(windowStart.getUTCDate() - 7 * (ELIGIBILITY_LOOKBACK_WEEKS - 1))
  const windowEnd = new Date(currentMonday)
  windowEnd.setUTCDate(windowEnd.getUTCDate() + 6)

  const startISO = windowStart.toISOString().slice(0, 10)
  const endISO = windowEnd.toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from("time_entries")
    .select("hours_worked, work_date")
    .eq("employee_id", employee.id)
    .eq("status", "APPROVED")
    .gte("work_date", startISO)
    .lte("work_date", endISO)

  if (error) {
    throw error
  }

  const weeklyHours = new Map<string, number>()
  for (const entry of data ?? []) {
    if (!entry.work_date) continue
    const key = getWeekStartKey(entry.work_date)
    weeklyHours.set(key, (weeklyHours.get(key) ?? 0) + (entry.hours_worked ?? 0))
  }

  return weeklyHours.size > 0 ? Math.max(...weeklyHours.values()) : 0
}