import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/headers', () => ({
    cookies: () => ({ getAll: () => [], setAll: () => { } }),
}));

const mockFrom = vi.fn();
const mockAuth = { getUser: vi.fn() };

vi.mock('@/utils/supabase/server', () => ({
    createClient: async () => ({
        auth: mockAuth,
        from: mockFrom,
    }),
}));

vi.mock('@/utils/supabase/client', () => ({
    createClient: () => ({}),
}));

import { runPayroll } from '@/lib/supabase/payroll-actions';

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
    state: 'NY',
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

const mockTimeEntries = [
    { id: 'entry-1', employee_id: 'emp-1', hours_worked: 8, work_date: '2026-01-15', status: 'APPROVED', clock_in: null, clock_out: null, approved_at: null, approved_by: null, created_at: null },
    { id: 'entry-2', employee_id: 'emp-1', hours_worked: 8, work_date: '2026-01-16', status: 'APPROVED', clock_in: null, clock_out: null, approved_at: null, approved_by: null, created_at: null },
    { id: 'entry-3', employee_id: 'emp-1', hours_worked: 8, work_date: '2026-01-17', status: 'APPROVED', clock_in: null, clock_out: null, approved_at: null, approved_by: null, created_at: null },
    { id: 'entry-4', employee_id: 'emp-1', hours_worked: 8, work_date: '2026-01-18', status: 'APPROVED', clock_in: null, clock_out: null, approved_at: null, approved_by: null, created_at: null },
];

function chainable(terminal: any) {
    const fn = vi.fn().mockReturnThis();
    Object.assign(fn, { terminal });
    return fn;
}

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
        let callCount = 0;
        mockFrom.mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                return {
                    update: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    lt: vi.fn().mockResolvedValue({ error: null }),
                };
            }
            if (callCount === 2) {
                return {
                    select: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    gte: vi.fn().mockReturnThis(),
                    order: vi.fn().mockReturnThis(),
                    limit: vi.fn().mockReturnThis(),
                    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                };
            }
            return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                in: vi.fn().mockReturnThis(),
                maybeSingle: vi.fn().mockResolvedValue({
                    data: { id: 'run-existing', status: 'COMPLETED' },
                    error: null,
                }),
            };
        });

        await expect(runPayroll('2026-01-15', '2026-01-28')).rejects.toThrow('already been completed');
    });

    it('reconciles stale PROCESSING runs older than 30 minutes to FAILED (F-005)', async () => {
        let callCount = 0;
        const mockReconcileUpdate = vi.fn().mockReturnThis();
        const mockReconcileEq = vi.fn().mockReturnThis();
        const mockReconcileLt = vi.fn().mockResolvedValue({ error: null });

        mockFrom.mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                return { update: mockReconcileUpdate, eq: mockReconcileEq, lt: mockReconcileLt };
            }
            if (callCount === 2) {
                return {
                    select: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    gte: vi.fn().mockReturnThis(),
                    order: vi.fn().mockReturnThis(),
                    limit: vi.fn().mockReturnThis(),
                    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                };
            }
            return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                in: vi.fn().mockReturnThis(),
                maybeSingle: vi.fn().mockResolvedValue({
                    data: { id: 'run-existing', status: 'COMPLETED' },
                    error: null,
                }),
            };
        });

        await expect(runPayroll('2026-01-15', '2026-01-28')).rejects.toThrow('already been completed');

        expect(mockReconcileUpdate).toHaveBeenCalledWith({ status: 'FAILED' });
        expect(mockReconcileEq).toHaveBeenCalledWith('status', 'PROCESSING');
        expect(mockReconcileLt).toHaveBeenCalledWith('run_date', expect.any(String));
    });

    it('rejects a second run within 5 minutes for the same user (F-006)', async () => {
        let callCount = 0;

        mockFrom.mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                return {
                    update: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    lt: vi.fn().mockResolvedValue({ error: null }),
                };
            }
            return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'recent-run', run_date: new Date().toISOString() }, error: null }),
            };
        });

        await expect(runPayroll('2026-01-15', '2026-01-28')).rejects.toThrow('only be run once every 5 minutes');
    });

    it('returns totals on a successful payroll run', async () => {
        let callCount = 0;
        const mockOptionalBenefit = {
            id: 'employee-benefit-1',
            employee_id: 'emp-1',
            benefit_id: 'benefit-1',
            status: 'ACTIVE',
            benefit: {
                id: 'benefit-1',
                type: 'OPTIONAL',
                monthly_cost: 25,
            },
        };
        const mockInsertPayrollRecords = vi.fn().mockResolvedValue({ data: null, error: null });

        mockFrom.mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                return {
                    update: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    lt: vi.fn().mockResolvedValue({ error: null }),
                };
            }
            if (callCount === 2) {
                return {
                    select: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    gte: vi.fn().mockReturnThis(),
                    order: vi.fn().mockReturnThis(),
                    limit: vi.fn().mockReturnThis(),
                    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                };
            }
            if (callCount === 3) return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                in: vi.fn().mockReturnThis(),
                maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            };
            if (callCount === 4) return {
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: mockPayrollRun, error: null }),
            };
            if (callCount === 5) return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ data: [mockEmployee], error: null }),
            };
            if (callCount === 6) return {
                select: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ data: mockTimeEntries, error: null }),
            };
            if (callCount === 7) {
                const firstEq = vi.fn().mockReturnValue({
                    eq: vi.fn().mockResolvedValue({ data: [mockOptionalBenefit], error: null }),
                });
                return {
                    select: vi.fn().mockReturnValue({
                        eq: firstEq,
                    }),
                };
            }
            if (callCount === 8) return {
                insert: mockInsertPayrollRecords,
            };
            if (callCount === 9) return {
                update: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ data: null, error: null }),
            };
        });

        const result = await runPayroll('2026-01-15', '2026-01-28');

        expect(result.total_gross).toBeDefined();
        expect(result.total_net).toBeDefined();
        expect(result.total_taxes).toBeDefined();
        expect(Number(result.total_gross)).toBeCloseTo(960);
        expect(mockInsertPayrollRecords).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ benefit_deductions: 11.54 }),
            ]),
        );
    });

    it('marks the payroll run as FAILED when an error occurs mid-run', async () => {
        const mockUpdate = vi.fn().mockReturnThis();
        const mockEq = vi.fn().mockResolvedValue({ data: null, error: null });
        let callCount = 0;

        mockFrom.mockImplementation(() => {
            callCount++;
            if (callCount === 1) {
                return {
                    update: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    lt: vi.fn().mockResolvedValue({ error: null }),
                };
            }
            if (callCount === 2) {
                return {
                    select: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    gte: vi.fn().mockReturnThis(),
                    order: vi.fn().mockReturnThis(),
                    limit: vi.fn().mockReturnThis(),
                    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                };
            }
            if (callCount === 3) {
                return {
                    select: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    in: vi.fn().mockReturnThis(),
                    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                };
            }
            if (callCount === 4) {
                return {
                    insert: vi.fn().mockReturnThis(),
                    select: vi.fn().mockReturnThis(),
                    single: vi.fn().mockResolvedValue({ data: mockPayrollRun, error: null }),
                };
            }
            if (callCount === 5) {
                return {
                    select: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
                };
            }
            if (callCount === 6) {
                return { update: mockUpdate, eq: mockEq };
            }
        });

        await expect(runPayroll('2026-01-15', '2026-01-28')).rejects.toThrow();
        expect(mockUpdate).toHaveBeenCalledWith({ status: 'FAILED' });
    });
});
