import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { processPaystubData, COMPANY_INFO } from '@/app/employee/paystubs/utils';
import type { ProcessedPaystub, RawPaystubRow } from '@/app/employee/paystubs/types';

const { mockGetEmployeePaystubs, mockFormatPayPeriod, mockFormatPaidOn } = vi.hoisted(() => ({
    mockGetEmployeePaystubs: vi.fn(),
    mockFormatPayPeriod: vi.fn((start: string | null, end: string | null) => {
        if (start === null && end === null) return 'FALLBACK_PERIOD';
        return 'Jan 15 - Jan 28, 2026';
    }),
    mockFormatPaidOn: vi.fn((date: string | null) => {
        if (date === null) return 'FALLBACK_DATE';
        return '01/30/2026';
    }),
}));

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn(),
    }),
}));

vi.mock('@/utils/supabase/client', () => ({
    createClient: () => ({}),
}));

vi.mock('@/utils/supabase/server', () => ({
    createClient: async () => ({
        auth: { getUser: vi.fn() },
        from: vi.fn(),
    }),
}));

vi.mock('@/lib/supabase/paystubs', () => ({
    getEmployeePaystubs: mockGetEmployeePaystubs,
}));

vi.mock('@/lib/utils', () => ({
    formatPayPeriod: mockFormatPayPeriod,
    formatPaidOn: mockFormatPaidOn,
    cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
}));

vi.mock('@react-pdf/renderer', () => ({
    PDFDownloadLink: ({ children }: { children: (args: { loading: boolean }) => React.ReactNode }) => children({ loading: false }),
}));

vi.mock('@/components/employee/check-form/CheckPDF', () => ({
    CheckPDF: () => null,
}));

import PayStubsPage from '@/app/employee/paystubs/page';

const makeRawPaystubRow = (overrides: Partial<RawPaystubRow> = {}): RawPaystubRow => ({
    id: 'payroll-1',
    regular_hours: 80,
    overtime_hours: 10,
    gross_pay: 3000,
    federal_tax: 660,
    state_tax: 279,
    benefit_deductions: 50,
    social_security: 186,
    medicare: 43.50,
    net_pay: 1781.50,
    created_at: '2026-01-30T00:00:00Z',
    payroll_runs: {
        id: 'run-1',
        pay_period_start: '2026-01-15',
        pay_period_end: '2026-01-28',
        run_date: '2026-01-30',
        status: 'COMPLETED',
    },
    employees: {
        id: 'emp-1',
        pay_rate: 30,
        pay_frequency: 'HOURLY',
        first_name: 'John',
        last_name: 'Smith',
        address_line: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip_code: '94105',
        phone: '555-1234',
    },
    ytd_gross: 12000,
    ytd_federal_tax: 2640,
    ytd_state_tax: 1116,
    ytd_social_security: 744,
    ytd_medicare: 174,
    ytd_benefits: 200,
    ytd_net_pay: 7126,
    ...overrides,
});

const makeProcessedPaystub = (overrides: Partial<ProcessedPaystub> = {}): ProcessedPaystub => {
    return {
        ...processPaystubData(makeRawPaystubRow()),
        ...overrides,
    };
};

