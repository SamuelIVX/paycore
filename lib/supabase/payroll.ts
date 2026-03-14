import { createClient } from "@/utils/supabase/client"
import { getCurrentEmployee } from "./employee"

const supabase = createClient()

export async function getEmployeePaystubs() {
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

export async function getLastPayrollRecord() {
  const { employee } = await getCurrentEmployee()

  const { data, error } = await supabase
    .from("payroll_records")
    .select(`
      id,
      gross_pay,
      net_pay,
      created_at,
      payroll_runs (
        pay_period_start,
        pay_period_end,
        run_date
      )
    `)
    .eq("employee_id", employee.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function getYtdEarnings() {
  const { employee } = await getCurrentEmployee()

  const startOfYear = `${new Date().getFullYear()}-01-01`

  const { data, error } = await supabase
    .from("payroll_records")
    .select("net_pay, created_at")
    .eq("employee_id", employee.id)
    .gte("created_at", startOfYear)

  if (error) {
    throw error
  }

  const records = data ?? []
  const totalNet = records.reduce((sum, row) => sum + Number(row.net_pay ?? 0), 0)

  return {
    totalNet,
    paychecks: records.length,
    averagePerCheck: records.length ? totalNet / records.length : 0,
  }
}