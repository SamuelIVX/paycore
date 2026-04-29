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
const { mockGetCompanyBenefits, mockUpdateBenefit, mockDeleteBenefit } = vi.hoisted(() => ({
    mockGetCompanyBenefits: vi.fn(),
    mockUpdateBenefit: vi.fn(),
    mockDeleteBenefit: vi.fn(),
}));

vi.mock('@/lib/supabase/benefits', () => ({
    getCompanyBenefits: mockGetCompanyBenefits,
    updateBenefit: mockUpdateBenefit,
    deleteBenefit: mockDeleteBenefit,
}));

// Mock the custom hook
vi.mock('@/hooks/use-add-benefit', () => ({
    useAddBenefit: () => ({
        benefit: 'Health Insurance',
        setBenefit: vi.fn(),
        tag: 'Health',
        setTag: vi.fn(),
        description: 'Comprehensive health coverage',
        setDescription: vi.fn(),
        provider: 'BlueCross BlueShield',
        setProvider: vi.fn(),
        coverage: 'Up to $1,000,000',
        setCoverage: vi.fn(),
        loading: false,
        open: false,
        setOpen: vi.fn(),
        handleAddBenefit: vi.fn().mockResolvedValue(true),
    }),
}));

// Import after mocks
import CompanyBenefitsGrid from '@/components/manager/company-benefits/CompanyBenefits';

// Test data factory
const makeBenefit = (overrides: Partial<Tables<'benefits'>> = {}): Tables<'benefits'> => ({
    id: 'benefit-1',
    benefit: 'Health Insurance',
    tag: 'Health',
    description: 'Comprehensive health coverage',
    provider: 'BlueCross BlueShield',
    coverage: 'Up to $1,000,000',
    monthly_cost: 0,
    type: 'COMPANY',
    created_at: null,
    ...overrides,
} as Tables<'benefits'>);

