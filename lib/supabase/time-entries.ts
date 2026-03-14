import { createClient } from "@/utils/supabase/client"
import { getCurrentEmployee } from "./employee"

const supabase = createClient()

export async function createTimeEntry(workDate: string, hoursWorked: number) {
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

export async function getRecentTimeEntries() {
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

export async function getWeeklyHours() {
  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const dayOfMonth = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${dayOfMonth}`
  }

  const { employee } = await getCurrentEmployee()

  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((day + 6) % 7))

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const start = formatLocalDate(monday)
  const end = formatLocalDate(sunday)

  const { data, error } = await supabase
    .from("time_entries")
    .select("work_date, hours_worked, status")
    .eq("employee_id", employee.id)
    .gte("work_date", start)
    .lte("work_date", end)
    .in("status", ["PENDING", "APPROVED"])

  if (error) {
    throw error
  }

  return data ?? []
}