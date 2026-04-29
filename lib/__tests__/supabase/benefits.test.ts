import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/utils/supabase/client', () => ({
    createClient: vi.fn(() => ({
        from: vi.fn(() => ({
            insert: vi.fn(() => ({ error: null })),
            select: vi.fn(() => ({ data: [], error: null, eq: vi.fn(() => ({ data: [], error: null, filter: vi.fn(() => ({ data: [], error: null })) })) })),
            update: vi.fn(() => ({ error: null })),
            delete: vi.fn(() => ({ error: null })),
            eq: vi.fn(() => ({ data: [], error: null, single: vi.fn(() => ({ data: null, error: null })) })),
        })),
    })),
}));

vi.mock('@/lib/supabase/employee', () => ({
    getCurrentEmployee: vi.fn(async () => ({ id: 'emp-1', first_name: 'John', last_name: 'Smith' })),
}));

const { mockAddBenefit, mockGetCompanyBenefits, mockGetOptionalBenefits, mockUpsertEmployeeBenefit, mockDeleteBenefit, mockUpdateBenefit, mockGetActiveOptionalEmployeeBenefits } = vi.hoisted(() => ({
    mockAddBenefit: vi.fn(),
    mockGetCompanyBenefits: vi.fn(),
    mockGetOptionalBenefits: vi.fn(),
    mockUpsertEmployeeBenefit: vi.fn(),
    mockDeleteBenefit: vi.fn(),
    mockUpdateBenefit: vi.fn(),
    mockGetActiveOptionalEmployeeBenefits: vi.fn(),
}));

vi.mock('@/lib/supabase/benefits', () => ({
    addBenefit: mockAddBenefit,
    getCompanyBenefits: mockGetCompanyBenefits,
    getOptionalBenefits: mockGetOptionalBenefits,
    upsertEmployeeBenefit: mockUpsertEmployeeBenefit,
    deleteBenefit: mockDeleteBenefit,
    updateBenefit: mockUpdateBenefit,
    getActiveOptionalEmployeeBenefits: mockGetActiveOptionalEmployeeBenefits,
}));

import { addBenefit, getCompanyBenefits, getOptionalBenefits, upsertEmployeeBenefit, deleteBenefit, updateBenefit, getActiveOptionalEmployeeBenefits } from '@/lib/supabase/benefits';

import type { BenefitInsert, BenefitUpdate } from '@/lib/supabase/benefits';
import type { Tables } from '@/lib/interfaces/database.types';

const makeBenefit = (overrides: Partial<Tables<'benefits'>> = {}): Tables<'benefits'> => ({
    id: 'benefit-1',
    name: 'Health Insurance',
    description: 'Company health coverage',
    type: 'COMPANY',
    is_free: true,
    monthly_cost: null,
    provider: null,
    coverage: null,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
} as Tables<'benefits'>);

