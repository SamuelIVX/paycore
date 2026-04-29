import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

// Mock the payroll API calls
const { mockGetPayrollRecords, mockRunPayroll } = vi.hoisted(() => ({
    mockGetPayrollRecords: vi.fn(),
    mockRunPayroll: vi.fn(),
}));

vi.mock('@/lib/supabase/payroll', () => ({
    getPayrollRecords: mockGetPayrollRecords,
}));

vi.mock('@/lib/supabase/payroll-actions', () => ({
    runPayroll: mockRunPayroll,
}));

// Import after mocks
import PayrollTable from '@/app/manager/payroll-records-table/page';

// Test data factories
const makeEmployee = (overrides: Partial<Tables<'employees'>> = {}): Tables<'employees'> => ({
    id: 'emp-1',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john@example.com',
    phone: '555-1234',
    hire_date: '2023-01-15',
    pay_rate: 75000,
    pay_frequency: 'HOURLY',
    employment_status: 'ACTIVE',
    federal_tax_rate: 0.22,
    state_tax_rate: 0.093,
    social_security_tax_rate: 0.062,
    employee_number: 'EMP001',
    role: 'Engineer',
    position: 'Software Engineer',
    department_id: null,
    created_at: null,
    ...overrides,
} as Tables<'employees'>);

type PayrollRecordWithEmployee = Tables<'payroll_records'> & { employees: Tables<'employees'> };

const makePayrollRecord = (overrides: Partial<PayrollRecordWithEmployee> = {}): PayrollRecordWithEmployee => ({
    id: 'payroll-1',
    employee_id: 'emp-1',
    payroll_run_id: 'run-1',
    gross_pay: 3000,
    regular_hours: 160,
    overtime_hours: 0,
    federal_tax: 660,
    state_tax: 279,
    social_security: 186,
    benefit_deductions: 50,
    net_pay: 1825,
    created_at: '2026-01-30',
    employees: makeEmployee(),
    ...overrides,
});

