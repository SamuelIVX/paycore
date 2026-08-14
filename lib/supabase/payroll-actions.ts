'use server'

/**
 * Server actions that orchestrate a payroll run: insert run, load ACTIVE employees +
 * APPROVED time entries, compute per-employee records (with eligibility-gated optional
 * benefit deductions), then mark the run COMPLETED.
 * SECURITY: requires an authenticated user; mutates payroll_runs/payroll_records with PII-adjacent pay data.
 */
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { TablesInsert, Tables } from "@/lib/interfaces/database.types";
import { calculatePayRollForEmployee } from "@/lib/supabase/payroll";
import { getActiveOptionalEmployeeBenefits } from "@/lib/supabase/benefits";
import { shouldApplyOptionalDeductions } from "@/lib/benefits/eligibility";
import { getWeekStartKey } from "@/lib/utils/date-helpers";
import { roundMoney } from "@/lib/money";

type EmployeeBenefitRow = Tables<"employee_benefits"> & {
    benefit?: Pick<Tables<"benefits">, "id" | "type" | "monthly_cost"> | null;
};

/**
 * Buckets entries into Mon→Sun UTC weeks → total approved hours that week.
 * Shared by the per-week eligibility calculation in runPayroll so payroll
 * matches the UI's per-week gate.
 */
const weeklyApprovedHours = (entries: Tables<"time_entries">[]): Map<string, number> => {
    const weekTotals = new Map<string, number>();
    for (const entry of entries) {
        if (!entry.work_date) continue;
        const key = getWeekStartKey(entry.work_date);
        weekTotals.set(key, (weekTotals.get(key) ?? 0) + (entry.hours_worked ?? 0));
    }
    return weekTotals;
};

/**
 * Inserts a PROCESSING payroll_run for the given period.
 * @param supabase - Server Supabase client.
 * @param payPeriodStart - Inclusive YYYY-MM-DD.
 * @param payPeriodEnd - Inclusive YYYY-MM-DD.
 * @param user - Auth user id stored as run_by.
 * @returns Inserted payroll_runs row.
 * @throws On insert failure.
 * @example
 * const run = await insertPayrollRun(supabase, "2026-08-01", "2026-08-14", userId);
 */
export const insertPayrollRun = async (supabase: SupabaseClient, payPeriodStart: string, payPeriodEnd: string, user: string) => {
    const { data: run, error: runError } = await supabase
        .from("payroll_runs")
        .insert({
            pay_period_start: payPeriodStart,
            pay_period_end: payPeriodEnd,
            run_date: new Date().toISOString(),
            run_by: user,
            status: "PROCESSING"
        })
        .select("*")
        .single();

    if (runError) {
        console.error("Error inserting payroll run:", runError)
        throw runError;
    }

    return run;
}

/**
 * Loads all employees with employment_status ACTIVE.
 * SECURITY: full employee rows including pay/tax fields.
 * @param supabase - Server Supabase client.
 * @returns Active employee rows.
 * @throws On Supabase error.
 * @example
 * const staff = await getActiveEmployees(supabase);
 */
export const getActiveEmployees = async (supabase: SupabaseClient) => {
    const { data: employees, error: eError } = await supabase
        .from("employees")
        .select("*")
        .eq("employment_status", "ACTIVE");

    if (eError) {
        console.error("Error fetching active employees:", eError);
        throw eError;
    }

    return employees;
}

/**
 * APPROVED time_entries with work_date in [start, end] inclusive.
 * @param supabase - Server Supabase client.
 * @param payPeriodStart - Inclusive YYYY-MM-DD.
 * @param payPeriodEnd - Inclusive YYYY-MM-DD.
 * @returns Approved entries in the period.
 * @throws On Supabase error.
 * @example
 * const entries = await getTimeEntriesForPayPeriod(supabase, start, end);
 */
export const getTimeEntriesForPayPeriod = async (supabase: SupabaseClient, payPeriodStart: string, payPeriodEnd: string) => {
    const { data: time_entries, error: tError } = await supabase
        .from("time_entries")
        .select("*")
        .gte("work_date", payPeriodStart)
        .lte("work_date", payPeriodEnd)
        .eq("status", "APPROVED");

    if (tError) {
        console.error("Error fetching time entries within pay period:", tError);
        throw tError;
    }

    return time_entries;
}

/**
 * Bulk-inserts computed payroll_records (nulls filtered out).
 * @param supabase - Server Supabase client.
 * @param records - Insert-shaped payroll_records (may include null holes).
 * @throws On Supabase error.
 * @example
 * await insertPayrollRecords(supabase, computedRecords);
 */
export const insertPayrollRecords = async (supabase: SupabaseClient, records: TablesInsert<"payroll_records">[]) => {
    const { error: rError } = await supabase
        .from("payroll_records")
        .insert(records.filter((r): r is NonNullable<typeof r> => !!r));

    if (rError) {
        console.error("Error inserting payroll records:", rError);
        throw rError;
    }
};

/**
 * Aggregates record totals onto the run and sets status COMPLETED.
 * @param supabase - Server Supabase client.
 * @param records - Inserted/computed records used for totals.
 * @param payroll_run - Run row being finalized.
 * @param user - Auth user id for audit fields.
 * @returns Fixed-string totals for gross, net, and taxes.
 * @throws On update failure.
 * @example
 * await updatePayrollRun(supabase, records, run, userId);
 */
