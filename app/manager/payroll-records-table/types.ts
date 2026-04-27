export type PayrollRecordType = {
    id: string;
    employee_id: string | null;
    payroll_run_id: string | null;
    regular_hours: number | null;
    overtime_hours: number | null;
    gross_pay: number;
    federal_tax: number | null;
    state_tax: number | null;
    social_security: number | null;
    benefit_deductions: number | null;
    net_pay: number;
    employees: { pay_frequency: string; first_name: string | null; last_name: string | null } | null;
    created_at: string | null;
};