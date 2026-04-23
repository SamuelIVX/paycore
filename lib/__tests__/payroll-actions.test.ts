import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/headers (required by server client)
vi.mock('next/headers', () => ({
    cookies: () => ({ getAll: () => [], setAll: () => { } }),
}));

// Mock the server supabase client 
const mockFrom = vi.fn();
const mockAuth = { getUser: vi.fn() };

vi.mock('@/utils/supabase/server', () => ({
    createClient: async () => ({
        auth: mockAuth,
        from: mockFrom,
    }),
}));

// Mock client supabase (pulled in transitively via lib/payroll.tsx)
vi.mock('@/utils/supabase/client', () => ({
    createClient: () => ({}),
}));

import { runPayroll } from '@/lib/supabase/payroll-actions';

// ---- helpers ----

const mockEmployee = {
    id: 'emp-1',
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane@example.com',
    role: 'engineer',
    pay_rate: 30,
    pay_frequency: 'HOURLY',
    federal_tax_rate: 0.22,
    state_tax_rate: 0.093,
    social_security_tax_rate: 0.062,
    employment_status: 'ACTIVE',
    created_at: null,
};

const mockPayrollRun = {
    id: 'run-1',
    pay_period_start: '2026-01-15',
    pay_period_end: '2026-01-28',
    run_date: new Date().toISOString(),
    run_by: 'user-1',
    status: 'PROCESSING',
    total_gross: null,
    total_net: null,
    total_taxes: null,
};

const mockTimeEntry = {
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
};

// ---- tests ----

describe('runPayroll', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    });

    it('throws if user is not authenticated', async () => {
        mockAuth.getUser.mockResolvedValue({ data: { user: null } });
        await expect(runPayroll('2026-01-15', '2026-01-28')).rejects.toThrow('User must be authenticated');
    });

    it('throws on invalid dates', async () => {
        await expect(runPayroll('not-a-date', '2026-01-28')).rejects.toThrow('Invalid pay period dates');
    });

    it('throws when start date is after end date', async () => {
        await expect(runPayroll('2026-01-28', '2026-01-15')).rejects.toThrow('start date must be before');
    });

    it('throws if payroll for this period already exists', async () => {
        mockFrom.mockReturnValue({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
                data: { id: 'run-existing', status: 'COMPLETED' },
                error: null,
            }),
        });

        await expect(runPayroll('2026-01-15', '2026-01-28')).rejects.toThrow('already been completed');
    });

    it('returns totals on a successful payroll run', async () => {
        let callCount = 0;
        mockFrom.mockImplementation(() => {
            callCount++;

            // 1st call: idempotency check — no existing run
            if (callCount === 1) return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                in: vi.fn().mockReturnThis(),
                maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            };
            // 2nd call: insertPayrollRun
            if (callCount === 2) return {
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: mockPayrollRun, error: null }),
            };
            // 3rd call: getActiveEmployees
            if (callCount === 3) return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ data: [mockEmployee], error: null }),
            };
            // 4th call: getTimeEntriesForPayPeriod
            if (callCount === 4) return {
                select: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ data: [mockTimeEntry], error: null }),
            };
            // 5th call: getActiveOptionalEmployeeBenefits (per employee in Promise.all)
            if (callCount === 5) {
                // Create chaining eq that returns itself but also resolves
                const firstEq = vi.fn().mockReturnValue({
                    eq: vi.fn().mockResolvedValue({ data: [], error: null }),
                });
                return {
                    select: vi.fn().mockReturnValue({
                        eq: firstEq,
                    }),
                };
            }
            // 6th call: insertPayrollRecords
            if (callCount === 6) return {
                insert: vi.fn().mockResolvedValue({ data: null, error: null }),
            };
            // 7th call: updatePayrollRun
            if (callCount === 7) return {
                update: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ data: null, error: null }),
            };
            // 8th call: mark FAILED on catch (safety net)
            if (callCount === 8) return {
                update: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ data: null, error: null }),
            };
        });

        const result = await runPayroll('2026-01-15', '2026-01-28');

        expect(result.total_gross).toBeDefined();
        expect(result.total_net).toBeDefined();
        expect(result.total_taxes).toBeDefined();
        // 8 hours * $30/hr = $240 gross
        expect(Number(result.total_gross)).toBeCloseTo(240);
    });

    it('marks the payroll run as FAILED when an error occurs mid-run', async () => {
        const mockUpdate = vi.fn().mockReturnThis();
        const mockEq = vi.fn().mockResolvedValue({ data: null, error: null });
        let callCount = 0;

        mockFrom.mockImplementation(() => {
            callCount++;
            if (callCount === 1) return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                in: vi.fn().mockReturnThis(),
                maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            };
            if (callCount === 2) return {
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: mockPayrollRun, error: null }),
            };
            // getActiveEmployees throws
            if (callCount === 3) return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
            };
            // FAILED update
            if (callCount === 4) return { update: mockUpdate, eq: mockEq };
        });

        await expect(runPayroll('2026-01-15', '2026-01-28')).rejects.toThrow();
        expect(mockUpdate).toHaveBeenCalledWith({ status: 'FAILED' });
    });
});
