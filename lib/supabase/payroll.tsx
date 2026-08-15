/**
 * Pure payroll math + browser-client fetches for payroll runs/records.
 * Uses a fixed 26 bi-weekly periods/year; overtime is computed per Mon–Sun UTC week.
 * SECURITY: handles pay rates, tax rates, and net pay — do not log employee compensation.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import type { Tables, Database } from "@/lib/interfaces/database.types";
import { roundMoney } from "@/lib/money";
import { BI_WEEKLY_PAY_PERIODS } from "@/lib/payroll-constants";

let supabase: ReturnType<typeof createClient> | null = null;
const getSupabaseClient = () => {
    if (!supabase) supabase = createClient();
    return supabase;
};

/**
 * Fetches all payroll_runs rows.
 * @param supabase - Optional Supabase client; falls back to module-scope browser client.
 * @returns Payroll run list for manager tables/charts.
 * @throws Relays Supabase errors after console.error.
 * @example
 * const runs = await getPayrollRuns();
 * const runs = await getPayrollRuns(serverClient);
 */
export const getPayrollRuns = async (supabase?: SupabaseClient<Database>) => {
    const client = supabase ?? getSupabaseClient();
    const { data: payroll_runs, error } = await client
        .from("payroll_runs")
        .select("*");

    if (error) {
        console.error("Error fetching payroll runs:", error);
        throw error;
    }

    return payroll_runs;
};

/**
 * Fetches payroll_records with joined employee name + pay_frequency.
 * SECURITY: includes compensation fields — manager-facing.
 * @param supabase - Optional Supabase client; falls back to module-scope browser client.
 * @returns Records with nested employee display fields.
 * @throws Relays Supabase errors.
 * @example
 * const records = await getPayrollRecords();
 * const records = await getPayrollRecords(serverClient);
 */
export const getPayrollRecords = async (supabase?: SupabaseClient<Database>) => {
    const client = supabase ?? getSupabaseClient();
    const { data: payroll_records, error } = await client
        .from("payroll_records")
        .select("*, employees!payroll_records_employee_id_fkey(pay_frequency, first_name, last_name)");

    if (error) {
        console.error("Error fetching payroll records:", error);
        throw error;
    }

    return payroll_records;
};

function getWeekStartKey(date: Date): string {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    // Shift to Monday (week start)
    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
    return d.toISOString().slice(0, 10);
}

/**
 * Buckets approved hours into Mon–Sun UTC weeks and applies 1.5× OT after 40h/week.
 * @param entries - Time entries for one employee (work_date + hours_worked).
 * @param pay_rate - Hourly rate used for regular and OT gross.
 * @returns Aggregated regularHours, overtimeHours, and gross_pay.
 * @example
 * computeWeeklyOvertime([{ work_date: "2026-08-10", hours_worked: 45 }], 20)
 * // => { regularHours: 40, overtimeHours: 5, gross_pay: 950 }
 */
function computeWeeklyOvertime(
    entries: Tables<"time_entries">[],
    pay_rate: number
): { regularHours: number; overtimeHours: number; gross_pay: number } {
    const weekMap = new Map<string, number>();

    for (const entry of entries) {
        const dateStr = entry.work_date;
        if (!dateStr) continue;
        const key = getWeekStartKey(new Date(dateStr));
        weekMap.set(key, (weekMap.get(key) ?? 0) + entry.hours_worked);
    }

    let regularHours = 0;
    let overtimeHours = 0;
    let gross_pay = 0;

    for (const weekHours of weekMap.values()) {
        const reg = Math.min(weekHours, 40);
        const ot = Math.max(weekHours - 40, 0);
        regularHours += reg;
        overtimeHours += ot;
        gross_pay += reg * pay_rate + ot * pay_rate * 1.5;
    }

    return { regularHours, overtimeHours, gross_pay };
}

