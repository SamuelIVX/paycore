import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/lib/interfaces/database.types";

const supabase = createClient();
const BI_WEEKLY_PAY_PERIODS = 26;

export const getPayrollRuns = async () => {
    const { data: payroll_runs, error } = await supabase
        .from("payroll_runs")
        .select("*");

    if (error) {
        console.error("Error fetching payroll runs:", error);
        throw error;
    }

    return payroll_runs;
};

export const getPayrollRecords = async () => {
    const { data: payroll_records, error } = await supabase
        .from("payroll_records")
        .select("*, employees!payroll_records_employee_id_fkey(pay_frequency)");

    if (error) {
        console.error("Error fetching payroll records:", error);
        throw error;
    }

    return payroll_records;
};

function getWeekStartKey(date: Date): string {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    // Shift to Monday (week start)
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d.toISOString().slice(0, 10);
}

function computeWeeklyOvertime(
    entries: Tables<"time_entries">[],
    pay_rate: number
): { regularHours: number; overtimeHours: number; gross_pay: number } {
    const weekMap = new Map<string, number>();

    for (const entry of entries) {
        const dateStr = entry.work_date ?? entry.clock_in;
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
export const calculatePayRollForEmployee = (
    employee: Tables<"employees">,
    time_entries: Tables<"time_entries">[],
    payroll_run: Tables<"payroll_runs">,
    benefitDeduction: number = 0
) => {
    const { pay_rate, pay_frequency, federal_tax_rate, state_tax_rate, social_security_tax_rate } = employee;

    const hoursWorked = time_entries
        .filter((entry) => entry.employee_id === employee.id)
        .reduce((total, entry) => total + entry.hours_worked, 0);

    let gross_pay = 0;
    let regularHours = 0;
    let overtimeHours = 0;


    if (pay_frequency === "HOURLY") {
        regularHours = Math.min(hoursWorked, 40);
        overtimeHours = Math.max(hoursWorked - 40, 0);
        gross_pay = (regularHours * pay_rate) + (overtimeHours * pay_rate * 1.5);
    } else if (pay_frequency === "BI_WEEKLY") {
        // Overtime must be computed per workweek, not across the full bi-weekly period
        const employeeEntries = time_entries.filter((e) => e.employee_id === employee.id);
        ({ regularHours, overtimeHours, gross_pay } = computeWeeklyOvertime(employeeEntries, pay_rate));
    } else if (pay_frequency === "SALARY") {
        // Salaried employees get their annual salary / 26 pay periods
        gross_pay = pay_rate / BI_WEEKLY_PAY_PERIODS;
        regularHours = hoursWorked; // Track for records
        overtimeHours = 0;
    }

    // Calculate taxes
    const federal_tax = gross_pay * (federal_tax_rate ?? 0);
    const state_tax = gross_pay * (state_tax_rate ?? 0);
    const social_security_tax = gross_pay * (social_security_tax_rate ?? 0);

    // Calculate benefits deduction (convert monthly to bi-weekly)
    const perPeriodBenefitDeduction = gross_pay > 0
        ? (benefitDeduction * 12) / BI_WEEKLY_PAY_PERIODS
        : 0;  // Only deduct benefits when a run is actually paying the employee


    // Calculate net pay
    const net_pay = gross_pay - federal_tax - state_tax - social_security_tax - perPeriodBenefitDeduction;

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
