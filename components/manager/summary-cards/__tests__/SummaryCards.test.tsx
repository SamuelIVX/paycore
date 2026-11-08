/**
 * Vitest coverage for components/manager/summary-cards/SummaryCards.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SummaryCards, { BenefitSummaryCard } from '@/components/manager/summary-cards/SummaryCards';

describe('SummaryCards component', () => {
  it('renders summary cards with counts and formatted deductions', () => {
    render(
      <SummaryCards
        companyBenefitsCount={5}
        optionalBenefitsCount={8}
        avgDeductions={150}
      />
    );

    expect(screen.getByText('Company Benefits')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    expect(screen.getByText('Optional Benefits')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();

    expect(screen.getByText('Average Monthly Deductions')).toBeInTheDocument();
    expect(screen.getByText('$150')).toBeInTheDocument();
  });

  it('renders dash fallback when values are undefined or null', () => {
    render(
      <SummaryCards
        companyBenefitsCount={undefined}
        optionalBenefitsCount={undefined}
        avgDeductions={undefined}
      />
    );

    const dashes = screen.getAllByText('—');
    expect(dashes).toHaveLength(3);
  });

  it('formats zero average deductions correctly', () => {
    render(
      <SummaryCards
        companyBenefitsCount={0}
        optionalBenefitsCount={0}
        avgDeductions={0}
      />
    );

    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  it('renders single BenefitSummaryCard correctly', () => {
    render(
      <BenefitSummaryCard
        title="Custom Metric"
        count={42}
        description="Active users"
        icon={<span>Icon</span>}
      />
    );

    expect(screen.getByText('Custom Metric')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Active users')).toBeInTheDocument();
  });
});