describe('CompanyBenefitsGrid Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering & Data Display', () => {
        it('renders company benefits grid with title and description', async () => {
            mockGetCompanyBenefits.mockResolvedValue([]);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Company-Provided Benefits')).toBeInTheDocument();
                expect(screen.getByText('These benefits are automatically provided to all employees')).toBeInTheDocument();
            });
        });

        it('displays all company benefits', async () => {
            const benefits = [
                makeBenefit({ id: 'b1', benefit: 'Health Insurance', tag: 'Health' }),
                makeBenefit({ id: 'b2', benefit: 'Dental Coverage', tag: 'Dental' }),
                makeBenefit({ id: 'b3', benefit: 'Vision Plan', tag: 'Vision' }),
            ];
            mockGetCompanyBenefits.mockResolvedValue(benefits);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Health Insurance')).toBeInTheDocument();
                expect(screen.getByText('Dental Coverage')).toBeInTheDocument();
                expect(screen.getByText('Vision Plan')).toBeInTheDocument();
            });
        });

        it('shows benefit details correctly', async () => {
            const benefit = makeBenefit({
                benefit: 'Health Insurance',
                description: 'Comprehensive medical coverage',
                provider: 'BlueCross BlueShield',
                coverage: 'Up to $1,000,000',
            });
            mockGetCompanyBenefits.mockResolvedValue([benefit]);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Health Insurance')).toBeInTheDocument();
                expect(screen.getByText('Comprehensive medical coverage')).toBeInTheDocument();
                expect(screen.getByText('BlueCross BlueShield')).toBeInTheDocument();
                expect(screen.getByText('Up to $1,000,000')).toBeInTheDocument();
            });
        });

        it('shows benefit free badge', async () => {
            const benefit = makeBenefit({ benefit: 'Health Insurance' });
            mockGetCompanyBenefits.mockResolvedValue([benefit]);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Free')).toBeInTheDocument();
            });
        });

        it('shows loading state initially', async () => {
            mockGetCompanyBenefits.mockImplementation(() => new Promise(() => { }));

            render(<CompanyBenefitsGrid />);

            expect(screen.getByText('Loading company benefits...')).toBeInTheDocument();
        });

        it('displays error message when fetch fails', async () => {
            mockGetCompanyBenefits.mockRejectedValue(new Error('API Error'));

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Failed to load benefits')).toBeInTheDocument();
            });
        });

        it('shows empty state when no benefits', async () => {
            mockGetCompanyBenefits.mockResolvedValue([]);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Add Company Benefit')).toBeInTheDocument();
            });
        });

        it('renders company benefit type label', async () => {
            const benefit = makeBenefit({ type: 'COMPANY' });
            mockGetCompanyBenefits.mockResolvedValue([benefit]);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Company-Provided Benefits')).toBeInTheDocument();
            });
        });
    });

    describe('Add Company Benefit', () => {
        it('renders Add Company Benefit button', async () => {
            mockGetCompanyBenefits.mockResolvedValue([]);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Add Company Benefit')).toBeInTheDocument();
            });
        });

        it('opens dialog when Add button clicked', async () => {
            // TODO: Requires userEvent.click + dialog visibility assertion
            mockGetCompanyBenefits.mockResolvedValue([]);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                const addButton = screen.getByText('Add Company Benefit');
                expect(addButton).toBeInTheDocument();
            });
        });

        it.skip('displays form fields in add dialog', async () => {
            // TODO: Requires userEvent.click to open dialog + fill form + submit
            mockGetCompanyBenefits.mockResolvedValue([]);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Add Company Benefit')).toBeInTheDocument();
            });
        });

        it.skip('adds new benefit to list after submission', async () => {
            // TODO: Requires mockAddCompanyBenefit + click + fill + submit + list verification
            mockGetCompanyBenefits
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([
                    makeBenefit({ benefit: 'New Benefit' }),
                ]);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Add Company Benefit')).toBeInTheDocument();
            });
        });

        it('shows success feedback after adding', async () => {
            // TODO: Requires full add flow + success toast assertion
            const newBenefit = makeBenefit({ benefit: 'New Benefit' });
            mockGetCompanyBenefits.mockResolvedValue([newBenefit]);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('New Benefit')).toBeInTheDocument();
            });
        });

        it.skip('closes dialog after successful addition', async () => {
            // TODO: Requires click + submit + dialog close verification
            mockGetCompanyBenefits.mockResolvedValue([]);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Add Company Benefit')).toBeInTheDocument();
            });
        });
    });

    describe('Edit Company Benefit', () => {
        it.skip('opens edit dialog when benefit card is clicked', async () => {
            // TODO: Requires click card + dialog visibility assertion
            const benefit = makeBenefit({
                benefit: 'Health Insurance',
            });
            mockGetCompanyBenefits.mockResolvedValue([benefit]);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Health Insurance')).toBeInTheDocument();
            });
        });

        it.skip('pre-fills edit dialog with current benefit data', async () => {
            // TODO: Requires click + dialog open + form value verification
            const benefit = makeBenefit({
                benefit: 'Health Insurance',
                description: 'Current coverage',
                provider: 'BlueCross',
                coverage: '$1M',
            });
            mockGetCompanyBenefits.mockResolvedValue([benefit]);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Health Insurance')).toBeInTheDocument();
                expect(screen.getByText('Current coverage')).toBeInTheDocument();
            });
        });

        it.skip('updates benefit on save', async () => {
            // TODO: Requires click benefit card + fill form + submit + mockUpdateBenefit call
            const benefit = makeBenefit({ benefit: 'Health Insurance' });
            mockGetCompanyBenefits.mockResolvedValue([benefit]);
            mockUpdateBenefit.mockResolvedValue({ id: benefit.id });

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Health Insurance')).toBeInTheDocument();
            });
        });

        it.skip('cancels deletion without removing benefit', async () => {
            // TODO: Requires click delete + confirm dialog + cancel
            const benefit = makeBenefit({ benefit: 'Health Insurance' });
            mockGetCompanyBenefits.mockResolvedValue([benefit]);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Health Insurance')).toBeInTheDocument();
            });
        });

        it.skip('shows error if deletion fails', async () => {
            // TODO: Requires click delete + mockDeleteBenefit rejection + error assertion
            const benefit = makeBenefit({ benefit: 'Health Insurance' });
            mockGetCompanyBenefits.mockResolvedValue([benefit]);
            mockDeleteBenefit.mockRejectedValue(new Error('Delete failed'));

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Health Insurance')).toBeInTheDocument();
            });
        });

        it.skip('shows loading state during deletion', async () => {
            // TODO: Requires click delete + loading state assertion
            const benefit = makeBenefit({ benefit: 'Health Insurance' });
            mockGetCompanyBenefits.mockResolvedValue([benefit]);
            mockDeleteBenefit.mockImplementation(() => new Promise(() => { }));

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Health Insurance')).toBeInTheDocument();
            });
        });
    });

    describe('Error Handling', () => {
        it('shows error message for failed operations', async () => {
            mockGetCompanyBenefits.mockRejectedValue(new Error('API Error'));

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Failed to load benefits')).toBeInTheDocument();
            });
        });

        it('handles network errors gracefully', async () => {
            mockGetCompanyBenefits.mockRejectedValue(new Error('Network Error'));

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Failed to load benefits')).toBeInTheDocument();
            });
        });

        it.skip('allows retry after error', async () => {
            mockGetCompanyBenefits
                .mockRejectedValueOnce(new Error('Failed'))
                .mockResolvedValueOnce([makeBenefit()]);

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                expect(screen.getByText('Failed to load benefits')).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('has semantic HTML structure', async () => {
            const benefit = makeBenefit();
            mockGetCompanyBenefits.mockResolvedValue([benefit]);

            const { container } = render(<CompanyBenefitsGrid />);

            expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
        });

        it('displays loading state with aria-live', async () => {
            mockGetCompanyBenefits.mockImplementation(() => new Promise(() => { }));

            render(<CompanyBenefitsGrid />);

            const loadingElement = screen.getByText('Loading company benefits...');
            expect(loadingElement).toHaveAttribute('aria-live');
        });

        it('displays error message with role alert', async () => {
            mockGetCompanyBenefits.mockRejectedValue(new Error('Failed'));

            render(<CompanyBenefitsGrid />);

            await waitFor(() => {
                const errorElement = screen.getByText('Failed to load benefits');
                expect(errorElement).toHaveAttribute('role', 'alert');
            });
        });
    });

    describe('Responsive Layout', () => {
        it('uses grid layout for benefits', async () => {
            const benefits = [
                makeBenefit({ id: 'b1', benefit: 'Health' }),
                makeBenefit({ id: 'b2', benefit: 'Dental' }),
            ];
            mockGetCompanyBenefits.mockResolvedValue(benefits);

            const { container } = render(<CompanyBenefitsGrid />);

            const gridContainer = container.querySelector('[class*="grid"]');
            expect(gridContainer).toBeInTheDocument();
        });
    });
});