// Now accepts benefitDeduction (number) and subtracts it from net_pay
/**
 * Computes one employee's payroll_record fields for a run.
 * HOURLY/BI_WEEKLY: per-week OT at 1.5× after 40h; SALARY: pay_rate/26.
 * Monthly benefitDeduction is prorated by 12/26 only when gross_pay > 0.
 * SECURITY: input/output contain pay and tax amounts — do not log.
 * @param employee - Employee row with pay_rate, frequency, and tax rates.
 * @param time_entries - Period entries (filtered to this employee inside).
 * @param payroll_run - Parent run (id stamped onto the result).
 * @param benefitDeduction - Monthly optional/company deduction total (default 0).
 * @returns Insert-shaped record fields (hours, taxes, net_pay).
 * @example
 * const row = calculatePayRollForEmployee(employee, entries, run, 200);
 */
export const calculatePayRollForEmployee = (
    employee: Tables<"employees">,
    time_entries: Tables<"time_entries">[],
    payroll_run: Tables<"payroll_runs">,
    benefitDeduction: number = 0
) => {
    const { pay_rate, pay_frequency, federal_tax_rate, state_tax_rate, social_security_tax_rate } = employee;

    const employeeEntries = time_entries.filter((entry) => entry.employee_id === employee.id);
    const hoursWorked = employeeEntries.reduce((total, entry) => total + entry.hours_worked, 0);

    let gross_pay = 0;
    let regularHours = 0;
    let overtimeHours = 0;

    if (pay_frequency === "HOURLY" || pay_frequency === "BI_WEEKLY") {
        // Overtime is computed per workweek to avoid overpaying across multi-week pay periods
        ({ regularHours, overtimeHours, gross_pay } = computeWeeklyOvertime(employeeEntries, pay_rate));
    } else if (pay_frequency === "SALARY") {
        // Salaried employees get their annual salary / 26 pay periods
        gross_pay = pay_rate / BI_WEEKLY_PAY_PERIODS;
        regularHours = hoursWorked; // Track for records
        overtimeHours = 0;
    }

    gross_pay = roundMoney(gross_pay);

    // Calculate taxes
    const federal_tax = roundMoney(gross_pay * (federal_tax_rate ?? 0));
    const state_tax = roundMoney(gross_pay * (state_tax_rate ?? 0));
    const social_security_tax = roundMoney(gross_pay * (social_security_tax_rate ?? 0));

    // Calculate benefits deduction (convert monthly to bi-weekly)
    const perPeriodBenefitDeduction = gross_pay > 0
        ? roundMoney((benefitDeduction * 12) / BI_WEEKLY_PAY_PERIODS)
        : 0;  // Only deduct benefits when a run is actually paying the employee

    // Calculate net pay
    const net_pay = roundMoney(gross_pay - federal_tax - state_tax - social_security_tax - perPeriodBenefitDeduction);

    return {
        employee_id: employee.id,
        payroll_run_id: payroll_run.id,
        regular_hours: regularHours,
        overtime_hours: overtimeHours,
        gross_pay,
        federal_tax,
        state_tax,
        social_security: social_security_tax,
        benefit_deductions: perPeriodBenefitDeduction,
        net_pay
    };
};

/**
 * Average benefit_deductions across the latest 6 payroll_records (by period start).
 * @param supabase - Optional Supabase client; falls back to module-scope browser client.
 * @returns Mean deduction amount, or 0 when no records exist.
 * @throws On Supabase error.
 * @example
 * const avg = await getAverageBenefitDeductions();
 * const avg = await getAverageBenefitDeductions(serverClient);
 */
export const getAverageBenefitDeductions = async (supabase?: SupabaseClient<Database>) => {
    const client = supabase ?? getSupabaseClient();
    const LATEST_PAY_PERIODS = 6

    const { data, error } = await client
        .from("payroll_records")
        .select(`
            benefit_deductions,
            payroll_runs!payroll_records_payroll_run_id_fkey(pay_period_start)
        `)
        .order("payroll_runs(pay_period_start)", { ascending: false })
        .limit(LATEST_PAY_PERIODS)

    if (error) {
        console.error("Error fetching benefit deductions:", error)
        throw error
    }

    if (!data || data.length === 0) {
        return 0
    }

    const total = data.reduce((sum: number, record: { benefit_deductions: number | null }) => sum + (record.benefit_deductions || 0), 0)
    return total / data.length
}