export const updatePayrollRun = async (supabase: SupabaseClient, records: TablesInsert<"payroll_records">[], payroll_run: Tables<"payroll_runs">, user: string) => {
    const valid_records = records.filter((r): r is NonNullable<typeof r> => !!r);
    const total_gross_pay = valid_records.reduce((total, curr) => total + curr.gross_pay, 0);
    const total_federal_tax = valid_records.reduce((total, curr) => total + (curr.federal_tax ?? 0), 0);
    const total_state_tax = valid_records.reduce((total, curr) => total + (curr.state_tax ?? 0), 0);
    const total_social_security_tax = valid_records.reduce((total, curr) => total + (curr.social_security ?? 0), 0);
    const total_benefit_deductions = valid_records.reduce((total, curr) => total + (curr.benefit_deductions ?? 0), 0);
    const total_net_pay = valid_records.reduce((total, curr) => total + curr.net_pay, 0);

    const { error: updateError } = await supabase
        .from("payroll_runs")
        .update({
            "run_date": new Date().toISOString(),
            "run_by": user,
            "total_gross": roundMoney(total_gross_pay),
            "total_net": roundMoney(total_net_pay),
            "total_taxes": roundMoney(total_federal_tax + total_state_tax + total_social_security_tax),
            "total_benefit_deductions": roundMoney(total_benefit_deductions),
            "status": "COMPLETED"
        })
        .eq("id", payroll_run.id);

    if (updateError) {
        console.error("Error updating payroll run:", updateError);
        throw updateError;
    }

    return {
        total_gross_pay: roundMoney(total_gross_pay),
        total_net_pay: roundMoney(total_net_pay),
        total_taxes: roundMoney(total_federal_tax + total_state_tax + total_social_security_tax)
    };
};

/**
 * End-to-end payroll orchestration for one pay period.
 * Rejects unauthenticated callers, invalid dates, and duplicate PROCESSING/COMPLETED runs.
 * Applies optional benefit deductions only when shouldApplyOptionalDeductions passes
 * for that employee's weekly approved hours.
 * SECURITY: mutates payroll tables; requires auth session.
 * @param payPeriodStart - Inclusive YYYY-MM-DD.
 * @param payPeriodEnd - Inclusive YYYY-MM-DD.
 * @throws If unauthenticated, dates invalid, or period already run.
 * @example
 * await runPayroll("2026-08-01", "2026-08-14");
 */
export const runPayroll = async (payPeriodStart: string, payPeriodEnd: string) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("User must be authenticated to run payroll.");
    }
    const userId = user.id;

    const startDate = new Date(payPeriodStart);
    const endDate = new Date(payPeriodEnd);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid pay period dates provided.");
    }
    if (startDate > endDate) {
        throw new Error("Pay period start date must be before or equal to end date.");
    }

    // Idempotency: reject if a completed run already exists for this period
    const { data: existingRun, error: existingRunError } = await supabase
        .from("payroll_runs")
        .select("id, status")
        .eq("pay_period_start", payPeriodStart)
        .eq("pay_period_end", payPeriodEnd)
        .in("status", ["PROCESSING", "COMPLETED"])
        .maybeSingle();

    if (existingRun) {
        throw new Error(`Payroll for this period has already been ${existingRun.status?.toLowerCase()}.`);
    }
    if (existingRunError) {
        console.error("Error checking for existing payroll run:", existingRunError);
        throw existingRunError;
    }

    const payroll_run = await insertPayrollRun(supabase, payPeriodStart, payPeriodEnd, userId);

    try {
        const employees = await getActiveEmployees(supabase);
        const time_entries = await getTimeEntriesForPayPeriod(supabase, payPeriodStart, payPeriodEnd);

        const employeeRecords = await Promise.all(
            employees.map(async (employee) => {
                const benefits = await getActiveOptionalEmployeeBenefits(employee.id, supabase);
                const rawDeduction = benefits.reduce((sum: number, row: EmployeeBenefitRow) => sum + (row.benefit?.monthly_cost || 0), 0);
                const employeeEntries = time_entries.filter((entry) => entry.employee_id === employee.id);

                // Per-week eligibility: for each Mon→Sun week the employee has
                // entries in, check the 30hr/state gate independently and prorate
                // the monthly deduction by the fraction of eligible weeks. Matches
                // the per-week semantics shown to the employee in the UI.
                const weekTotals = weeklyApprovedHours(employeeEntries);
                let eligibleWeeks = 0;
                for (const hours of weekTotals.values()) {
                    if (shouldApplyOptionalDeductions({
                        employmentStatus: employee.employment_status,
                        hoursPerWeek: hours,
                        state: employee.state,
                    })) {
                        eligibleWeeks++;
                    }
                }
                const totalEntryWeeks = weekTotals.size;
                const benefitDeduction = totalEntryWeeks > 0
                    ? rawDeduction * (eligibleWeeks / totalEntryWeeks)
                    : 0;

                return calculatePayRollForEmployee(employee, time_entries, payroll_run, benefitDeduction);
            })
        );

        await insertPayrollRecords(supabase, employeeRecords);

        const { total_gross_pay, total_net_pay, total_taxes } = await updatePayrollRun(supabase, employeeRecords, payroll_run, userId);

        return {
            total_gross: total_gross_pay,
            total_net: total_net_pay,
            total_taxes
        };
    } catch (err) {
        // Mark the run FAILED so it doesn't get stuck in PROCESSING
        const { error: failError } = await supabase
            .from("payroll_runs")
            .update({ status: "FAILED" })
            .eq("id", payroll_run.id);

        if (failError) {
            console.error("Error marking payroll run as FAILED after error:", failError);
        }
        throw err;
    }
};
