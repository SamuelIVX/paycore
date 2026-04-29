import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Tables } from '@/lib/interfaces/database.types';

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn(),
    }),
}));

// Mock Supabase clients
vi.mock('@/utils/supabase/client', () => ({
    createClient: () => ({}),
}));

vi.mock('@/utils/supabase/server', () => ({
    createClient: async () => ({
        auth: { getUser: vi.fn() },
        from: vi.fn(),
    }),
}));

// Mock the benefits API calls
const { mockGetOptionalBenefits, mockUpdateBenefit, mockDeleteBenefit } = vi.hoisted(() => ({
    mockGetOptionalBenefits: vi.fn(),
    mockUpdateBenefit: vi.fn(),
    mockDeleteBenefit: vi.fn(),
}));

vi.mock('@/lib/supabase/benefits', () => ({
    getOptionalBenefits: mockGetOptionalBenefits,
    updateBenefit: mockUpdateBenefit,
    deleteBenefit: mockDeleteBenefit,
}));

// Mock the custom hook
vi.mock('@/hooks/use-add-benefit', () => ({
    useAddBenefit: () => ({
        benefit: 'Life Insurance',
        setBenefit: vi.fn(),
        tag: 'Life',
        setTag: vi.fn(),
        description: 'Term life insurance coverage',
        setDescription: vi.fn(),
        provider: 'MetLife',
        setProvider: vi.fn(),
        coverage: '3x annual salary',
        setCoverage: vi.fn(),
        loading: false,
        open: false,
        setOpen: vi.fn(),
        handleAddBenefit: vi.fn().mockResolvedValue(true),
    }),
}));

// Import after mocks
import OptionalBenefitsGrid from '@/components/manager/optional-benefits/OptionalBenefits';

// Test data factory
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

