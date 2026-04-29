import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Tables } from '@/lib/interfaces/database.types';

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn(),
    }),
}));

vi.mock('@/utils/supabase/client', () => ({
    createClient: () => ({}),
}));

vi.mock('@/utils/supabase/server', () => ({
    createClient: async () => ({
        auth: { getUser: vi.fn() },
        from: vi.fn(),
    }),
}));

const { mockGetOptionalBenefits, mockUpsertEmployeeBenefit } = vi.hoisted(() => ({
    mockGetOptionalBenefits: vi.fn(),
    mockUpsertEmployeeBenefit: vi.fn(),
}));

vi.mock('@/lib/supabase/benefits', () => ({
    getOptionalBenefits: mockGetOptionalBenefits,
    upsertEmployeeBenefit: mockUpsertEmployeeBenefit,
}));

vi.mock('../constants', () => ({
    BENEFIT_ICONS: {
        Life: 'Shield',
        Dental: 'Smile',
        Vision: 'Eye',
    },
}));

import OptionalBenefitsCard from '@/components/employee/optional-benefits-cards/OptionalBenefits';

const makeBenefit = (overrides: Partial<Tables<'benefits'>> = {}): Tables<'benefits'> => ({
    id: 'benefit-1',
    benefit: 'Life Insurance',
    tag: 'Life',
    description: 'Term life insurance coverage',
    provider: 'MetLife',
    coverage: '3x annual salary',
    monthly_cost: 25,
    type: 'OPTIONAL',
    created_at: null,
    ...overrides,
} as Tables<'benefits'>);