describe('PayStubsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Data Loading', () => {
        it('shows loading state initially', async () => {
            mockGetEmployeePaystubs.mockImplementation(() => new Promise(() => { }));

            render(<PayStubsPage />);

            expect(screen.getByText('Loading pay stubs...')).toBeInTheDocument();
        });

        it('displays all paystubs after loading', async () => {
            const paystubs = [
                makeRawPaystubRow({ id: 'payroll-1' }),
                makeRawPaystubRow({ id: 'payroll-2' }),
            ];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getByText('Pay Stubs')).toBeInTheDocument();
            });
        });

        it('shows empty state when no paystubs', async () => {
            mockGetEmployeePaystubs.mockResolvedValue([]);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getByText('No pay stubs found.')).toBeInTheDocument();
            });
        });

        it('shows error message when fetch fails', async () => {
            mockGetEmployeePaystubs.mockRejectedValue(new Error('API Error'));

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getByText('Unable to load pay stubs. Please try again.')).toBeInTheDocument();
            });
        });
    });

    describe('Rendering', () => {
        it('renders with title', async () => {
            mockGetEmployeePaystubs.mockResolvedValue([]);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getByText('Pay Stubs')).toBeInTheDocument();
            });
        });

        it('renders with description', async () => {
            mockGetEmployeePaystubs.mockResolvedValue([]);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getByText('View your payment history and deductions')).toBeInTheDocument();
            });
        });
    });

    describe('PayStubCard Display', () => {
        it('displays company name in card header', async () => {
            const paystubs = [makeProcessedPaystub()];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getByText(COMPANY_INFO.name)).toBeInTheDocument();
            });
        });

        it('displays net pay amount', async () => {
            const paystubs = [makeRawPaystubRow({ net_pay: 1781.50 })];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getAllByText('$1781.50')).toHaveLength(2);
            });
        });

        it('displays pay period', async () => {
            const paystubs = [makeRawPaystubRow()];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getAllByText('Jan 15 - Jan 28, 2026')).toHaveLength(2);
            });
        });

        it('displays multiple paystubs', async () => {
            const paystubs = [
                makeRawPaystubRow({ id: 'payroll-1', net_pay: 1000 }),
                makeRawPaystubRow({ id: 'payroll-2', net_pay: 2000 }),
            ];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getAllByText('$1000.00').length).toBeGreaterThan(0);
                expect(screen.getAllByText('$2000.00').length).toBeGreaterThan(0);
            });
        });
    });

    describe('Expand/Collapse Toggle', () => {
        it('first card is expanded by default', async () => {
            const paystubs = [
                makeRawPaystubRow({ id: 'payroll-1' }),
                makeRawPaystubRow({ id: 'payroll-2' }),
            ];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getAllByText('EARNINGS').length).toBeGreaterThan(0);
            });
        });

        it('expands card when header is clicked', async () => {
            const paystubs = [
                makeRawPaystubRow({ id: 'payroll-1' }),
                makeRawPaystubRow({ id: 'payroll-2' }),
            ];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getAllByText('EARNINGS').length).toBe(1);
            });

            const companyInfo = screen.getAllByText(COMPANY_INFO.name);
            const secondHeader = companyInfo[1].closest('div[role="button"]');
            if (secondHeader) {
                fireEvent.click(secondHeader);
            }

            await waitFor(() => {
                expect(screen.getAllByText('EARNINGS').length).toBe(2);
            });
        });

        it('collapses card when clicked again', async () => {
            const paystubs = [
                makeRawPaystubRow({ id: 'payroll-1' }),
            ];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getByText('EARNINGS')).toBeInTheDocument();
            });

            const header = screen.getByText(COMPANY_INFO.name).closest('div[role="button"]');
            if (header) {
                fireEvent.click(header);
            }

            await waitFor(() => {
                expect(screen.queryByText('EARNINGS')).not.toBeInTheDocument();
            });

            // Test keyboard toggle with Enter key
            if (header) {
                fireEvent.keyDown(header, { key: 'Enter', code: 'Enter' });
            }

            await waitFor(() => {
                expect(screen.getByText('EARNINGS')).toBeInTheDocument();
            });

            // Collapse with Enter key
            if (header) {
                fireEvent.keyDown(header, { key: 'Enter', code: 'Enter' });
            }

            await waitFor(() => {
                expect(screen.queryByText('EARNINGS')).not.toBeInTheDocument();
            });

            // Test keyboard toggle with Space key
            if (header) {
                fireEvent.keyDown(header, { key: ' ', code: 'Space' });
            }

            await waitFor(() => {
                expect(screen.getByText('EARNINGS')).toBeInTheDocument();
            });
        });
    });

    describe('PayStubCard Expanded Content', () => {
        it('displays employee information section', async () => {
            const paystubs = [makeRawPaystubRow({
                id: 'payroll-1',
                employees: {
                    id: 'emp-1',
                    first_name: 'John',
                    last_name: 'Smith',
                    address_line: '123 Main St',
                    city: 'San Francisco',
                    state: 'CA',
                    zip_code: '94105',
                    phone: '555-1234',
                    pay_frequency: 'HOURLY',
                    pay_rate: 30,
                },
            })];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getByText('Employee Information')).toBeInTheDocument();
                expect(screen.getByText('John Smith')).toBeInTheDocument();
            });
        });

        it('displays payment details section', async () => {
            const paystubs = [makeProcessedPaystub({
                id: 'payroll-1',
                payType: 'HOURLY',
            })];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getByText('Payment Details')).toBeInTheDocument();
                expect(screen.getByText('Pay Type:')).toBeInTheDocument();
            });
        });

        it('displays earnings section with gross pay', async () => {
            const paystubs = [makeProcessedPaystub({
                id: 'payroll-1',
                grossPay: 3000,
            })];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getByText('EARNINGS')).toBeInTheDocument();
                expect(screen.getByText('Gross Pay')).toBeInTheDocument();
            });
        });

        it('displays deductions section', async () => {
            const paystubs = [makeProcessedPaystub({
                id: 'payroll-1',
            })];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getByText('DEDUCTIONS')).toBeInTheDocument();
                expect(screen.getByText('Federal Tax')).toBeInTheDocument();
            });
        });

        it('displays net pay section', async () => {
            const paystubs = [makeProcessedPaystub({
                id: 'payroll-1',
                netPay: 1781.50,
            })];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs);

            render(<PayStubsPage />);

            await waitFor(() => {
                expect(screen.getByText('NET PAY')).toBeInTheDocument();
            });
        });

        it('displays YTD values in expanded view', async () => {
            const paystubs = [makeProcessedPaystub({
                id: 'payroll-1',
                ytdGross: 12000,
            })];
            mockGetEmployeePaystubs.mockResolvedValue(paystubs);

            render(<PayStubsPage />);

            await waitFor(() => {
                const ytdHeader = screen.getAllByText('YTD').find(el => el.tagName === 'TH');
                expect(ytdHeader).toBeInTheDocument();
            });
        });
    });
});