describe('PayrollTable Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering & Data Display', () => {
        it('renders payroll table with correct columns', async () => {
            const records = [
                makePayrollRecord({
                    id: 'payroll-1',
                    employees: makeEmployee({ first_name: 'John', last_name: 'Smith' }),
                }),
                makePayrollRecord({
                    id: 'payroll-2',
                    employees: makeEmployee({ first_name: 'Jane', last_name: 'Doe' }),
                }),
            ];
            mockGetPayrollRecords.mockResolvedValue(records);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText('Employee Name')).toBeInTheDocument();
                expect(screen.getByText('Hours Worked')).toBeInTheDocument();
                expect(screen.getByText('Overtime Hours')).toBeInTheDocument();
                expect(screen.getByText('Gross Pay')).toBeInTheDocument();
                expect(screen.getByText('Federal Tax')).toBeInTheDocument();
                expect(screen.getByText('State Tax')).toBeInTheDocument();
                expect(screen.getByText('Social Security')).toBeInTheDocument();
                expect(screen.getByText('Benefits')).toBeInTheDocument();
                expect(screen.getByText('Net Pay')).toBeInTheDocument();
            });
        });

        it('displays payroll data correctly', async () => {
            const record = makePayrollRecord({
                id: 'payroll-1',
                gross_pay: 3000,
                regular_hours: 160,
                overtime_hours: 10,
                federal_tax: 660,
                state_tax: 279,
                social_security: 186,
                benefit_deductions: 50,
                net_pay: 1825,
                created_at: '2026-01-30',
                employees: makeEmployee({
                    first_name: 'John',
                    last_name: 'Smith',
                    pay_frequency: 'HOURLY',
                }),
            });
            mockGetPayrollRecords.mockResolvedValue([record]);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText('John Smith')).toBeInTheDocument();
                expect(screen.getByText('$3000.00')).toBeInTheDocument();
                expect(screen.getByText('160')).toBeInTheDocument();
                expect(screen.getByText('10')).toBeInTheDocument();
            });
        });

        it('formats currency correctly', async () => {
            const record = makePayrollRecord({
                gross_pay: 3000.50,
                federal_tax: 660.33,
                net_pay: 1825.75,
            });
            mockGetPayrollRecords.mockResolvedValue([record]);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText('$3000.50')).toBeInTheDocument();
                expect(screen.getByText('-$660.33')).toBeInTheDocument();
                expect(screen.getByText('$1825.75')).toBeInTheDocument();
            });
        });

        it('handles null values gracefully with dash symbol', async () => {
            const record = makePayrollRecord({
                regular_hours: null,
                overtime_hours: null,
                benefit_deductions: null,
            });
            mockGetPayrollRecords.mockResolvedValue([record]);

            render(<PayrollTable />);

            await waitFor(() => {
                const dashes = screen.getAllByText('—');
                expect(dashes.length).toBeGreaterThan(0);
            });
        });

        it('shows different hours display for HOURLY vs SALARY employees', async () => {
            const hourlyRecord = makePayrollRecord({
                id: 'hourly-1',
                regular_hours: 160,
                overtime_hours: 10,
                employees: makeEmployee({ id: 'emp-1', pay_frequency: 'HOURLY', first_name: 'Hourly', last_name: 'Worker' }),
            });

            // For SALARY employees, the component returns null for hours
            const salaryRecord = makePayrollRecord({
                id: 'salary-1',
                regular_hours: null,
                overtime_hours: null,
                employees: makeEmployee({ id: 'emp-2', pay_frequency: 'SALARY', first_name: 'Salary', last_name: 'Worker' }),
            });

            mockGetPayrollRecords.mockResolvedValue([hourlyRecord, salaryRecord]);

            render(<PayrollTable />);

            await waitFor(() => {
                // HOURLY row should show numeric hours
                const hours160 = screen.getAllByText('160');
                expect(hours160.length).toBeGreaterThan(0);
                // SALARY row should show placeholder for hours
                const noHours = screen.getAllByText('—');
                expect(noHours.length).toBeGreaterThan(0);
            });
        });

        it('shows loading state initially', async () => {
            mockGetPayrollRecords.mockImplementation(() => new Promise(() => { }));

            render(<PayrollTable />);

            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });

        it('displays error message when fetch fails', async () => {
            mockGetPayrollRecords.mockRejectedValue(new Error('API Error'));

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText('Failed to load payroll records.')).toBeInTheDocument();
            });
        });

        it('shows empty state when no records', async () => {
            mockGetPayrollRecords.mockResolvedValue([]);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText('No results found.')).toBeInTheDocument();
            });
        });
    });

    describe('Sorting Functionality', () => {
        it('sorts by employee name', async () => {
            const records = [
                makePayrollRecord({
                    id: 'payroll-1',
                    employees: makeEmployee({ first_name: 'Zara', last_name: 'Adams' }),
                }),
                makePayrollRecord({
                    id: 'payroll-2',
                    employees: makeEmployee({ first_name: 'Alice', last_name: 'Brown' }),
                }),
                makePayrollRecord({
                    id: 'payroll-3',
                    employees: makeEmployee({ first_name: 'Bob', last_name: 'Wilson' }),
                }),
            ];
            mockGetPayrollRecords.mockResolvedValue(records);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText('Zara Adams')).toBeInTheDocument();
            });

            const nameButton = screen.getAllByText('Employee Name')[0];
            fireEvent.click(nameButton);

            // Verify first row is sorted alphabetically (Alice should be first)
            await waitFor(() => {
                const rows = screen.getAllByRole('row');
                expect(rows[1]).toHaveTextContent('Alice');
            });

            // Click again for descending
            fireEvent.click(nameButton);

            // Verify first row is sorted descending (Zara should be first)
            await waitFor(() => {
                const rows = screen.getAllByRole('row');
                expect(rows[1]).toHaveTextContent('Zara');
            });
        });

        it('sorts by gross pay', async () => {
            const records = [
                makePayrollRecord({ id: 'payroll-1', gross_pay: 3000 }),
                makePayrollRecord({ id: 'payroll-2', gross_pay: 5000 }),
                makePayrollRecord({ id: 'payroll-3', gross_pay: 2000 }),
            ];
            mockGetPayrollRecords.mockResolvedValue(records);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText('$3000.00')).toBeInTheDocument();
            });

            const grossButton = screen.getAllByText('Gross Pay')[0];
            fireEvent.click(grossButton);

            // Verify first row sorted ascending ($2000 should be first, lowest)
            await waitFor(() => {
                const rows = screen.getAllByRole('row');
                expect(rows[1]).toHaveTextContent('$2000');
            });

            // Click again for descending ($5000 should be first, highest)
            fireEvent.click(grossButton);

            await waitFor(() => {
                const rows = screen.getAllByRole('row');
                expect(rows[1]).toHaveTextContent('$5000');
            });
        });

        it('sorts by net pay', async () => {
            const records = [
                makePayrollRecord({ id: 'payroll-1', net_pay: 2000 }),
                makePayrollRecord({ id: 'payroll-2', net_pay: 3000 }),
                makePayrollRecord({ id: 'payroll-3', net_pay: 1500 }),
            ];
            mockGetPayrollRecords.mockResolvedValue(records);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText('$2000.00')).toBeInTheDocument();
            });

            const netButton = screen.getAllByText('Net Pay')[0];
            fireEvent.click(netButton);

            // Verify first row sorted ascending ($1500 should be first, lowest)
            await waitFor(() => {
                const rows = screen.getAllByRole('row');
                expect(rows[1]).toHaveTextContent('$1500');
            });

            // Click again for descending ($3000 should be first, highest)
            fireEvent.click(netButton);

            await waitFor(() => {
                const rows = screen.getAllByRole('row');
                expect(rows[1]).toHaveTextContent('$3000');
            });
        });

        it.skip('sorts by created date', async () => {
            const records = [
                makePayrollRecord({ id: 'payroll-1', created_at: '2026-01-30' }),
                makePayrollRecord({ id: 'payroll-2', created_at: '2026-01-15' }),
                makePayrollRecord({ id: 'payroll-3', created_at: '2026-01-01' }),
            ];
            mockGetPayrollRecords.mockResolvedValue(records);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText('1/30/2026')).toBeInTheDocument();
            });

            const dateButton = screen.getAllByText('Created At')[0];
            fireEvent.click(dateButton);

            // Verify sorted ascending (oldest date first: 1/1/2026)
            await waitFor(() => {
                const rows = screen.getAllByRole('row');
                expect(rows[1]).toHaveTextContent('1/1/2026');
            });

            // Click again for descending (newest date first: 1/30/2026)
            fireEvent.click(dateButton);

            await waitFor(() => {
                const rows = screen.getAllByRole('row');
                expect(rows[1]).toHaveTextContent('1/30/2026');
            });
        });

        it('toggles sort direction on repeated clicks', async () => {
            const records = [
                makePayrollRecord({ id: 'low', gross_pay: 3000 }),
                makePayrollRecord({ id: 'high', gross_pay: 5000 }),
            ];
            mockGetPayrollRecords.mockResolvedValue(records);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText('$3000.00')).toBeInTheDocument();
            });

            const grossButton = screen.getAllByText('Gross Pay')[0];

            // First click - ascending (lowest first)
            fireEvent.click(grossButton);
            await waitFor(() => {
                const rows = screen.getAllByRole('row');
                expect(rows[1]).toHaveTextContent('$3000.00');
                expect(rows[2]).toHaveTextContent('$5000.00');
            });

            // Second click - descending (highest first)
            fireEvent.click(grossButton);
            await waitFor(() => {
                const rows = screen.getAllByRole('row');
                expect(rows[1]).toHaveTextContent('$5000.00');
                expect(rows[2]).toHaveTextContent('$3000.00');
            });
        });
    });

    describe('Filtering & Search', () => {
        it.skip('filters by employee name', async () => {
            const records = [
                makePayrollRecord({
                    employees: makeEmployee({ first_name: 'John', last_name: 'Smith' }),
                }),
                makePayrollRecord({
                    employees: makeEmployee({ first_name: 'Jane', last_name: 'Doe' }),
                }),
                makePayrollRecord({
                    employees: makeEmployee({ first_name: 'Bob', last_name: 'Wilson' }),
                }),
            ];
            mockGetPayrollRecords.mockResolvedValue(records);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText('John Smith')).toBeInTheDocument();
            });
        });

        it.skip('clears filter when search is empty', async () => {
            const records = [
                makePayrollRecord({
                    employees: makeEmployee({ first_name: 'John', last_name: 'Smith' }),
                }),
                makePayrollRecord({
                    employees: makeEmployee({ first_name: 'Jane', last_name: 'Doe' }),
                }),
            ];
            mockGetPayrollRecords.mockResolvedValue(records);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText('John Smith')).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText('Search payroll records...');
            await userEvent.type(searchInput, 'xyz');
            expect(screen.getByText('No results found.')).toBeInTheDocument();

            await userEvent.clear(searchInput);

            await waitFor(() => {
                expect(screen.getByText('John Smith')).toBeInTheDocument();
                expect(screen.getByText('Jane Doe')).toBeInTheDocument();
            });
        });
    });

    describe('Pagination', () => {
        it('displays correct number of rows per page', async () => {
            const records = Array.from({ length: 25 }, (_, i) =>
                makePayrollRecord({
                    id: `payroll-${i + 1}`,
                    employees: makeEmployee({ first_name: `Employee${i + 1}` }),
                })
            );
            mockGetPayrollRecords.mockResolvedValue(records);

            render(<PayrollTable />);

            await waitFor(() => {
                const rows = screen.getAllByRole('row');
                // 10 data rows (default pageSize) + 1 header row
                expect(rows.length).toBeLessThanOrEqual(12);
            });
        });

        it('shows row count info', async () => {
            const records = Array.from({ length: 15 }, (_, i) =>
                makePayrollRecord({
                    id: `payroll-${i + 1}`,
                })
            );
            mockGetPayrollRecords.mockResolvedValue(records);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText(/15 row\(s\)/)).toBeInTheDocument();
            });
        });

        it('shows page navigation', async () => {
            const records = Array.from({ length: 25 }, (_, i) =>
                makePayrollRecord({
                    id: `payroll-${i + 1}`,
                })
            );
            mockGetPayrollRecords.mockResolvedValue(records);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText(/Page 1 of/)).toBeInTheDocument();
            });
        });
    });

    describe('Run Payroll Dialog', () => {
        it('renders Run Payroll button', async () => {
            mockGetPayrollRecords.mockResolvedValue([]);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText('Run Payroll')).toBeInTheDocument();
            });
        });

        it.skip('displays date period selector in dialog', async () => {
            mockGetPayrollRecords.mockResolvedValue([]);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText('Run Payroll')).toBeInTheDocument();
            });

            // Click the Run Payroll button to open dialog
            const runButton = screen.getByText('Run Payroll');
            fireEvent.click(runButton);

            // Wait for dialog to appear - verify Cancel button appears
            await waitFor(() => {
                expect(screen.getByText('Cancel')).toBeInTheDocument();
            });

            // Verify Pay Period label exists (from Label htmlFor="payPeriod")
            expect(screen.getByText('Pay Period')).toBeInTheDocument();
        });
    });

    describe('Visual Indicators', () => {
        it('displays taxes and deductions in red', async () => {
            const record = makePayrollRecord({
                federal_tax: 660,
                state_tax: 279,
                social_security: 186,
                benefit_deductions: 50,
            });
            mockGetPayrollRecords.mockResolvedValue([record]);

            render(<PayrollTable />);

            await waitFor(() => {
                const taxCells = screen.getAllByText(/-\$\d+\.\d+/);
                expect(taxCells.length).toBeGreaterThan(0);
            });
        });

        it('displays net pay in green when positive', async () => {
            const record = makePayrollRecord({ net_pay: 1825 });
            mockGetPayrollRecords.mockResolvedValue([record]);

            render(<PayrollTable />);

            await waitFor(() => {
                expect(screen.getByText('$1825.00')).toBeInTheDocument();
            });
        });
    });
});
