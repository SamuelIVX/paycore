/**
 * Vitest coverage for components/manager/grid-content/grid-cards.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import PayrollTrendChart, { description as payrollChartDescription } from '@/components/manager/grid-content/grid-cards/payroll-chart';
import QuickActionCard from '@/components/manager/grid-content/grid-cards/quick-actions-card';
import RecentActivityCard from '@/components/manager/grid-content/grid-cards/recent-activity';
import UpcomingTasksCard, { TaskCard } from '@/components/manager/grid-content/grid-cards/upcoming-tasks';

vi.mock('@/hooks/use-add-employee', () => ({
  useAddEmployee: () => ({
    firstName: '',
    setFirstName: vi.fn(),
    lastName: '',
    setLastName: vi.fn(),
    position: '',
    setPosition: vi.fn(),
    payFrequency: '',
    setPayFrequency: vi.fn(),
    payRate: 0,
    setPayRate: vi.fn(),
    loading: false,
    open: false,
    setOpen: vi.fn(),
    handleAddEmployee: vi.fn(),
  }),
}));

describe('Manager Grid Cards', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
    global.ResizeObserver = class {
      callback?: unknown;
      constructor(callback?: unknown) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  });

  describe('PayrollTrendChart', () => {
    it('renders card title and description and exports description constant', () => {
      render(<PayrollTrendChart />);
      expect(screen.getByText('Payroll Trend')).toBeInTheDocument();
      expect(screen.getByText('Monthly payroll expenditures over 6 months (in $k)')).toBeInTheDocument();
      expect(payrollChartDescription).toBe('A line chart showing monthly payroll trends');
    });
  });

  describe('QuickActionCard', () => {
    it('renders all 4 quick action buttons and links', () => {
      render(<QuickActionCard />);
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Common payroll management tasks')).toBeInTheDocument();
      expect(screen.getByText('Add Employee')).toBeInTheDocument();
      expect(screen.getByText('Run Payroll')).toBeInTheDocument();
      expect(screen.getByText('Approve Payroll')).toBeInTheDocument();
      expect(screen.getByText('View Benefits')).toBeInTheDocument();

      const approveLink = screen.getByRole('link', { name: /Approve Payroll/i });
      expect(approveLink).toHaveAttribute('href', '/manager/payroll-records-table');

      const benefitsLink = screen.getByRole('link', { name: /View Benefits/i });
      expect(benefitsLink).toHaveAttribute('href', '/manager/benefits');
    });
  });

  describe('RecentActivityCard', () => {
    it('renders latest payroll records with employee names, net pay, badges, and view all link', () => {
      render(<RecentActivityCard />);
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      expect(screen.getByText('Latest payroll records')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Mike Chen')).toBeInTheDocument();

      expect(screen.getByText(/Net Pay: \$5,280\.50/i)).toBeInTheDocument();
      expect(screen.getByText(/Net Pay: \$5,892\.50/i)).toBeInTheDocument();
      expect(screen.getByText(/Net Pay: \$4,687\.50/i)).toBeInTheDocument();

      expect(screen.getAllByText('pending').length).toBe(2);
      expect(screen.getByText('approved')).toBeInTheDocument();

      const viewAllLink = screen.getByRole('link', { name: /View All/i });
      expect(viewAllLink).toHaveAttribute('href', '/manager/payroll-records-table');
    });
  });

  describe('UpcomingTasksCard and TaskCard', () => {
    it('renders upcoming tasks list with task details', () => {
      render(<UpcomingTasksCard />);
      expect(screen.getByText('Upcoming Deadlines')).toBeInTheDocument();
      expect(screen.getByText('Important dates and compliance tasks')).toBeInTheDocument();
      expect(screen.getByText('Payroll Submission')).toBeInTheDocument();
      expect(screen.getByText('Due: February 15, 2026')).toBeInTheDocument();
      expect(screen.getByText('Tax Filing Deadline')).toBeInTheDocument();
      expect(screen.getByText('Benefits Open Enrollment')).toBeInTheDocument();
    });

    it('renders individual TaskCard correctly', () => {
      render(
        <TaskCard
          title="Audit Review"
          description="Due: Tomorrow"
          icon={<span data-testid="task-icon">📋</span>}
        />
      );
      expect(screen.getByText('Audit Review')).toBeInTheDocument();
      expect(screen.getByText('Due: Tomorrow')).toBeInTheDocument();
      expect(screen.getByTestId('task-icon')).toBeInTheDocument();
      expect(screen.getByText('Upcoming')).toBeInTheDocument();
    });
  });
});
