import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn(),
    }),
}));

import SummaryCards from '@/components/employee/summary-cards/SummaryCards';
import { SummaryCard } from '@/components/employee/summary-cards/SummaryCards';

describe('SummaryCards Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders benefits summary card with title', () => {
            render(
                <SummaryCards
                    company_count={3}
                    optional_count={2}
                    monthly_deduction={50}
                />
            );

            expect(screen.getByText('Benefits Cost Summary')).toBeInTheDocument();
        });

        it('displays company benefits count', () => {
            render(
                <SummaryCards
                    company_count={3}
                    optional_count={2}
                    monthly_deduction={50}
                />
            );

            expect(screen.getByText('3')).toBeInTheDocument();
            expect(screen.getByText('Company Benefits')).toBeInTheDocument();
        });

        it('displays optional benefits count', () => {
            render(
                <SummaryCards
                    company_count={3}
                    optional_count={2}
                    monthly_deduction={50}
                />
            );

            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('Optional Benefits')).toBeInTheDocument();
        });

        it('displays monthly deduction', () => {
            render(
                <SummaryCards
                    company_count={3}
                    optional_count={2}
                    monthly_deduction={50}
                />
            );

            expect(screen.getByText('$50.00')).toBeInTheDocument();
            expect(screen.getByText('Total Deductions')).toBeInTheDocument();
        });

        it('handles zero monthly deduction', () => {
            render(
                <SummaryCards
                    company_count={3}
                    optional_count={0}
                    monthly_deduction={0}
                />
            );

            expect(screen.getByText('$0.00')).toBeInTheDocument();
        });

        it('handles undefined monthly deduction', () => {
            render(
                <SummaryCards
                    company_count={3}
                    optional_count={2}
                />
            );

            expect(screen.getByText('$0.00')).toBeInTheDocument();
        });
    });

    describe('Display Calculations', () => {
        it('shows correct company benefits count', () => {
            render(
                <SummaryCards
                    company_count={5}
                    optional_count={3}
                    monthly_deduction={75}
                />
            );

            expect(screen.getByText('5')).toBeInTheDocument();
        });

        it('shows correct optional benefits count', () => {
            render(
                <SummaryCards
                    company_count={5}
                    optional_count={3}
                    monthly_deduction={75}
                />
            );

            expect(screen.getByText('3')).toBeInTheDocument();
        });

        it('calculates monthly deduction correctly', () => {
            render(
                <SummaryCards
                    company_count={1}
                    optional_count={2}
                    monthly_deduction={65}
                />
            );

            expect(screen.getByText('$65.00')).toBeInTheDocument();
        });

        it('displays correct descriptions', () => {
            render(
                <SummaryCards
                    company_count={1}
                    optional_count={1}
                    monthly_deduction={25}
                />
            );

            expect(screen.getByText('Provided to all employees')).toBeInTheDocument();
            expect(screen.getByText('Available for purchase')).toBeInTheDocument();
            expect(screen.getByText('Per month')).toBeInTheDocument();
        });
    });

    describe('Updates when benefits selection changes', () => {
        it('updates when company_count changes', () => {
            const { rerender } = render(
                <SummaryCards
                    company_count={1}
                    optional_count={0}
                    monthly_deduction={25}
                />
            );

            expect(screen.getByText('1')).toBeInTheDocument();

            rerender(
                <SummaryCards
                    company_count={3}
                    optional_count={0}
                    monthly_deduction={25}
                />
            );

            expect(screen.getAllByText('3').length).toBeGreaterThan(0);
        });

        it('updates when optional_count changes', () => {
            const { rerender } = render(
                <SummaryCards
                    company_count={1}
                    optional_count={1}
                    monthly_deduction={25}
                />
            );

            const optionalTexts = screen.getAllByText('1');
            expect(optionalTexts).toHaveLength(2);

            rerender(
                <SummaryCards
                    company_count={1}
                    optional_count={3}
                    monthly_deduction={75}
                />
            );

            expect(screen.getByText('3')).toBeInTheDocument();
        });

        it('updates when monthly_deduction changes', () => {
            const { rerender } = render(
                <SummaryCards
                    company_count={1}
                    optional_count={1}
                    monthly_deduction={25}
                />
            );

            expect(screen.getByText('$25.00')).toBeInTheDocument();

            rerender(
                <SummaryCards
                    company_count={1}
                    optional_count={1}
                    monthly_deduction={50}
                />
            );

            expect(screen.getByText('$50.00')).toBeInTheDocument();
        });
    });
});

describe('SummaryCard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders with title', () => {
            render(
                <SummaryCard
                    title="Test Title"
                    value={100}
                    color="text-blue-600"
                    description="Test description"
                />
            );

            expect(screen.getByText('Test Title')).toBeInTheDocument();
        });

        it('renders with numeric value', () => {
            render(
                <SummaryCard
                    title="Count"
                    value={42}
                    color="text-blue-600"
                    description="Test description"
                />
            );

            expect(screen.getByText('42')).toBeInTheDocument();
        });

        it('renders with string value', () => {
            render(
                <SummaryCard
                    title="Amount"
                    value="$100.00"
                    color="text-blue-600"
                    description="Test description"
                />
            );

            expect(screen.getByText('$100.00')).toBeInTheDocument();
        });

        it('renders with description', () => {
            render(
                <SummaryCard
                    title="Title"
                    value={100}
                    color="text-blue-600"
                    description="Test description"
                />
            );

            expect(screen.getByText('Test description')).toBeInTheDocument();
        });

        it('applies color class', () => {
            const { container } = render(
                <SummaryCard
                    title="Title"
                    value={100}
                    color="text-blue-600"
                    description="Test description"
                />
            );

            const valueElement = container.querySelector('.text-blue-600');
            expect(valueElement).toBeInTheDocument();
        });
    });
});