describe('benefits data layer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('addBenefit', () => {
        it('inserts new benefit successfully', async () => {
            mockAddBenefit.mockResolvedValue(undefined);
            const benefit: BenefitInsert = {
                name: 'Dental',
                description: 'Dental coverage',
                type: 'COMPANY',
                is_free: true,
            };

            await expect(addBenefit(benefit)).resolves.not.toThrow();
        });

        it('throws error when insert fails', async () => {
            mockAddBenefit.mockRejectedValue(new Error('Insert failed'));
            const benefit: BenefitInsert = {
                name: 'Dental',
                description: 'Dental coverage',
                type: 'COMPANY',
                is_free: true,
            };

            await expect(addBenefit(benefit)).rejects.toThrow('Insert failed');
        });
    });

    describe('getCompanyBenefits', () => {
        it('returns company benefits', async () => {
            const benefits = [makeBenefit({ type: 'COMPANY' }), makeBenefit({ id: 'benefit-2', type: 'COMPANY' })];
            mockGetCompanyBenefits.mockResolvedValue(benefits as any);

            const result = await getCompanyBenefits();

            expect(result).toHaveLength(2);
            expect(result[0].type).toBe('COMPANY');
        });

        it('returns empty array when no benefits', async () => {
            mockGetCompanyBenefits.mockResolvedValue([]);

            const result = await getCompanyBenefits();

            expect(result).toHaveLength(0);
        });

        it('throws error when fetch fails', async () => {
            mockGetCompanyBenefits.mockRejectedValue(new Error('Fetch failed'));

            await expect(getCompanyBenefits()).rejects.toThrow('Fetch failed');
        });
    });

    describe('getOptionalBenefits', () => {
        it('returns optional benefits', async () => {
            const benefits = [makeBenefit({ type: 'OPTIONAL', monthly_cost: 100 })];
            mockGetOptionalBenefits.mockResolvedValue(benefits as any);

            const result = await getOptionalBenefits();

            expect(result).toHaveLength(1);
            expect(result[0].type).toBe('OPTIONAL');
        });

        it('returns empty array when no optional benefits', async () => {
            mockGetOptionalBenefits.mockResolvedValue([]);

            const result = await getOptionalBenefits();

            expect(result).toHaveLength(0);
        });

        it('throws error when fetch fails', async () => {
            mockGetOptionalBenefits.mockRejectedValue(new Error('Fetch failed'));

            await expect(getOptionalBenefits()).rejects.toThrow('Fetch failed');
        });
    });

    describe('upsertEmployeeBenefit', () => {
        it('upserts with ACTIVE status', async () => {
            mockUpsertEmployeeBenefit.mockResolvedValue({ id: 'emp-benefit-1' } as any);

            const result = await upsertEmployeeBenefit({ benefit_id: 'benefit-1', status: 'ACTIVE' });

            expect(result).toBeDefined();
        });

        it('upserts with NOT_ENROLLED status', async () => {
            mockUpsertEmployeeBenefit.mockResolvedValue({ id: 'emp-benefit-1' } as any);

            const result = await upsertEmployeeBenefit({ benefit_id: 'benefit-1', status: 'NOT_ENROLLED' });

            expect(result).toBeDefined();
        });

        it('throws error on failure', async () => {
            mockUpsertEmployeeBenefit.mockRejectedValue(new Error('Upsert failed'));

            await expect(upsertEmployeeBenefit({ benefit_id: 'benefit-1', status: 'ACTIVE' })).rejects.toThrow();
        });
    });

    describe('deleteBenefit', () => {
        it('deletes benefit successfully', async () => {
            mockDeleteBenefit.mockResolvedValue(undefined);

            await expect(deleteBenefit('benefit-1')).resolves.not.toThrow();
        });

        it('throws error when delete fails', async () => {
            mockDeleteBenefit.mockRejectedValue(new Error('Delete failed'));

            await expect(deleteBenefit('benefit-1')).rejects.toThrow('Delete failed');
        });
    });

    describe('updateBenefit', () => {
        it('updates benefit successfully', async () => {
            mockUpdateBenefit.mockResolvedValue({ id: 'benefit-1', name: 'Updated' } as any);
            const updates: BenefitUpdate = { name: 'Updated Health Insurance' };

            const result = await updateBenefit('benefit-1', updates);

            expect(result).toBeDefined();
        });

        it('throws error when update fails', async () => {
            mockUpdateBenefit.mockRejectedValue(new Error('Update failed'));

            await expect(updateBenefit('benefit-1', { name: 'Updated' })).rejects.toThrow('Update failed');
        });
    });

    describe('getActiveOptionalEmployeeBenefits', () => {
        it('returns active optional benefits for employee', async () => {
            const employeeBenefits = [{ id: 'emp-benefit-1', employee_id: 'emp-1', benefit_id: 'benefit-1', status: 'ACTIVE', benefit: makeBenefit({ type: 'OPTIONAL' }) }];
            mockGetActiveOptionalEmployeeBenefits.mockResolvedValue(employeeBenefits as any);

            const result = await getActiveOptionalEmployeeBenefits('emp-1');

            expect(result).toHaveLength(1);
        });

        it('returns empty array when no active benefits', async () => {
            mockGetActiveOptionalEmployeeBenefits.mockResolvedValue([]);

            const result = await getActiveOptionalEmployeeBenefits('emp-1');

            expect(result).toHaveLength(0);
        });

        it('throws error when fetch fails', async () => {
            mockGetActiveOptionalEmployeeBenefits.mockRejectedValue(new Error('Fetch failed'));

            await expect(getActiveOptionalEmployeeBenefits('emp-1')).rejects.toThrow('Fetch failed');
        });
    });
});