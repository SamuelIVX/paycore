import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/utils/supabase/client', () => ({
    createClient: vi.fn(() => ({
        from: vi.fn(() => ({
            insert: vi.fn(() => ({ error: null })),
            select: vi.fn(() => ({ data: [], error: null, eq: vi.fn(() => ({ data: [], error: null, single: vi.fn(() => ({ data: null, error: null })) })) })),
            update: vi.fn(() => ({ error: null })),
            delete: vi.fn(() => ({ error: null })),
            eq: vi.fn(() => ({ data: [], error: null, gte: vi.fn(() => ({ data: [], error: null })), order: vi.fn(() => ({ data: [], error: null })) })),
        })),
    })),
}));

const { mockAddEmployee, mockGetEmployees, mockUpdateEmployee, mockDeleteEmployee, mockGetCurrentEmployee, mockGetActiveEmployeesCount, mockGetTotalAnnualPayroll } = vi.hoisted(() => ({
    mockAddEmployee: vi.fn(),
    mockGetEmployees: vi.fn(),
    mockUpdateEmployee: vi.fn(),
    mockDeleteEmployee: vi.fn(),
    mockGetCurrentEmployee: vi.fn(),
    mockGetActiveEmployeesCount: vi.fn(),
    mockGetTotalAnnualPayroll: vi.fn(),
}));

vi.mock('@/lib/supabase/employee', () => ({
    addEmployee: mockAddEmployee,
    getEmployees: mockGetEmployees,
    updateEmployee: mockUpdateEmployee,
    deleteEmployee: mockDeleteEmployee,
    getCurrentEmployee: mockGetCurrentEmployee,
    getActiveEmployeesCount: mockGetActiveEmployeesCount,
    getTotalAnnualPayroll: mockGetTotalAnnualPayroll,
}));

import { addEmployee, getEmployees, updateEmployee, deleteEmployee, getCurrentEmployee, getActiveEmployeesCount, getTotalAnnualPayroll } from '@/lib/supabase/employee';

import type { Tables } from '@/lib/interfaces/database.types';

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
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
} as Tables<'employees'>);

describe('employee data layer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('addEmployee', () => {
        it('inserts new employee successfully', async () => {
            mockAddEmployee.mockResolvedValue({ id: 'emp-1' });
            
            const result = await addEmployee({
                first_name: 'John',
                last_name: 'Smith',
                role: 'Engineer',
                pay_rate: 30,
                pay_frequency: 'HOURLY',
                federal_tax_rate: 0.22,
                state_tax_rate: 0.093,
                social_security_tax_rate: 0.062,
                employment_status: 'ACTIVE',
            });

            expect(result).toBeDefined();
        });

        it('throws error when insert fails', async () => {
            mockAddEmployee.mockRejectedValue(new Error('Insert failed'));

            await expect(addEmployee({
                first_name: 'John',
                last_name: 'Smith',
                role: 'Engineer',
                pay_rate: 30,
                pay_frequency: 'HOURLY',
                federal_tax_rate: 0.22,
                state_tax_rate: 0.093,
                social_security_tax_rate: 0.062,
                employment_status: 'ACTIVE',
            })).rejects.toThrow('Insert failed');
        });
    });

    describe('getEmployees', () => {
        it('returns all employees', async () => {
            const employees: Tables<'employees'>[] = [makeEmployee(), makeEmployee({ id: 'emp-2', first_name: 'Jane' })];
            mockGetEmployees.mockResolvedValue(employees);

            const result = await getEmployees();

            expect(result).toHaveLength(2);
        });

        it('returns empty array when no employees', async () => {
            mockGetEmployees.mockResolvedValue([]);

            const result = await getEmployees();

            expect(result).toHaveLength(0);
        });

        it('throws error when fetch fails', async () => {
            mockGetEmployees.mockRejectedValue(new Error('Fetch failed'));

            await expect(getEmployees()).rejects.toThrow('Fetch failed');
        });
    });

    describe('updateEmployee', () => {
        it('updates employee successfully', async () => {
            mockUpdateEmployee.mockResolvedValue({ id: 'emp-1', first_name: 'Updated' });

            const result = await updateEmployee('emp-1', { first_name: 'Updated' });

            expect(result).toBeDefined();
        });

        it('throws error when update fails', async () => {
            mockUpdateEmployee.mockRejectedValue(new Error('Update failed'));

            await expect(updateEmployee('emp-1', { first_name: 'Updated' })).rejects.toThrow('Update failed');
        });
    });

    describe('deleteEmployee', () => {
        it('deletes employee successfully', async () => {
            mockDeleteEmployee.mockResolvedValue(undefined);

            await expect(deleteEmployee('emp-1')).resolves.not.toThrow();
        });

        it('throws error when delete fails', async () => {
            mockDeleteEmployee.mockRejectedValue(new Error('Delete failed'));

            await expect(deleteEmployee('emp-1')).rejects.toThrow('Delete failed');
        });
    });

    describe('getCurrentEmployee', () => {
        it('returns current employee', async () => {
            const employee = makeEmployee();
            mockGetCurrentEmployee.mockResolvedValue(employee);

            const result = await getCurrentEmployee();

            expect(result).toBeDefined();
            expect(result.id).toBe('emp-1');
        });

        it('throws error when fetch fails', async () => {
            mockGetCurrentEmployee.mockRejectedValue(new Error('Fetch failed'));

            await expect(getCurrentEmployee()).rejects.toThrow('Fetch failed');
        });
    });

    describe('getActiveEmployeesCount', () => {
        it('returns active employee count', async () => {
            mockGetActiveEmployeesCount.mockResolvedValue(5);

            const result = await getActiveEmployeesCount();

            expect(result).toBe(5);
        });

        it('returns zero when no active employees', async () => {
            mockGetActiveEmployeesCount.mockResolvedValue(0);

            const result = await getActiveEmployeesCount();

            expect(result).toBe(0);
        });
    });

    describe('getTotalAnnualPayroll', () => {
        it('returns total annual payroll', async () => {
            mockGetTotalAnnualPayroll.mockResolvedValue(150000);

            const result = await getTotalAnnualPayroll();

            expect(result).toBe(150000);
        });

        it('returns zero when no employees', async () => {
            mockGetTotalAnnualPayroll.mockResolvedValue(0);

            const result = await getTotalAnnualPayroll();

            expect(result).toBe(0);
        });
    });
});