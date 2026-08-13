/**
 * Fetches the authenticated employee's payroll_records joined with run + employee fields
 * for paystub rendering.
 * SECURITY: returns compensation and address PII for the current employee only.
 */
import { createClient } from "@/utils/supabase/client";
import { getCurrentEmployee } from "./employee";

/**
 * Payroll records for the current employee with nested run + employee fields.
 * SECURITY: compensation and address PII for the authenticated employee.
 * @returns Paystub source rows for the signed-in employee.
 * @throws If unauthenticated or Supabase fails.
 * @example
 * const stubs = await getEmployeePaystubs();
 */
export async function getEmployeePaystubs() {
	const supabase = createClient();
	const { employee } = await getCurrentEmployee();

	const { data, error } = await supabase
		.from("payroll_records")
		.select(`
      id,
      regular_hours,
      overtime_hours,
      gross_pay,
      federal_tax,
      state_tax,
      benefit_deductions,
      social_security,
      net_pay,
      created_at,
      payroll_runs (
        id,
        pay_period_start,
        pay_period_end,
        run_date,
        status
      ),
      employees (
        pay_rate,
        pay_frequency,
        first_name,
        last_name,
        address_line,
        city,
        state,
        zip_code,
        phone
      )
    `)
		.eq("employee_id", employee.id)
		.order("created_at", { ascending: false });

	if (error) {
		throw error;
	}

	return data ?? [];
}
