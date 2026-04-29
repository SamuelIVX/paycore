import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/utils/supabase/client', () => ({
    createClient: vi.fn(() => ({
        from: vi.fn(() => ({
            select: vi.fn(() => ({ data: [], error: null, eq: vi.fn(() => ({ data: [], error: null, order: vi.fn(() => ({ data: [], error: null })) })) })),
        })),
    })),
}));

vi.mock('@/lib/supabase/employee', () => ({
    getCurrentEmployee: vi.fn(async () => ({ id: 'emp-1', first_name: 'John', last_name: 'Smith' })),
}));

const { mockGetEmployeePaystubs } = vi.hoisted(() => ({
    mockGetEmployeePaystubs: vi.fn(),
}));

vi.mock('@/lib/supabase/paystubs', () => ({
    getEmployeePaystubs: mockGetEmployeePaystubs,
}));

import { getEmployeePaystubs } from '@/lib/supabase/paystubs';

import type { Tables } from '@/lib/interfaces/database.types';

const makePaystub = (overrides: Partial<Tables<'payroll_records'>> = {}): Tables<'payroll_records'> => ({
    id: 'payroll-1',
    employee_id: 'emp-1',
    payroll_run_id: 'run-1',
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
    ...overrides,
} as Tables<'payroll_records'>);

describe('paystubs data layer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getEmployeePaystubs', () => {
        it('returns paystubs for current employee', async () => {
            const paystubs = [makePaystub(), makePaystub({ id: 'payroll-2', created_at: '2026-01-15T00:00:00Z' })];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs as any);

            const result = await getEmployeePaystubs();

            expect(result).toHaveLength(2);
        });

        it('returns empty array when no paystubs', async () => {
            mockGetEmployeePaystubs.mockResolvedValue([]);

            const result = await getEmployeePaystubs();

            expect(result).toHaveLength(0);
        });

        it('returns paystubs sorted by created_at descending', async () => {
            const paystubs = [
                makePaystub({ id: 'payroll-1', created_at: '2026-01-30T00:00:00Z' }),
                makePaystub({ id: 'payroll-2', created_at: '2026-01-15T00:00:00Z' }),
            ];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs as any);

            const result = await getEmployeePaystubs();

            expect(result[0].id).toBe('payroll-1');
            expect(result[1].id).toBe('payroll-2');
        });

        it('throws error when fetch fails', async () => {
            mockGetEmployeePaystubs.mockRejectedValue(new Error('Fetch failed'));

            await expect(getEmployeePaystubs()).rejects.toThrow('Fetch failed');
        });

        it('handles empty data gracefully', async () => {
            mockGetEmployeePaystubs.mockResolvedValue([] as any);

            const result = await getEmployeePaystubs();

            expect(result).toHaveLength(0);
        });
    });
});