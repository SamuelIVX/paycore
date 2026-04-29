import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processPaystubData } from '@/app/employee/paystubs/utils';
import type { RawPaystubRow } from '@/app/employee/paystubs/types';

vi.mock('@/lib/utils', () => ({
    formatPayPeriod: (start: string | null, end: string | null) => 'Jan 15 - Jan 28, 2026',
    formatPaidOn: (date: string | null) => '01/30/2026',
}));

const makeRawPaystubRow = (overrides: Partial<RawPaystubRow> = {}): RawPaystubRow => ({
    id: 'payroll-1',
    regular_hours: 80,
    overtime_hours: 10,
    gross_pay: 3000,
    federal_tax: 660,
    state_tax: 279,
    benefit_deductions: 50,
    social_security: 186,
    medicare: 43.50,
    net_pay: 1781.50,
    created_at: '2026-01-30T00:00:00Z',
    payroll_runs: {
        id: 'run-1',
        pay_period_start: '2026-01-15',
        pay_period_end: '2026-01-28',
        run_date: '2026-01-30',
        status: 'COMPLETED',
    },
    employees: {
        id: 'emp-1',
        pay_rate: 30,
        pay_frequency: 'HOURLY',
        first_name: 'John',
        last_name: 'Smith',
        address_line: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip_code: '94105',
        phone: '555-1234',
    },
    ytd_gross: 12000,
    ytd_federal_tax: 2640,
    ytd_state_tax: 1116,
    ytd_social_security: 744,
    ytd_medicare: 174,
    ytd_benefits: 200,
    ytd_net_pay: 7126,
    ...overrides,
});

describe('processPaystubData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('processes basic paystub data', () => {
        const row = makeRawPaystubRow();
        const result = processPaystubData(row);

        expect(result.id).toBe('payroll-1');
        expect(result.employeeName).toBe('John Smith');
        expect(result.grossPay).toBe(3000);
        expect(result.netPay).toBe(1781.50);
    });

    it('handles missing payroll runs data', () => {
        const row = makeRawPaystubRow({ payroll_runs: null as any });
        const result = processPaystubData(row);

        expect(result.period).toBe('Jan 15 - Jan 28, 2026');
        expect(result.paidOn).toBe('01/30/2026');
    });

    it('handles missing employee data', () => {
        const row = makeRawPaystubRow({ employees: null as any });
        const result = processPaystubData(row);

        expect(result.employeeName).toBe('Unknown');
        expect(result.employeeAddress).toBe('No address on file');
    });

    it('handles null values for hours', () => {
        const row = makeRawPaystubRow({
            regular_hours: null,
            overtime_hours: null,
        });
        const result = processPaystubData(row);

        expect(result.regularHours).toBe(0);
        expect(result.overtimeHours).toBe(0);
    });

    it('calculates YTD values when missing', () => {
        const row = makeRawPaystubRow({
            ytd_gross: undefined,
            ytd_federal_tax: undefined,
        });
        const result = processPaystubData(row);

        expect(result.ytdGross).toBeGreaterThan(0);
        expect(result.ytdFederalTax).toBeGreaterThan(0);
    });

    it('calculates total deductions correctly', () => {
        const row = makeRawPaystubRow();
        const result = processPaystubData(row);

        const expectedTotalDeductions = 660 + 279 + 186 + 43.50 + 50;
        expect(result.totalDeductions).toBe(expectedTotalDeductions);
    });

    it('formats employee address correctly', () => {
        const row = makeRawPaystubRow();
        const result = processPaystubData(row);

        expect(result.employeeAddress).toBe('123 Main St, San Francisco, CA, 94105');
    });

    it('generates masked SSN', () => {
        const row = makeRawPaystubRow();
        const result = processPaystubData(row);

        expect(result.ssn).toMatch(/^\*\*\*-\*\*-\d{4}$/);
    });

    it('handles zero gross pay', () => {
        const row = makeRawPaystubRow({ gross_pay: 0 });
        const result = processPaystubData(row);

        expect(result.grossPay).toBe(0);
    });

    it('uses pay frequency for pay type', () => {
        const row = makeRawPaystubRow({
            employees: {
                id: 'emp-1',
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@test.com',
                hire_date: '2024-01-01',
                pay_frequency: 'SALARY',
            } as any,
        });
        const result = processPaystubData(row);

        expect(result.payType).toBe('SALARY');
    });

    it('calculates regular and overtime pay correctly', () => {
        const row = makeRawPaystubRow({
            regular_hours: 80,
            overtime_hours: 10,
        });
        const result = processPaystubData(row);

        expect(result.regularPay).toBe(2400);
        expect(result.overtimePay).toBe(450);
    });

    it('handles null tax values', () => {
        const row = makeRawPaystubRow({
            federal_tax: null,
            state_tax: null,
            social_security: null,
            medicare: null,
            benefit_deductions: null,
        });
        const result = processPaystubData(row);

        expect(result.federalTax).toBe(0);
        expect(result.stateTax).toBe(0);
        expect(result.socialSecurity).toBe(0);
        expect(result.medicare).toBe(43.50);
    });
});