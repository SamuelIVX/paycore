'use server'

import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { TablesInsert, Tables } from "@/lib/interfaces/database.types";
import { calculatePayRollForEmployee } from "@/lib/payroll";

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

export const insertPayrollRecords = async (supabase: SupabaseClient, records: TablesInsert<"payroll_records">[]) => {
    const { error: rError } = await supabase
        .from("payroll_records")
        .insert(records.filter((r): r is NonNullable<typeof r> => !!r));

    if (rError) {
        console.error("Error inserting payroll records:", rError);
        throw rError;
    }
};

export const updatePayrollRun = async (supabase: SupabaseClient, records: TablesInsert<"payroll_records">[], payroll_run: Tables<"payroll_runs">, user: string) => {
    const valid_records = records.filter((r): r is NonNullable<typeof r> => !!r);
    const total_gross_pay = valid_records.reduce((total, curr) => total + curr.gross_pay, 0);
    const total_federal_tax = valid_records.reduce((total, curr) => total + (curr.federal_tax ?? 0), 0);
    const total_state_tax = valid_records.reduce((total, curr) => total + (curr.state_tax ?? 0), 0);
    const total_social_security_tax = valid_records.reduce((total, curr) => total + (curr.social_security ?? 0), 0);
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
    };
};

export const runPayroll = async (payPeriodStart: string, payPeriodEnd: string) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id ?? "";

    // Idempotency: reject if a completed run already exists for this period
    const { data: existingRun } = await supabase
        .from("payroll_runs")
        .select("id, status")
        .eq("pay_period_start", payPeriodStart)
        .eq("pay_period_end", payPeriodEnd)
        .in("status", ["PROCESSING", "COMPLETED"])
        .maybeSingle();

    if (existingRun) {
        throw new Error(`Payroll for this period has already been ${existingRun.status?.toLowerCase()}.`);
    }

    const payroll_run = await insertPayrollRun(supabase, payPeriodStart, payPeriodEnd, userId);

    try {
        const employees = await getActiveEmployees(supabase);
        const time_entries = await getTimeEntriesForPayPeriod(supabase, payPeriodStart, payPeriodEnd);

        const employeeRecords = employees.map((employee) =>
            calculatePayRollForEmployee(employee, time_entries, payroll_run)
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
        await supabase
            .from("payroll_runs")
            .update({ status: "FAILED" })
            .eq("id", payroll_run.id);
        throw err;
    }
};
