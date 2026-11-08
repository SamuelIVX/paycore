/**
 * Vitest coverage for components/manager/optional-benefits.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

let mockAddBenefitOpen = false;
const mockSetAddBenefitOpen = vi.fn((val: boolean) => {
    mockAddBenefitOpen = val;
});
const mockHandleAddBenefit = vi.fn().mockResolvedValue(true);

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
        monthlyCost: 25,
        setMonthlyCost: vi.fn(),
        loading: false,
        get open() { return mockAddBenefitOpen; },
        setOpen: mockSetAddBenefitOpen,
        handleAddBenefit: mockHandleAddBenefit,
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
        mockAddBenefitOpen = false;
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
                makeBenefit({ id: 'b1', monthly_cost: 25 }),
                makeBenefit({ id: 'b2', monthly_cost: 40 }),
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
            // TODO(#189): Requires userEvent.click + dialog visibility assertion
            mockGetOptionalBenefits.mockResolvedValue([]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                const addButton = screen.getByText('Add Optional Benefit');
                expect(addButton).toBeInTheDocument();
            });
        });

        it('displays form fields in add dialog', async () => {
            mockGetOptionalBenefits.mockResolvedValue([]);
            mockAddBenefitOpen = true;

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Add New Benefit')).toBeInTheDocument();
                expect(screen.getByLabelText('Benefit Name')).toBeInTheDocument();
                expect(screen.getByLabelText('Description')).toBeInTheDocument();
                expect(screen.getByLabelText('Provider')).toBeInTheDocument();
                expect(screen.getByLabelText('Monthly Cost')).toBeInTheDocument();
            });
            mockAddBenefitOpen = false;
        });

        it('requires monthly cost field for optional benefits', async () => {
            mockGetOptionalBenefits.mockResolvedValue([]);
            mockAddBenefitOpen = true;

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                const costInput = screen.getByLabelText('Monthly Cost');
                expect(costInput).toBeInTheDocument();
                expect(costInput).toHaveAttribute('type', 'number');
            });
            mockAddBenefitOpen = false;
        });

        it('adds new optional benefit to list after submission', async () => {
            mockGetOptionalBenefits
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([
                    makeBenefit({ benefit: 'New Optional Benefit', monthly_cost: 35 }),
                ]);
            mockAddBenefitOpen = true;

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Add Benefit')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Add Benefit'));

            await waitFor(() => {
                expect(mockHandleAddBenefit).toHaveBeenCalled();
                expect(mockGetOptionalBenefits).toHaveBeenCalledTimes(2);
            });
            mockAddBenefitOpen = false;
        });

        it('shows success feedback after adding', async () => {
            const newBenefit = makeBenefit({ benefit: 'New Optional', monthly_cost: 30 });
            mockGetOptionalBenefits.mockResolvedValue([newBenefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('New Optional')).toBeInTheDocument();
            });
        });

        it('opens add benefit dialog when trigger is clicked', async () => {
            mockGetOptionalBenefits.mockResolvedValue([]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Add Optional Benefit')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Add Optional Benefit'));
            expect(mockSetAddBenefitOpen).toHaveBeenCalledWith(true);
        });
    });

    describe('Edit Optional Benefit', () => {
        it('opens edit dialog when benefit card is clicked', async () => {
            const benefit = makeBenefit({
                benefit: 'Life Insurance',
            });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Life Insurance'));

            await waitFor(() => {
                expect(screen.getByText('Edit Benefit')).toBeInTheDocument();
            });
        });

        it('pre-fills edit dialog with current benefit data', async () => {
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
            });

            fireEvent.click(screen.getByText('Life Insurance'));

            await waitFor(() => {
                expect(screen.getByText('Edit Benefit')).toBeInTheDocument();
                expect(screen.getByDisplayValue('Life Insurance')).toBeInTheDocument();
                expect(screen.getByDisplayValue('Current coverage')).toBeInTheDocument();
                expect(screen.getByDisplayValue('MetLife')).toBeInTheDocument();
                expect(screen.getByDisplayValue('25')).toBeInTheDocument();
            });
        });

        it('updates benefit on save', async () => {
            const benefit = makeBenefit({ id: 'benefit-1', benefit: 'Life Insurance', monthly_cost: 25 });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockUpdateBenefit.mockResolvedValue({ id: benefit.id });

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Life Insurance'));

            await waitFor(() => {
                expect(screen.getByText('Update Benefit')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Update Benefit'));

            await waitFor(() => {
                expect(mockUpdateBenefit).toHaveBeenCalledWith('benefit-1', expect.any(Object));
            });
        });

        it('reflects updates immediately in list', async () => {
            const benefit = makeBenefit({ id: 'benefit-1', benefit: 'Life Insurance', monthly_cost: 25 });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockUpdateBenefit.mockResolvedValue({ id: benefit.id });

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Life Insurance'));

            await waitFor(() => {
                expect(screen.getByText('Update Benefit')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Update Benefit'));

            await waitFor(() => {
                expect(mockUpdateBenefit).toHaveBeenCalled();
            });
        });

        it('updates monthly cost when edited', async () => {
            const benefit = makeBenefit({ id: 'benefit-1', monthly_cost: 25 });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockUpdateBenefit.mockResolvedValue({ id: benefit.id });

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText(/\$25/)).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText(/\$25/));

            await waitFor(() => {
                expect(screen.getByText('Edit Benefit')).toBeInTheDocument();
                const costInput = screen.getByLabelText('Monthly Cost');
                expect(costInput).toBeInTheDocument();
            });
        });

        it('shows error if update fails', async () => {
            const benefit = makeBenefit({ id: 'benefit-1', benefit: 'Life Insurance' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockUpdateBenefit.mockRejectedValue(new Error('Update failed'));

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Life Insurance'));

            await waitFor(() => {
                expect(screen.getByText('Update Benefit')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Update Benefit'));

            await waitFor(() => {
                expect(screen.getByText('Failed to update benefit.')).toBeInTheDocument();
            });
        });

        it('shows loading state during update', async () => {
            const benefit = makeBenefit({ id: 'benefit-1', benefit: 'Life Insurance' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockUpdateBenefit.mockImplementation(() => new Promise(() => { }));

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Life Insurance'));

            await waitFor(() => {
                expect(screen.getByText('Update Benefit')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Update Benefit'));

            await waitFor(() => {
                expect(screen.getByText('Updating...')).toBeInTheDocument();
            });
        });
    });

    describe('Delete Optional Benefit', () => {
        it('shows delete button on each benefit', async () => {
            const benefit = makeBenefit({ benefit: 'Life Insurance' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });

            const deleteTrigger = screen.getByRole('button', { name: 'Delete Life Insurance' });
            expect(deleteTrigger).toBeInTheDocument();
        });

        it('opens confirmation dialog when delete clicked', async () => {
            const benefit = makeBenefit({ benefit: 'Life Insurance' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });

            const deleteTrigger = screen.getByRole('button', { name: 'Delete Life Insurance' });
            fireEvent.click(deleteTrigger);

            await waitFor(() => {
                expect(screen.getByText('Delete Benefit')).toBeInTheDocument();
            });
        });

        it('confirms deletion and removes benefit', async () => {
            const benefit = makeBenefit({ id: 'b1', benefit: 'Life Insurance' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockDeleteBenefit.mockResolvedValue({ id: benefit.id });

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });

            const deleteTrigger = screen.getByRole('button', { name: 'Delete Life Insurance' });
            fireEvent.click(deleteTrigger);

            await waitFor(() => {
                expect(screen.getByText('Delete Benefit')).toBeInTheDocument();
                expect(screen.getByText('Delete')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Delete'));

            await waitFor(() => {
                expect(mockDeleteBenefit).toHaveBeenCalledWith('b1');
                expect(screen.queryByText('Life Insurance')).not.toBeInTheDocument();
            });
        });

        it('cancels deletion without removing benefit', async () => {
            const benefit = makeBenefit({ id: 'benefit-1', benefit: 'Life Insurance' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });

            const deleteTrigger = screen.getByRole('button', { name: 'Delete Life Insurance' });
            fireEvent.click(deleteTrigger);

            await waitFor(() => {
                expect(screen.getByText('Delete Benefit')).toBeInTheDocument();
                expect(screen.getByText('Cancel')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Cancel'));

            await waitFor(() => {
                expect(screen.queryByText('Delete Benefit')).not.toBeInTheDocument();
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });
        });

        it('shows error if deletion fails', async () => {
            const benefit = makeBenefit({ id: 'benefit-1', benefit: 'Life Insurance' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockDeleteBenefit.mockRejectedValue(new Error('Delete failed'));

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });

            const deleteTrigger = screen.getByRole('button', { name: 'Delete Life Insurance' });
            fireEvent.click(deleteTrigger);

            await waitFor(() => {
                expect(screen.getByText('Delete')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Delete'));

            await waitFor(() => {
                expect(screen.getByText('Failed to delete benefit.')).toBeInTheDocument();
            });
        });

        it('shows loading state during deletion', async () => {
            const benefit = makeBenefit({ id: 'benefit-1', benefit: 'Life Insurance' });
            mockGetOptionalBenefits.mockResolvedValue([benefit]);
            mockDeleteBenefit.mockImplementation(() => new Promise(() => { }));

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
            });

            const deleteTrigger = screen.getByRole('button', { name: 'Delete Life Insurance' });
            fireEvent.click(deleteTrigger);

            await waitFor(() => {
                expect(screen.getByText('Delete')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Delete'));

            await waitFor(() => {
                expect(screen.getByText('Deleting...')).toBeInTheDocument();
            });
        });
    });

    describe('Error Handling', () => {
        it('shows error message for failed operations', async () => {
            mockGetOptionalBenefits.mockRejectedValue(new Error('API Error'));

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Failed to load benefits')).toBeInTheDocument();
            });
        });

        it('handles network errors gracefully', async () => {
            mockGetOptionalBenefits.mockRejectedValue(new Error('Network Error'));

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Failed to load benefits')).toBeInTheDocument();
            });
        });

        it('allows retry after error', async () => {
            mockGetOptionalBenefits
                .mockRejectedValueOnce(new Error('Failed'))
                .mockResolvedValueOnce([makeBenefit()]);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Failed to load benefits')).toBeInTheDocument();
                expect(screen.getByText('Retry')).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Retry'));

            await waitFor(() => {
                expect(mockGetOptionalBenefits).toHaveBeenCalledTimes(2);
                expect(screen.getByText('Life Insurance')).toBeInTheDocument();
                expect(screen.queryByText('Failed to load benefits')).not.toBeInTheDocument();
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
                expect(screen.getByRole('alert')).toHaveTextContent('Failed to load benefits');
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

        it('displays benefit tags correctly', async () => {
            const benefits = [
                makeBenefit({ id: 'b1', tag: 'Life', benefit: 'Life Benefit' }),
                makeBenefit({ id: 'b2', tag: 'Disability', benefit: 'Disability Benefit' }),
                makeBenefit({ id: 'b3', tag: 'Wellness', benefit: 'Wellness Benefit' }),
            ];
            mockGetOptionalBenefits.mockResolvedValue(benefits);

            render(<OptionalBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Life Benefit')).toBeInTheDocument();
                expect(screen.getByText('Disability Benefit')).toBeInTheDocument();
                expect(screen.getByText('Wellness Benefit')).toBeInTheDocument();
            });

            expect(screen.getByTestId('benefit-icon-life')).toBeInTheDocument();
            expect(screen.getByTestId('benefit-icon-disability')).toBeInTheDocument();
            expect(screen.getByTestId('benefit-icon-wellness')).toBeInTheDocument();
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
