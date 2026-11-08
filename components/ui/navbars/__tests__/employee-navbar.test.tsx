/**
 * Vitest coverage for components/ui/navbars/employee-navbar.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { EmployeeNavbar, Logo, HamburgerIcon } from '@/components/ui/navbars/employee-navbar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/employee/dashboard',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    resolvedTheme: 'light',
    setTheme: vi.fn(),
  }),
}));

vi.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  }),
}));

describe('EmployeeNavbar component', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1024);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders default employee navigation links and role title', () => {
    render(<EmployeeNavbar />);

    expect(screen.getByText('Employee Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Benefits')).toBeInTheDocument();
    expect(screen.getByText('Pay Stubs')).toBeInTheDocument();
  });

  it('allows overriding default props like roleTitle and navigationLinks', () => {
    const customLinks = [{ href: '/staff-custom', label: 'Staff Perks' }];
    render(
      <EmployeeNavbar
        roleTitle="Staff Portal"
        logoHref="/staff"
        navigationLinks={customLinks}
      />
    );

    expect(screen.getByText('Staff Portal')).toBeInTheDocument();
    expect(screen.getByText('Staff Perks')).toBeInTheDocument();
  });

  it('renders correctly in mobile view when toggle is clicked', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(500);
    render(<EmployeeNavbar />);

    const menuToggle = screen.getByRole('button', { name: 'Toggle navigation menu' });
    fireEvent.click(menuToggle);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Benefits')).toBeInTheDocument();
  });

  it('exports Logo and HamburgerIcon primitives', () => {
    expect(Logo).toBeDefined();
    expect(HamburgerIcon).toBeDefined();
  });
});
