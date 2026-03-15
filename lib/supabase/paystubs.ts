import { createClient } from "@/utils/supabase/client"
import { getCurrentEmployee } from "./employee"

export async function getEmployeePaystubs() {
  const supabase = createClient()
  const { employee } = await getCurrentEmployee()

  const { data, error } = await supabase
    .from("payroll_records")
    .select(`
      id,
      regular_hours,
      overtime_hours,
      gross_pay,
      federal_tax,
      state_tax,
      social_security,
      net_pay,
      created_at,
      payroll_runs (
        id,
        pay_period_start,
        pay_period_end,
        run_date,
        status
      )
    `)
    .eq("employee_id", employee.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}