import { createClient } from "@/utils/supabase/client"
import { getCurrentEmployee } from "./employee"

export async function createTimeEntry(workDate: string, hoursWorked: number) {
  const supabase = createClient()
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

export async function getWeeklyHours() {
  const supabase = createClient()
  const { employee } = await getCurrentEmployee()

  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((day + 6) % 7))

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const start = monday.toISOString().split("T")[0]
  const end = sunday.toISOString().split("T")[0]

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