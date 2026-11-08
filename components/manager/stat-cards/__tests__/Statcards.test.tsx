/**
 * Vitest coverage for components/manager/stat-cards/Statcards.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ManagerStatCards, { ManagerStatCard } from '@/components/manager/stat-cards/Statcards';

describe('ManagerStatCards component', () => {
  it('renders manager stats with counts and formatted annual payroll', () => {
    render(
      <ManagerStatCards
        totalEmployees={24}
        totalAnnualPayroll={1500000}
      />
    );

    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();

    expect(screen.getByText('Pending Approvals')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    expect(screen.getByText('Total Payroll')).toBeInTheDocument();
    expect(screen.getByText('$1,500,000')).toBeInTheDocument();
  });

  it('renders dash fallback when employee count and payroll are null/undefined', () => {
    render(
      <ManagerStatCards
        totalEmployees={undefined}
        totalAnnualPayroll={undefined}
      />
    );

    const dashes = screen.getAllByText('—');
    expect(dashes).toHaveLength(2);
  });

  it('renders single ManagerStatCard correctly', () => {
    render(
      <ManagerStatCard
        title="Department Count"
        value="6"
        description="Active divisions"
        icon={<span>DeptIcon</span>}
      />
    );

    expect(screen.getByText('Department Count')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('Active divisions')).toBeInTheDocument();
  });
});
