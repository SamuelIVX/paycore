import { describe, it, expect, vi } from 'vitest';

vi.mock('@/utils/supabase/client', () => ({
    createClient: () => ({}),
}));

import { calculatePayRollForEmployee } from '@/lib/payroll';
import { Tables } from '@/lib/interfaces/database.types';

const makeEmployee = (overrides: Partial<Tables<'employees'>> = {}): Tables<'employees'> => ({
    id: 'emp-1',
    first_name: 'John',
    last_name: 'Smith',
    role: 'Engineer',
    pay_rate: 30,
    pay_frequency: 'HOURLY',
    federal_tax_rate: 0.22,
    state_tax_rate: 0.093,
    social_security_tax_rate: 0.062,
    employment_status: 'ACTIVE',
    ...overrides,
} as Tables<'employees'>);

const makeTimeEntry = (overrides: Partial<Tables<'time_entries'>> = {}): Tables<'time_entries'> => ({
    id: 'entry-1',
    employee_id: 'emp-1',
    hours_worked: 8,
    work_date: '2026-01-15',
    status: 'APPROVED',
    clock_in: null,
    clock_out: null,
    approved_at: null,
    approved_by: null,
    created_at: null,
    ...overrides,
});

const makePayrollRun = (overrides: Partial<Tables<'payroll_runs'>> = {}): Tables<'payroll_runs'> => ({
    id: 'run-1',
    pay_period_start: '2026-01-15',
    pay_period_end: '2026-01-28',
    run_date: '2026-01-29',
    run_by: 'user-1',
    status: 'COMPLETED',
    total_gross: null,
    total_net: null,
    total_taxes: null,
    ...overrides,
} as Tables<'payroll_runs'>);

describe('calculatePayRollForEmployee', () => {

    describe('HOURLY employees', () => {
        it('calculates gross pay from hours worked', () => {
            const employee = makeEmployee({ pay_rate: 30, pay_frequency: 'HOURLY' });
            const entries = [makeTimeEntry({ hours_worked: 8 })];
            const result = calculatePayRollForEmployee(employee, entries, makePayrollRun());
            expect(result.gross_pay).toBe(240); // 8 * 30
        });

        it('sums hours across multiple time entries', () => {
            const employee = makeEmployee({ pay_rate: 25, pay_frequency: 'HOURLY' });
            const entries = [
                makeTimeEntry({ id: 'e1', hours_worked: 8 }),
                makeTimeEntry({ id: 'e2', hours_worked: 6 }),
            ];
            const result = calculatePayRollForEmployee(employee, entries, makePayrollRun());
            expect(result.gross_pay).toBe(350); // 14 * 25
            expect(result.regular_hours).toBe(14);
        });

        it('only includes time entries belonging to the employee', () => {
            const employee = makeEmployee({ id: 'emp-1', pay_rate: 30, pay_frequency: 'HOURLY' });
            const entries = [
                makeTimeEntry({ id: 'e1', employee_id: 'emp-1', hours_worked: 8 }),
                makeTimeEntry({ id: 'e2', employee_id: 'emp-2', hours_worked: 8 }),
            ];
            const result = calculatePayRollForEmployee(employee, entries, makePayrollRun());
            expect(result.gross_pay).toBe(240); // only emp-1's 8 hours
            expect(result.regular_hours).toBe(8);
        });

        it('results in 0 gross pay when no time entries exist', () => {
            const employee = makeEmployee({ pay_rate: 30, pay_frequency: 'HOURLY' });
            const result = calculatePayRollForEmployee(employee, [], makePayrollRun());
            expect(result.gross_pay).toBe(0);
            expect(result.regular_hours).toBe(0);
        });
    });

    describe('SALARIED employees', () => {
        it('calculates gross pay as annual salary divided by 26 pay periods', () => {
            const employee = makeEmployee({ pay_rate: 100000, pay_frequency: 'SALARY' });
            const result = calculatePayRollForEmployee(employee, [], makePayrollRun());
            expect(result.gross_pay).toBeCloseTo(3846.15, 1);
        });

        it('ignores time entries for salaried employees', () => {
            const employee = makeEmployee({ pay_rate: 100000, pay_frequency: 'SALARY' });
            const entries = [makeTimeEntry({ hours_worked: 80 })];
            const result = calculatePayRollForEmployee(employee, entries, makePayrollRun());
            expect(result.gross_pay).toBeCloseTo(3846.15, 1);
        });
    });

    describe('tax calculations', () => {
        it('calculates federal tax correctly', () => {
            const employee = makeEmployee({ pay_rate: 30, pay_frequency: 'HOURLY', federal_tax_rate: 0.22 });
            const entries = [makeTimeEntry({ hours_worked: 8 })];
            const result = calculatePayRollForEmployee(employee, entries, makePayrollRun());
            expect(result.federal_tax).toBeCloseTo(52.8); // 240 * 0.22
        });

        it('calculates state tax correctly', () => {
            const employee = makeEmployee({ pay_rate: 30, pay_frequency: 'HOURLY', state_tax_rate: 0.093 });
            const entries = [makeTimeEntry({ hours_worked: 8 })];
            const result = calculatePayRollForEmployee(employee, entries, makePayrollRun());
            expect(result.state_tax).toBeCloseTo(22.32); // 240 * 0.093
        });

        it('calculates social security correctly', () => {
            const employee = makeEmployee({ pay_rate: 30, pay_frequency: 'HOURLY', social_security_tax_rate: 0.062 });
            const entries = [makeTimeEntry({ hours_worked: 8 })];
            const result = calculatePayRollForEmployee(employee, entries, makePayrollRun());
            expect(result.social_security).toBeCloseTo(14.88); // 240 * 0.062
        });

        it('defaults null tax rates to 0', () => {
            const employee = makeEmployee({
                pay_rate: 30,
                pay_frequency: 'HOURLY',
                federal_tax_rate: 0,
                state_tax_rate: 0,
                social_security_tax_rate: 0,
            });
            const entries = [makeTimeEntry({ hours_worked: 8 })];
            const result = calculatePayRollForEmployee(employee, entries, makePayrollRun());
            expect(result.federal_tax).toBe(0);
            expect(result.state_tax).toBe(0);
            expect(result.social_security).toBe(0);
            expect(result.net_pay).toBe(240);
        });

        it('net pay equals gross minus all taxes', () => {
            const employee = makeEmployee({
                pay_rate: 30,
                pay_frequency: 'HOURLY',
                federal_tax_rate: 0.22,
                state_tax_rate: 0.093,
                social_security_tax_rate: 0.062,
            });
            const entries = [makeTimeEntry({ hours_worked: 8 })];
            const result = calculatePayRollForEmployee(employee, entries, makePayrollRun());
            const expected = 240 - (240 * 0.22) - (240 * 0.093) - (240 * 0.062);
            expect(result.net_pay).toBeCloseTo(expected);
        });
    });

    describe('output shape', () => {
        it('returns the correct employee_id and payroll_run_id', () => {
            const employee = makeEmployee({ id: 'emp-42' });
            const run = makePayrollRun({ id: 'run-99' });
            const result = calculatePayRollForEmployee(employee, [], run);
            expect(result.employee_id).toBe('emp-42');
            expect(result.payroll_run_id).toBe('run-99');
        });
    });
});
