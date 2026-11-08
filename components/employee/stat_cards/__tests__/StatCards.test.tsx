/**
 * Vitest coverage for components/employee/stat_cards/StatCards.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EmployeeStatCards, { EmployeeStatCard } from '@/components/employee/stat_cards/StatCards';

describe('EmployeeStatCards component', () => {
  it('renders employee stat cards with hours and target values', () => {
    render(<EmployeeStatCards hoursThisWeek="37.5" weeklyTarget="40" />);

    expect(screen.getByText('Hours This Week')).toBeInTheDocument();
    expect(screen.getByText('37.5')).toBeInTheDocument();
    expect(screen.getByText('Target 40 hours')).toBeInTheDocument();

    expect(screen.getByText('Benefit Deductions')).toBeInTheDocument();
    expect(screen.getByText('$32.00')).toBeInTheDocument();

    expect(screen.getByText('Last Payment')).toBeInTheDocument();
    expect(screen.getByText('$3,125.00')).toBeInTheDocument();
  });

  it('renders individual EmployeeStatCard correctly', () => {
    render(
      <EmployeeStatCard
        title="Custom Metric"
        value="100%"
        description="Performance score"
        icon={<span>Icon</span>}
      />
    );

    expect(screen.getByText('Custom Metric')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Performance score')).toBeInTheDocument();
  });
});