describe('OptionalBenefitsCard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders optional benefits card with title and description', async () => {
            mockGetOptionalBenefits.mockResolvedValue([]);

            render(
                <OptionalBenefitsCard
                    selected_benefits={{}}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('Optional Benefits')).toBeInTheDocument();
                expect(screen.getByText('Additional coverage with payroll deductions')).toBeInTheDocument();
            });
        });

        it('displays all optional benefits', async () => {
            const benefits = [
                makeBenefit({ id: 'b1', benefit: 'Life Insurance' }),
                makeBenefit({ id: 'b2', benefit: 'Dental Coverage' }),
                makeBenefit({ id: 'b3', benefit: 'Accident Coverage' }),
            ];
            mockGetOptionalBenefits.mockResolvedValue(benefits);

            render(
                <OptionalBenefitsCard
                    selected_benefits={{}}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
                expect(screen.getByText('Dental Coverage')).toBeInTheDocument();
                expect(screen.getByText('Accident Coverage')).toBeInTheDocument();
            });
        });

        it('shows benefit description', async () => {
            const benefit = makeBenefit({
                benefit: 'Life Insurance',
                description: 'Term life insurance coverage',
            });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(
                <OptionalBenefitsCard
                    selected_benefits={{}}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('Term life insurance coverage')).toBeInTheDocument();
            });
        });

        it('shows provider information', async () => {
            const benefit = makeBenefit({ provider: 'MetLife' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(
                <OptionalBenefitsCard
                    selected_benefits={{}}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                expect(screen.getByText(/Provider:/)).toBeInTheDocument();
                expect(screen.getByText('MetLife')).toBeInTheDocument();
            });
        });

        it('shows coverage information', async () => {
            const benefit = makeBenefit({ coverage: '3x annual salary' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(
                <OptionalBenefitsCard
                    selected_benefits={{}}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                expect(screen.getByText(/Coverage:/)).toBeInTheDocument();
                expect(screen.getByText('3x annual salary')).toBeInTheDocument();
            });
        });

        it('shows monthly cost', async () => {
            const benefit = makeBenefit({ monthly_cost: 25 });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(
                <OptionalBenefitsCard
                    selected_benefits={{}}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('Monthly Cost')).toBeInTheDocument();
                expect(screen.getByText('$25.00/mo')).toBeInTheDocument();
            });
        });

        it('shows loading state initially', async () => {
            mockGetOptionalBenefits.mockImplementation(() => new Promise(() => {}));

            render(
                <OptionalBenefitsCard
                    selected_benefits={{}}
                    set_selected_benefits={vi.fn()}
                />
            );

            expect(screen.getByText('Loading optional benefits...')).toBeInTheDocument();
        });

        it('displays error message when fetch fails', async () => {
            mockGetOptionalBenefits.mockRejectedValue(new Error('API Error'));

            render(
                <OptionalBenefitsCard
                    selected_benefits={{}}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                expect(screen.getByText('Failed to load benefits')).toBeInTheDocument();
            });
        });
    });

    describe('Enrolling in Benefits', () => {
        it('switch is unchecked by default when not enrolled', async () => {
            const benefit = makeBenefit({ id: 'b1' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(
                <OptionalBenefitsCard
                    selected_benefits={{}}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                const switchEl = screen.getByRole('switch');
                expect(switchEl).not.toBeChecked();
            });
        });

        it('switch is checked when benefit is enrolled', async () => {
            const benefit = makeBenefit({ id: 'b1' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(
                <OptionalBenefitsCard
                    selected_benefits={{ 'b1': true }}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                const switchEl = screen.getByRole('switch');
                expect(switchEl).toBeChecked();
            });
        });

        it('calls upsertEmployeeBenefit with ACTIVE status when enrolling', async () => {
            const benefit = makeBenefit({ id: 'b1' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockUpsertEmployeeBenefit.mockResolvedValue({ id: 'b1', status: 'ACTIVE' });

            const setSelectedBenefits = vi.fn();

            render(
                <OptionalBenefitsCard
                    selected_benefits={{}}
                    set_selected_benefits={setSelectedBenefits}
                />
            );

            await waitFor(() => {
                const switchEl = screen.getByRole('switch');
                fireEvent.click(switchEl);
            });

            await waitFor(() => {
                expect(mockUpsertEmployeeBenefit).toHaveBeenCalledWith({
                    benefit_id: 'b1',
                    status: 'ACTIVE',
                });
            });
        });

        it('shows loading state during enrollment submission', async () => {
            const benefit = makeBenefit({ id: 'b1' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockUpsertEmployeeBenefit.mockImplementation(() => new Promise(() => {}));

            render(
                <OptionalBenefitsCard
                    selected_benefits={{}}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                const switchEl = screen.getByRole('switch');
                fireEvent.click(switchEl);
            });

            await waitFor(() => {
                const switchEl = screen.getByRole('switch');
                expect(switchEl).toBeDisabled();
            });
        });

        it('enrolled benefit shows green background', async () => {
            const benefit = makeBenefit({ id: 'b1' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(
                <OptionalBenefitsCard
                    selected_benefits={{ 'b1': true }}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                const card = screen.getByText('Life Insurance').closest('div[class*="border-green"]');
                expect(card).toBeInTheDocument();
            });
        });
    });

    describe('Opting Out of Benefits', () => {
        it('calls upsertEmployeeBenefit with NOT_ENROLLED status when opting out', async () => {
            const benefit = makeBenefit({ id: 'b1' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockUpsertEmployeeBenefit.mockResolvedValue({ id: 'b1', status: 'NOT_ENROLLED' });

            const setSelectedBenefits = vi.fn();

            render(
                <OptionalBenefitsCard
                    selected_benefits={{ 'b1': true }}
                    set_selected_benefits={setSelectedBenefits}
                />
            );

            await waitFor(() => {
                const switchEl = screen.getByRole('switch');
                fireEvent.click(switchEl);
            });

            await waitFor(() => {
                expect(mockUpsertEmployeeBenefit).toHaveBeenCalledWith({
                    benefit_id: 'b1',
                    status: 'NOT_ENROLLED',
                });
            });
        });

        it('switch shows loading state during opt-out submission', async () => {
            const benefit = makeBenefit({ id: 'b1' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockUpsertEmployeeBenefit.mockImplementation(() => new Promise(() => {}));

            render(
                <OptionalBenefitsCard
                    selected_benefits={{ 'b1': true }}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                const switchEl = screen.getByRole('switch');
                fireEvent.click(switchEl);
            });

            await waitFor(() => {
                const switchEl = screen.getByRole('switch');
                expect(switchEl).toBeDisabled();
            });
        });
    });

    describe('Error Handling', () => {
        it('logs error when enrollment fails', async () => {
            const benefit = makeBenefit({ id: 'b1' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockUpsertEmployeeBenefit.mockRejectedValue(new Error('Enrollment failed'));

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            render(
                <OptionalBenefitsCard
                    selected_benefits={{}}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                const switchEl = screen.getByRole('switch');
                fireEvent.click(switchEl);
            });

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalled();
            });
        });

        it('reverts switch to previous state on error', async () => {
            const benefit = makeBenefit({ id: 'b1' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockUpsertEmployeeBenefit.mockRejectedValue(new Error('Enrollment failed'));

            const setSelectedBenefits = vi.fn();

            render(
                <OptionalBenefitsCard
                    selected_benefits={{ 'b1': false }}
                    set_selected_benefits={setSelectedBenefits}
                />
            );

            await waitFor(() => {
                const switchEl = screen.getByRole('switch');
                fireEvent.click(switchEl);
            });

            await waitFor(() => {
                expect(setSelectedBenefits).toHaveBeenCalled();
            });
        });

        it('pending state prevents multiple submissions', async () => {
            const benefit = makeBenefit({ id: 'b1' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockUpsertEmployeeBenefit.mockImplementation(() => new Promise(() => {}));

            render(
                <OptionalBenefitsCard
                    selected_benefits={{}}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                const switchEl = screen.getByRole('switch');
                fireEvent.click(switchEl);
                fireEvent.click(switchEl);
            });

            expect(mockUpsertEmployeeBenefit).toHaveBeenCalledTimes(1);
        });
    });

    describe('Data Persistence', () => {
        it('loads previously enrolled benefits from selected_benefits prop', async () => {
            const benefit = makeBenefit({ id: 'b1' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(
                <OptionalBenefitsCard
                    selected_benefits={{ 'b1': true }}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                const switchEl = screen.getByRole('switch');
                expect(switchEl).toBeChecked();
            });
        });

        it('preserves enrollment when component re-renders', async () => {
            const benefit = makeBenefit({ id: 'b1' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            const { rerender } = render(
                <OptionalBenefitsCard
                    selected_benefits={{ 'b1': true }}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                const switchEl = screen.getByRole('switch');
                expect(switchEl).toBeChecked();
            });

            rerender(
                <OptionalBenefitsCard
                    selected_benefits={{ 'b1': true }}
                    set_selected_benefits={vi.fn()}
                />
            );

            await waitFor(() => {
                const switchEl = screen.getByRole('switch');
                expect(switchEl).toBeChecked();
            });
        });
    });
});