/**
 * Vitest coverage for components/ui/stat-card.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatCard } from '@/components/ui/stat-card';

describe('StatCard component', () => {
  it('renders title, value, icon, and description correctly', () => {
    render(
      <StatCard
        title="Total Payroll"
        value="$125,000"
        description="+12% from last month"
        icon={<span data-testid="stat-icon">💰</span>}
        className="custom-stat-card"
        data-testid="stat-card"
      />
    );

    expect(screen.getByText('Total Payroll')).toBeInTheDocument();
    expect(screen.getByText('$125,000')).toBeInTheDocument();
    expect(screen.getByText('+12% from last month')).toBeInTheDocument();
    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
    expect(screen.getByTestId('stat-card')).toHaveClass('custom-stat-card');
    expect(screen.getByTestId('stat-card')).toHaveClass('transition-all');
    expect(screen.getByTestId('stat-card')).toHaveClass('hover:shadow-xs');
  });

  it('renders without optional icon and description', () => {
    const { container } = render(
      <StatCard
        title="Active Employees"
        value="48"
      />
    );

    expect(screen.getByText('Active Employees')).toBeInTheDocument();
    expect(screen.getByText('48')).toBeInTheDocument();
    expect(container.querySelector('.text-xs')).toBeNull();
    expect(container.querySelector('.shrink-0')).toBeNull();
  });
});
