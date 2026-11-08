/**
 * Vitest coverage for components/manager/dialogs/add-employee-dialog.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AddEmployeeDialog } from '@/components/manager/dialogs/add-employee-dialog';

const mockHandleAddEmployee = vi.fn();
const mockSetOpen = vi.fn();
const mockSetFirstName = vi.fn();
const mockSetLastName = vi.fn();
const mockSetPosition = vi.fn();
const mockSetPayRate = vi.fn();

let mockLoading = false;
let mockOpen = true;
let mockFirstName = 'Jane';
let mockLastName = 'Doe';
let mockPayFrequency = 'HOURLY';
let mockPayRate = 60000;

vi.mock('@/hooks/use-add-employee', () => ({
  useAddEmployee: () => ({
    firstName: mockFirstName,
    setFirstName: mockSetFirstName,
    lastName: mockLastName,
    setLastName: mockSetLastName,
    position: 'Engineer',
    setPosition: mockSetPosition,
    payFrequency: mockPayFrequency,
    setPayFrequency: vi.fn(),
    payRate: mockPayRate,
    setPayRate: mockSetPayRate,
    loading: mockLoading,
    open: mockOpen,
    setOpen: mockSetOpen,
    handleAddEmployee: mockHandleAddEmployee,
  }),
}));

describe('AddEmployeeDialog component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoading = false;
    mockOpen = true;
    mockFirstName = 'Jane';
    mockLastName = 'Doe';
    mockPayFrequency = 'HOURLY';
    mockPayRate = 60000;
  });

  it('renders form inputs and handles changes', () => {
    render(<AddEmployeeDialog trigger={<button>Open</button>} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add New Employee')).toBeInTheDocument();

    const firstNameInput = screen.getByLabelText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'Alice' } });
    expect(mockSetFirstName).toHaveBeenCalledWith('Alice');

    const lastNameInput = screen.getByLabelText('Last Name');
    fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
    expect(mockSetLastName).toHaveBeenCalledWith('Smith');

    const positionInput = screen.getByLabelText('Position');
    fireEvent.change(positionInput, { target: { value: 'Manager' } });
    expect(mockSetPosition).toHaveBeenCalledWith('Manager');

    const payRateInput = screen.getByLabelText('Pay Rate');
    fireEvent.change(payRateInput, { target: { value: '80000' } });
    expect(mockSetPayRate).toHaveBeenCalledWith(80000);
  });

  it('submits successfully and calls onSuccess callback', async () => {
    mockHandleAddEmployee.mockResolvedValue(true);
    const onSuccess = vi.fn();

    render(<AddEmployeeDialog onSuccess={onSuccess} />);

    const submitBtn = screen.getByRole('button', { name: 'Add Employee' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockHandleAddEmployee).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('does not invoke onSuccess when handleAddEmployee fails', async () => {
    mockHandleAddEmployee.mockResolvedValue(false);
    const onSuccess = vi.fn();

    render(<AddEmployeeDialog onSuccess={onSuccess} />);

    const submitBtn = screen.getByRole('button', { name: 'Add Employee' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockHandleAddEmployee).toHaveBeenCalledTimes(1);
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  it('disables submit button when required form fields are missing or invalid', () => {
    mockFirstName = '   ';
    render(<AddEmployeeDialog />);

    const submitBtn = screen.getByRole('button', { name: 'Add Employee' });
    expect(submitBtn).toBeDisabled();
    fireEvent.click(submitBtn);
    expect(mockHandleAddEmployee).not.toHaveBeenCalled();
  });

  it('shows loading state and disables submit button when loading', () => {
    mockLoading = true;
    render(<AddEmployeeDialog />);

    const submitBtn = screen.getByRole('button', { name: 'Adding...' });
    expect(submitBtn).toBeDisabled();
  });
});
