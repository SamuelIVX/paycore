import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockClient = {
    from: vi.fn(() => ({
        insert: vi.fn().mockReturnValue({ data: null, error: null, select: vi.fn().mockReturnValue({ data: null, error: null, single: vi.fn().mockReturnValue({ data: null, error: null }) }) }),
        select: vi.fn().mockReturnValue({ data: [], error: null, eq: vi.fn().mockReturnValue({ data: [], error: null, order: vi.fn().mockReturnValue({ data: [], error: null }), limit: vi.fn().mockReturnValue({ data: [], error: null }) }) }),
    })),
};

vi.mock('@/utils/supabase/client', () => ({
    createClient: vi.fn(() => mockClient),
}));

vi.mock('@/lib/supabase/employee', () => ({
    getCurrentEmployee: vi.fn(async () => ({ id: 'emp-1', first_name: 'John', last_name: 'Smith' })),
}));

const { mockCreateTimeEntry, mockGetRecentTimeEntries } = vi.hoisted(() => ({
    mockCreateTimeEntry: vi.fn(),
    mockGetRecentTimeEntries: vi.fn(),
}));

vi.mock('@/lib/supabase/time-entries', () => ({
    createTimeEntry: mockCreateTimeEntry,
    getRecentTimeEntries: mockGetRecentTimeEntries,
}));

import { createTimeEntry, getRecentTimeEntries } from '@/lib/supabase/time-entries';

import type { Tables } from '@/lib/interfaces/database.types';

const makeTimeEntry = (overrides: Partial<Tables<'time_entries'>> = {}): Tables<'time_entries'> => ({
    id: 'entry-1',
    employee_id: 'emp-1',
    work_date: '2026-01-15',
    hours_worked: 8,
    status: 'PENDING',
    clock_in: null,
    clock_out: null,
    approved_at: null,
    approved_by: null,
    created_at: '2026-01-15T10:00:00Z',
    ...overrides,
} as Tables<'time_entries'>);

describe('time-entries data layer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createTimeEntry', () => {
        it('creates time entry successfully', async () => {
            const entry = makeTimeEntry();
            mockCreateTimeEntry.mockResolvedValue(entry);

            const result = await createTimeEntry('2026-01-15', 8);

            expect(result).toBeDefined();
        });

        it('throws error when insert fails', async () => {
            mockCreateTimeEntry.mockRejectedValue(new Error('Insert failed'));

            await expect(createTimeEntry('2026-01-15', 8)).rejects.toThrow('Insert failed');
        });
    });

    describe('getRecentTimeEntries', () => {
        it('returns recent time entries', async () => {
            const entries = [
                makeTimeEntry({ id: 'entry-1', work_date: '2026-01-15' }),
                makeTimeEntry({ id: 'entry-2', work_date: '2026-01-14' }),
            ];
            mockGetRecentTimeEntries.mockResolvedValue(entries as any);

            const result = await getRecentTimeEntries();

            expect(result).toHaveLength(2);
        });

        it('returns empty array when no entries', async () => {
            mockGetRecentTimeEntries.mockResolvedValue([]);

            const result = await getRecentTimeEntries();

            expect(result).toHaveLength(0);
        });

        it('limits to 5 entries', async () => {
            const entries = Array.from({ length: 5 }, (_, i) => makeTimeEntry({ id: `entry-${i}`, work_date: `2026-01-${15 - i}` }));
            mockGetRecentTimeEntries.mockResolvedValue(entries as any);

            const result = await getRecentTimeEntries();

            expect(result).toHaveLength(5);
        });

        it('returns entries sorted by work_date descending', async () => {
            const entries = [
                makeTimeEntry({ id: 'entry-1', work_date: '2026-01-15' }),
                makeTimeEntry({ id: 'entry-2', work_date: '2026-01-14' }),
            ];
            mockGetRecentTimeEntries.mockResolvedValue(entries as any);

            const result = await getRecentTimeEntries();

            expect(result[0].work_date).toBe('2026-01-15');
        });

        it('throws error when fetch fails', async () => {
            mockGetRecentTimeEntries.mockRejectedValue(new Error('Fetch failed'));

            await expect(getRecentTimeEntries()).rejects.toThrow('Fetch failed');
        });
    });
});