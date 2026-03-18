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
        .select("*");

    if (error) {
        console.error("Error fetching payroll records:", error);
        throw error;
    }

    return payroll_records;
};

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

    const gross_pay = pay_frequency === "HOURLY" ? hoursWorked * pay_rate : pay_rate / BI_WEEKLY_PAY_PERIODS;
    const federal_tax = gross_pay * (federal_tax_rate ?? 0);
    const state_tax = gross_pay * (state_tax_rate ?? 0);
    const social_security_tax = gross_pay * (social_security_tax_rate ?? 0);
    const perPeriodBenefitDeduction = (benefitDeduction * 12) / BI_WEEKLY_PAY_PERIODS;
    const net_pay = gross_pay - federal_tax - state_tax - social_security_tax - perPeriodBenefitDeduction;

    return {
        employee_id: employee.id,
        payroll_run_id: payroll_run.id,
        regular_hours: hoursWorked,
        gross_pay,
        federal_tax,
        state_tax,
        social_security: social_security_tax,
        benefit_deductions: perPeriodBenefitDeduction,
        net_pay
    };
};
