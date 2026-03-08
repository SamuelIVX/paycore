import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getPayrollRuns = async () => {
    const { data, error } = await supabase
        .from("payroll_runs")
        .select("*");

    if (error) {
        console.error("Error fetching payroll runs:", error);
        throw error;
    }

    return data;
}

export const getPayrollRecords = async () => {
    const { data, error } = await supabase
        .from("payroll_records")
        .select("*");

    if (error) {
        console.error("Error fetching payroll records:", error);
        throw error;
    }

    return data;
}

export const insertPayrollRun = async (payPeriodStart: string, payPeriodEnd: string, user: string) => {
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

export const getActiveEmployees = async () => {
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

export const getTimeEntriesForPayPeriod = async (payPeriodStart: string, payPeriodEnd: string) => {
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

export const calculatePayRollForEmployee = (employee: any, time_entries: any[], payroll_run: any, BI_WEEKLY_PAY_PERIODS: number) => {
    const { pay_rate, pay_frequency, federal_tax_rate, state_tax_rate, social_security_tax_rate } = employee;

    const hoursWorked = time_entries
        .filter((entry) => entry.employee_id === employee.id)
        .reduce((total, entry) => total + entry.hours_worked, 0);

    const gross_pay = pay_frequency === "HOURLY" ? hoursWorked * pay_rate : pay_rate / BI_WEEKLY_PAY_PERIODS;
    const federal_tax = gross_pay * federal_tax_rate;
    const state_tax = gross_pay * state_tax_rate;
    const social_security_tax = gross_pay * social_security_tax_rate;
    const net_pay = gross_pay - federal_tax - state_tax - social_security_tax;

    return {
        employee_id: employee.id,
        payroll_run_id: payroll_run.id,
        gross_pay,
        federal_tax,
        state_tax,
        social_security: social_security_tax,
        net_pay
    }
}

export const insertPayrollRecords = async (records: any[]) => {
    const { error: rError } = await supabase
        .from("payroll_records")
        .insert(records.filter((r): r is NonNullable<typeof r> => !!r));

    if (rError) {
        console.error("Error inserting payroll records:", rError);
        throw rError;
    }
}

export const updatePayrollRun = async (records: any[], payroll_run: any, payPeriodStart: string, payPeriodEnd: string, user: string) => {
    const valid_records = records.filter((r): r is NonNullable<typeof r> => !!r);
    const total_gross_pay = valid_records.reduce((total, curr) => total + curr.gross_pay, 0);
    const total_federal_tax = valid_records.reduce((total, curr) => total + curr.federal_tax, 0);
    const total_state_tax = valid_records.reduce((total, curr) => total + curr.state_tax, 0);
    const total_social_security_tax = valid_records.reduce((total, curr) => total + curr.social_security, 0);
    const total_net_pay = valid_records.reduce((total, curr) => total + curr.net_pay, 0);

    const { error: updateError } = await supabase
        .from("payroll_runs")
        .update({
            "run_date": new Date().toISOString(),
            "run_by": user,
            "total_gross": total_gross_pay,
            "total_net": total_net_pay,
            "total_taxes": Number((total_federal_tax + total_state_tax + total_social_security_tax).toFixed(2)),
            "status": "COMPLETED"
        })
        .eq("id", payroll_run.id);

    if (updateError) {
        console.error("Error updating payroll run:", updateError);
        throw updateError;
    }

    return {
        total_gross_pay,
        total_net_pay,
        total_taxes: Number((total_federal_tax + total_state_tax + total_social_security_tax).toFixed(2))
    }
}

export const runPayroll = async (payPeriodStart: string, payPeriodEnd: string) => {
    const user = await supabase.auth.getUser();
    const BI_WEEKLY_PAY_PERIODS = 26;

    // Insert a new payroll run with status "PROCESSING"
    const payroll_run = await insertPayrollRun(payPeriodStart, payPeriodEnd, user.data.user?.id || "");


    // Fetch ACTIVE employees
    const employees = await getActiveEmployees();

    // Fetch time entries within the pay period
    const time_entries = await getTimeEntriesForPayPeriod(payPeriodStart, payPeriodEnd);

    // Calculate payroll records for each employee 
    const employeeRecords = employees.map((employee) => {
        const records = calculatePayRollForEmployee(employee, time_entries, payroll_run, BI_WEEKLY_PAY_PERIODS);
        return records;
    })

    // Insert payroll records into the database
    await insertPayrollRecords(employeeRecords);

    // Update payroll run row with calculated values and set status to "COMPLETED"
    const { total_gross_pay, total_net_pay, total_taxes } = await updatePayrollRun(employeeRecords, payroll_run, payPeriodStart, payPeriodEnd, user.data.user?.id || "");

    return {
        total_gross: total_gross_pay,
        total_net: total_net_pay,
        total_taxes
    };

}