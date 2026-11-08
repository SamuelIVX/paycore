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

import {
    runPayroll,
    insertPayrollRun,
    getActiveEmployees,
    getTimeEntriesForPayPeriod,
    insertPayrollRecords,
    updatePayrollRun,
} from '@/lib/supabase/payroll-actions';
import type { Tables, TablesInsert } from '@/lib/interfaces/database.types';

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

const setupFromCalls = (handler: (callCount: number) => unknown) => {
    let callCount = 0;
    mockFrom.mockImplementation((table: string) => {
        if (table === 'profiles') {
            return {
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        maybeSingle: vi.fn().mockResolvedValue({ data: { role: 'MANAGER' }, error: null }),
                    }),
                }),
            };
        }
        callCount++;
        return handler(callCount) as ReturnType<typeof mockFrom>;
    });
};
describe('runPayroll', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    });

    it('throws if user is not authenticated', async () => {
        mockAuth.getUser.mockResolvedValue({ data: { user: null } });
        await expect(runPayroll('2026-01-15', '2026-01-28')).rejects.toThrow('User must be authenticated');
    });

    it('throws if user is not a manager', async () => {
        mockFrom.mockImplementation((table: string) => {
            if (table === 'profiles') {
                return {
                    select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockReturnValue({
                            maybeSingle: vi.fn().mockResolvedValue({ data: { role: 'EMPLOYEE' }, error: null }),
                        }),
                    }),
                };
            }
        });
        await expect(runPayroll('2026-01-15', '2026-01-28')).rejects.toThrow('Unauthorized: Only managers');
    });

    it('throws if profile lookup fails', async () => {
        mockFrom.mockImplementation((table: string) => {
            if (table === 'profiles') {
                return {
                    select: vi.fn().mockReturnValue({
                        eq: vi.fn().mockReturnValue({
                            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
                        }),
                    }),
                };
            }
        });
        await expect(runPayroll('2026-01-15', '2026-01-28')).rejects.toThrow('Unauthorized: Only managers');
    });

    it('throws on invalid dates', async () => {
        await expect(runPayroll('not-a-date', '2026-01-28')).rejects.toThrow('Invalid pay period dates');
    });

    it('throws when start date is after end date', async () => {
        await expect(runPayroll('2026-01-28', '2026-01-15')).rejects.toThrow('start date must be before');
    });

    it('throws if payroll for this period already exists', async () => {
        setupFromCalls((callCount) => {
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
        const mockReconcileUpdate = vi.fn().mockReturnThis();
        const mockReconcileEq = vi.fn().mockReturnThis();
        const mockReconcileLt = vi.fn().mockResolvedValue({ error: null });

        setupFromCalls((callCount) => {
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
        setupFromCalls((callCount) => {
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

        setupFromCalls((callCount) => {
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

        setupFromCalls((callCount) => {
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

describe('payroll-actions helpers', () => {
    it('insertPayrollRun inserts and returns a processing run', async () => {
        const mockSingle = vi.fn().mockResolvedValue({ data: { id: 'run-99', status: 'PROCESSING' }, error: null });
        const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
        const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
        const mockClient = {
            from: vi.fn().mockReturnValue({ insert: mockInsert }),
        } as unknown as Parameters<typeof insertPayrollRun>[0];

        const res = await insertPayrollRun(mockClient, '2026-02-01', '2026-02-14', 'admin-1');

        expect(mockClient.from).toHaveBeenCalledWith('payroll_runs');
        expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
            pay_period_start: '2026-02-01',
            pay_period_end: '2026-02-14',
            run_by: 'admin-1',
            status: 'PROCESSING',
        }));
        expect(res).toEqual({ id: 'run-99', status: 'PROCESSING' });
    });

    it('insertPayrollRun throws on db error', async () => {
        const mockSingle = vi.fn().mockResolvedValue({ data: null, error: new Error('Insert failed') });
        const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
        const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
        const mockClient = {
            from: vi.fn().mockReturnValue({ insert: mockInsert }),
        } as unknown as Parameters<typeof insertPayrollRun>[0];

        await expect(insertPayrollRun(mockClient, '2026-02-01', '2026-02-14', 'admin-1'))
            .rejects.toThrow('Insert failed');
    });

    it('getActiveEmployees queries ACTIVE employees', async () => {
        const mockEq = vi.fn().mockResolvedValue({ data: [{ id: 'emp-1' }], error: null });
        const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
        const mockClient = {
            from: vi.fn().mockReturnValue({ select: mockSelect }),
        } as unknown as Parameters<typeof getActiveEmployees>[0];

        const res = await getActiveEmployees(mockClient);

        expect(mockClient.from).toHaveBeenCalledWith('employees');
        expect(mockSelect).toHaveBeenCalledWith('*');
        expect(mockEq).toHaveBeenCalledWith('employment_status', 'ACTIVE');
        expect(res).toEqual([{ id: 'emp-1' }]);
    });

    it('getActiveEmployees throws on db error', async () => {
        const mockEq = vi.fn().mockResolvedValue({ data: null, error: new Error('Load failed') });
        const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
        const mockClient = {
            from: vi.fn().mockReturnValue({ select: mockSelect }),
        } as unknown as Parameters<typeof getActiveEmployees>[0];

        await expect(getActiveEmployees(mockClient)).rejects.toThrow('Load failed');
    });

    it('getTimeEntriesForPayPeriod queries APPROVED time entries in date range', async () => {
        const mockEq = vi.fn().mockResolvedValue({ data: [{ id: 'te-1' }], error: null });
        const mockLte = vi.fn().mockReturnValue({ eq: mockEq });
        const mockGte = vi.fn().mockReturnValue({ lte: mockLte });
        const mockSelect = vi.fn().mockReturnValue({ gte: mockGte });
        const mockClient = {
            from: vi.fn().mockReturnValue({ select: mockSelect }),
        } as unknown as Parameters<typeof getTimeEntriesForPayPeriod>[0];

        const res = await getTimeEntriesForPayPeriod(mockClient, '2026-02-01', '2026-02-14');

        expect(mockClient.from).toHaveBeenCalledWith('time_entries');
        expect(mockSelect).toHaveBeenCalledWith('*');
        expect(mockGte).toHaveBeenCalledWith('work_date', '2026-02-01');
        expect(mockLte).toHaveBeenCalledWith('work_date', '2026-02-14');
        expect(mockEq).toHaveBeenCalledWith('status', 'APPROVED');
        expect(res).toEqual([{ id: 'te-1' }]);
    });

    it('getTimeEntriesForPayPeriod throws on db error', async () => {
        const mockEq = vi.fn().mockResolvedValue({ data: null, error: new Error('Time entries error') });
        const mockLte = vi.fn().mockReturnValue({ eq: mockEq });
        const mockGte = vi.fn().mockReturnValue({ lte: mockLte });
        const mockSelect = vi.fn().mockReturnValue({ gte: mockGte });
        const mockClient = {
            from: vi.fn().mockReturnValue({ select: mockSelect }),
        } as unknown as Parameters<typeof getTimeEntriesForPayPeriod>[0];

        await expect(getTimeEntriesForPayPeriod(mockClient, '2026-02-01', '2026-02-14'))
            .rejects.toThrow('Time entries error');
    });

    it('insertPayrollRecords filters nulls and inserts valid records', async () => {
        const mockInsert = vi.fn().mockResolvedValue({ error: null });
        const mockClient = {
            from: vi.fn().mockReturnValue({ insert: mockInsert }),
        } as unknown as Parameters<typeof insertPayrollRecords>[0];

        const record = { id: 'rec-1', gross_pay: 100 } as unknown as TablesInsert<'payroll_records'>;
        await insertPayrollRecords(mockClient, [record, null as unknown as TablesInsert<'payroll_records'>]);

        expect(mockClient.from).toHaveBeenCalledWith('payroll_records');
        expect(mockInsert).toHaveBeenCalledWith([record]);
    });

    it('insertPayrollRecords throws on error', async () => {
        const mockInsert = vi.fn().mockResolvedValue({ error: new Error('Record insert failed') });
        const mockClient = {
            from: vi.fn().mockReturnValue({ insert: mockInsert }),
        } as unknown as Parameters<typeof insertPayrollRecords>[0];

        await expect(insertPayrollRecords(mockClient, [{ id: 'r1' } as unknown as TablesInsert<'payroll_records'>]))
            .rejects.toThrow('Record insert failed');
    });

    it('updatePayrollRun aggregates totals, updates run, and returns rounded totals', async () => {
        const mockEq = vi.fn().mockResolvedValue({ error: null });
        const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
        const mockClient = {
            from: vi.fn().mockReturnValue({ update: mockUpdate }),
        } as unknown as Parameters<typeof updatePayrollRun>[0];

        const records = [
            {
                gross_pay: 1000.555,
                net_pay: 700.123,
                federal_tax: 150.111,
                state_tax: 50.222,
                social_security: 60.111,
                benefit_deductions: 40.00,
            },
            {
                gross_pay: 500,
                net_pay: 350,
                federal_tax: null,
                state_tax: null,
                social_security: null,
                benefit_deductions: null,
            },
        ] as unknown as TablesInsert<'payroll_records'>[];

        const run = { id: 'run-123' } as unknown as Tables<'payroll_runs'>;
        const result = await updatePayrollRun(mockClient, records, run, 'manager-1');

        expect(mockClient.from).toHaveBeenCalledWith('payroll_runs');
        expect(mockEq).toHaveBeenCalledWith('id', 'run-123');
        expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
            run_by: 'manager-1',
            status: 'COMPLETED',
            total_gross: 1500.56,
            total_net: 1050.12,
            total_taxes: 260.44,
            total_benefit_deductions: 40,
        }));
        expect(result).toEqual({
            total_gross_pay: 1500.56,
            total_net_pay: 1050.12,
            total_taxes: 260.44,
        });
    });

    it('updatePayrollRun throws on db update failure', async () => {
        const mockEq = vi.fn().mockResolvedValue({ error: new Error('Update failed') });
        const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
        const mockClient = {
            from: vi.fn().mockReturnValue({ update: mockUpdate }),
        } as unknown as Parameters<typeof updatePayrollRun>[0];

        await expect(updatePayrollRun(mockClient, [], { id: 'run-1' } as unknown as Tables<'payroll_runs'>, 'user-1'))
            .rejects.toThrow('Update failed');
    });
});