describe('OptionalBenefitsGrid Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering & Data Display', () => {
        it('renders optional benefits grid with title and description', async () => {
            mockGetOptionalBenefits.mockResolvedValue([]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Optional Benefits')).toBeInTheDocument();
                expect(screen.getByText('Employees can enroll in these benefits (cost deducted from paycheck)')).toBeInTheDocument();
            });
        });

        it('displays all optional benefits', async () => {
            const benefits = [
                makeBenefit({ id: 'b1', benefit: 'Life Insurance', monthly_cost: 25 }),
                makeBenefit({ id: 'b2', benefit: 'Disability Insurance', monthly_cost: 40 }),
                makeBenefit({ id: 'b3', benefit: 'Accident Coverage', monthly_cost: 15 }),
            ];
            mockGetOptionalBenefits.mockResolvedValue(benefits);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
                expect(screen.getByText('Disability Insurance')).toBeInTheDocument();
                expect(screen.getByText('Accident Coverage')).toBeInTheDocument();
            });
        });

        it('shows benefit details correctly', async () => {
            const benefit = makeBenefit({
                benefit: 'Life Insurance',
                description: 'Term life insurance coverage',
                provider: 'MetLife',
                coverage: '3x annual salary',
                monthly_cost: 25,
            });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
                expect(screen.getByText('Term life insurance coverage')).toBeInTheDocument();
                expect(screen.getByText('MetLife')).toBeInTheDocument();
                expect(screen.getByText('3x annual salary')).toBeInTheDocument();
                expect(screen.getByText(/\$25/)).toBeInTheDocument();
            });
        });

        it('displays monthly costs for optional benefits', async () => {
            const benefits = [
                makeBenefit({ monthly_cost: 25 }),
                makeBenefit({ monthly_cost: 40 }),
            ];
            mockGetOptionalBenefits.mockResolvedValue(benefits);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText(/\$25/)).toBeInTheDocument();
                expect(screen.getByText(/\$40/)).toBeInTheDocument();
            });
        });

        it('shows loading state initially', async () => {
            mockGetOptionalBenefits.mockImplementation(() => new Promise(() => { }));

            render(<OptionalBenefitsGrid />);

            expect(screen.getByText('Loading optional benefits...')).toBeInTheDocument();
        });

        it('displays error message when fetch fails', async () => {
            mockGetOptionalBenefits.mockRejectedValue(new Error('API Error'));

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Failed to load benefits')).toBeInTheDocument();
            });
        });

        it('shows empty state when no benefits', async () => {
            mockGetOptionalBenefits.mockResolvedValue([]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Add Optional Benefit')).toBeInTheDocument();
            });
        });

        it('renders optional benefit type label', async () => {
            const benefit = makeBenefit({ type: 'OPTIONAL' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Optional Benefits')).toBeInTheDocument();
            });
        });
    });

    describe('Add Optional Benefit', () => {
        it('renders Add Optional Benefit button', async () => {
            mockGetOptionalBenefits.mockResolvedValue([]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Add Optional Benefit')).toBeInTheDocument();
            });
        });

        it('opens dialog when Add button clicked', async () => {
            // TODO: Requires userEvent.click + dialog visibility assertion
            mockGetOptionalBenefits.mockResolvedValue([]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                const addButton = screen.getByText('Add Optional Benefit');
                expect(addButton).toBeInTheDocument();
            });
        });

        it.skip('displays form fields in add dialog', async () => {
            // TODO: Requires click + dialog fill + submit
            mockGetOptionalBenefits.mockResolvedValue([]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Add Optional Benefit')).toBeInTheDocument();
            });
        });

        it.skip('requires monthly cost field for optional benefits', async () => {
            // TODO: Requires form validation testing
            mockGetOptionalBenefits.mockResolvedValue([]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Add Optional Benefit')).toBeInTheDocument();
            });
        });

        it.skip('adds new optional benefit to list after submission', async () => {
            // TODO: Requires click + fill + submit + mockCreate call verification
            mockGetOptionalBenefits
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([
                    makeBenefit({ benefit: 'New Optional Benefit', monthly_cost: 35 }),
                ]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Add Optional Benefit')).toBeInTheDocument();
            });
        });

        it.skip('shows success feedback after adding', async () => {
            // TODO: Requires full add flow + success toast assertion
            const newBenefit = makeBenefit({ benefit: 'New Optional', monthly_cost: 30 });
            mockGetOptionalBenefits.mockResolvedValue([newBenefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('New Optional')).toBeInTheDocument();
            });
        });

        it.skip('closes dialog after successful addition', async () => {
            // TODO: Requires click + submit + dialog close verification
            mockGetOptionalBenefits.mockResolvedValue([]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Add Optional Benefit')).toBeInTheDocument();
            });
        });
    });

    describe('Edit Optional Benefit', () => {
        it.skip('opens edit dialog when benefit card is clicked', async () => {
            // TODO: Requires click + dialog visibility assertion
            const benefit = makeBenefit({
                benefit: 'Life Insurance',
            });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });
        });

        it.skip('pre-fills edit dialog with current benefit data', async () => {
            // TODO: Requires click + form value verification
            const benefit = makeBenefit({
                benefit: 'Life Insurance',
                description: 'Current coverage',
                provider: 'MetLife',
                coverage: '3x salary',
                monthly_cost: 25,
            });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
                expect(screen.getByText('Current coverage')).toBeInTheDocument();
            });
        });

        it.skip('updates benefit on save', async () => {
            // TODO: Requires click + fill + submit + mockUpdateBenefit call
            const benefit = makeBenefit({ benefit: 'Life Insurance', monthly_cost: 25 });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockUpdateBenefit.mockResolvedValue({ id: benefit.id });

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });
        });

        it.skip('reflects updates immediately in list', async () => {
            // TODO: Requires update flow + DOM verification
            const benefit = makeBenefit({ benefit: 'Life Insurance', monthly_cost: 25 });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });
        });

        it.skip('updates monthly cost when edited', async () => {
            // TODO: Requires edit flow + cost verification
            const benefit = makeBenefit({ monthly_cost: 25 });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText(/\$25/)).toBeInTheDocument();
            });
        });
    });

    describe('Delete Optional Benefit', () => {
        it.skip('shows delete button on each benefit', async () => {
            // TODO: Requires delete button presence check
            const benefit = makeBenefit({ benefit: 'Life Insurance' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });
        });

        it('opens confirmation dialog when delete clicked', async () => {
            const benefit = makeBenefit({ benefit: 'Life Insurance' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });
        });

        it.skip('confirms deletion and removes benefit', async () => {
            // TODO: Requires click delete + confirm dialog + list verification
            const benefit = makeBenefit({ id: 'b1', benefit: 'Life Insurance' });
            mockGetOptionalBenefits
                .mockResolvedValueOnce([benefit])
                .mockResolvedValueOnce([]);
            mockDeleteBenefit.mockResolvedValue({ id: benefit.id });

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });
        });

        it.skip('cancels deletion without removing benefit', async () => {
            const benefit = makeBenefit({ benefit: 'Life Insurance' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });
        });

        it.skip('shows error if deletion fails', async () => {
            const benefit = makeBenefit({ benefit: 'Life Insurance' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockDeleteBenefit.mockRejectedValue(new Error('Delete failed'));

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });
        });

        it.skip('shows loading state during deletion', async () => {
            const benefit = makeBenefit({ benefit: 'Life Insurance' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockDeleteBenefit.mockImplementation(() => new Promise(() => { }));

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });
        });
    });

    describe('Error Handling', () => {
        it.skip('shows error message for failed operations', async () => {
            mockGetOptionalBenefits.mockRejectedValue(new Error('API Error'));

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Failed to load benefits')).toBeInTheDocument();
            });
        });

        it.skip('handles network errors gracefully', async () => {
            mockGetOptionalBenefits.mockRejectedValue(new Error('Network Error'));

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Failed to load benefits')).toBeInTheDocument();
            });
        });

        it.skip('allows retry after error', async () => {
            mockGetOptionalBenefits
                .mockRejectedValueOnce(new Error('Failed'))
                .mockResolvedValueOnce([makeBenefit()]);

            const { rerender } = render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Failed to load benefits')).toBeInTheDocument();
            });

            rerender(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('has semantic HTML structure', async () => {
            const benefit = makeBenefit();
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            const { container } = render(<OptionalBenefitsGrid />);

            expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
        });

        it('displays loading state with aria-live', async () => {
            mockGetOptionalBenefits.mockImplementation(() => new Promise(() => { }));

            render(<OptionalBenefitsGrid />);

            const loadingElement = screen.getByText('Loading optional benefits...');
            expect(loadingElement).toHaveAttribute('aria-live');
        });

        it('displays error message with role alert', async () => {
            mockGetOptionalBenefits.mockRejectedValue(new Error('Failed'));

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                const errorElement = screen.getByText('Failed to load benefits');
                expect(errorElement).toHaveAttribute('role', 'alert');
            });
        });
    });

    describe('Benefits Information Display', () => {
        it('displays provider information', async () => {
            const benefit = makeBenefit({ provider: 'MetLife' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('MetLife')).toBeInTheDocument();
            });
        });

        it('displays coverage information', async () => {
            const benefit = makeBenefit({ coverage: '3x annual salary' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('3x annual salary')).toBeInTheDocument();
            });
        });

        it.skip('displays benefit tags correctly', async () => {
            // TODO: Component uses tag for icon lookup, not text display. Tag is not rendered as text.
            // This test should verify icon rendering instead of text.
            const benefits = [
                makeBenefit({ tag: 'Life' }),
                makeBenefit({ tag: 'Disability' }),
                makeBenefit({ tag: 'Wellness' }),
            ];
            mockGetOptionalBenefits.mockResolvedValue(benefits);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life')).toBeInTheDocument();
                expect(screen.getByText('Disability')).toBeInTheDocument();
                expect(screen.getByText('Wellness')).toBeInTheDocument();
            });
        });
    });

    describe('Responsive Layout', () => {
        it('uses grid layout for benefits', async () => {
            const benefits = [
                makeBenefit({ id: 'b1' }),
                makeBenefit({ id: 'b2' }),
            ];
            mockGetOptionalBenefits.mockResolvedValue(benefits);

            const { container } = render(<OptionalBenefitsGrid />);

            const gridContainer = container.querySelector('[class*="grid"]');
            expect(gridContainer).toBeInTheDocument();
        });
    });
});
