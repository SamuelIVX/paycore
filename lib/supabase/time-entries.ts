import { createClient } from "@/utils/supabase/client"
import { getCurrentEmployee } from "./employee"


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