/**
 * Vitest coverage for components/manager/dialogs/run-payroll-dialog.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { RunPayrollDialog } from '@/components/manager/dialogs/run-payroll-dialog';

describe('RunPayrollDialog component', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  });
  it('renders with custom trigger and opens dialog on click', () => {
    render(<RunPayrollDialog trigger={<button>Custom Trigger</button>} />);

    const trigger = screen.getByText('Custom Trigger');
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Process payroll for selected period')).toBeInTheDocument();
    expect(screen.getByLabelText('Pay Period')).toBeInTheDocument();

    const disabledBtn = screen.getByRole('button', { name: /Select Period to Run/i });
    expect(disabledBtn).toBeDisabled();
  });

  it('renders default Run Payroll trigger button', () => {
    render(<RunPayrollDialog />);

    const defaultBtn = screen.getByRole('button', { name: /Run Payroll/i });
    expect(defaultBtn).toBeInTheDocument();
  });

  it('selects pay period and enables the link button', async () => {
    render(<RunPayrollDialog trigger={<button>Open</button>} />);
    fireEvent.click(screen.getByText('Open'));

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const option = await screen.findByRole('option', { name: 'Jan 1 - Jan 14, 2026' });
    fireEvent.click(option);

    const link = screen.getByRole('link', { name: /Run Payroll/i });
    expect(link).toHaveAttribute(
      'href',
      '/manager/payroll-status?startDate=2026-01-01&endDate=2026-01-14'
    );

    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('button', { name: /Select Period to Run/i })).toBeDisabled();
  });
});
