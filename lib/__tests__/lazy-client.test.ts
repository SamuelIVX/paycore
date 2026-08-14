import { describe, it, expect, vi } from 'vitest';

const { mockCreateClient } = vi.hoisted(() => ({
    mockCreateClient: vi.fn(() => ({
        from: () => ({
            select: () => ({
                eq: () => ({ data: [], error: null }),
            }),
        }),
    })),
}));

vi.mock('@/utils/supabase/client', () => ({
    createClient: mockCreateClient,
}));

import { calculatePayRollForEmployee } from '@/lib/supabase/payroll';
import { getTotalAnnualPayroll } from '@/lib/supabase/employee';
import { getPayrollRuns } from '@/lib/supabase/payroll';
import { Tables } from '@/lib/interfaces/database.types';

describe('lazy supabase clients', () => {
    it('does not call createClient() at module import time', () => {
        // The data modules used to call createClient() at module scope.
        // Importing them must not create a client (and must not throw when
        // env vars are missing) until a data function is actually invoked.
        expect(mockCreateClient).not.toHaveBeenCalled();
    });

    it('creates the client lazily only when a data function is used', async () => {
        const employee = {
            id: 'emp-1',
            pay_rate: 100000,
            pay_frequency: 'SALARY',
            federal_tax_rate: 0,
            state_tax_rate: 0,
            social_security_tax_rate: 0,
        } as Tables<'employees'>;

        // Pure calculation path should not need a client either.
        const result = calculatePayRollForEmployee(employee, [], {
            id: 'run-1',
            status: 'PROCESSING',
        } as Tables<'payroll_runs'>);

        expect(result.gross_pay).toBeGreaterThan(0);

        // A data function triggers first-time client creation per module.
        await getTotalAnnualPayroll();
        await getPayrollRuns();
        await getTotalAnnualPayroll();
        expect(mockCreateClient).toHaveBeenCalledTimes(2);
    });
});