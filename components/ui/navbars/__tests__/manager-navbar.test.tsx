/**
 * Vitest coverage for components/ui/navbars/manager-navbar.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ManagerNavbar, Logo, HamburgerIcon } from '@/components/ui/navbars/manager-navbar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/manager/dashboard',
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

describe('ManagerNavbar component', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1024);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders default manager navigation links and role title', () => {
    render(<ManagerNavbar />);

    expect(screen.getByText('Manager Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Employees')).toBeInTheDocument();
    expect(screen.getByText('Payroll')).toBeInTheDocument();
    expect(screen.getByText('Benefits')).toBeInTheDocument();
  });

  it('allows overriding default props like roleTitle and logoHref', () => {
    const customLinks = [{ href: '/custom', label: 'Custom Link' }];
    render(
      <ManagerNavbar
        roleTitle="Executive Portal"
        logoHref="/exec"
        navigationLinks={customLinks}
      />
    );

    expect(screen.getByText('Executive Portal')).toBeInTheDocument();
    expect(screen.getByText('Custom Link')).toBeInTheDocument();
  });

  it('renders correctly in mobile view when toggle is clicked', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(500);
    render(<ManagerNavbar />);

    const menuToggle = screen.getByRole('button', { name: 'Toggle navigation menu' });
    fireEvent.click(menuToggle);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Employees')).toBeInTheDocument();
  });

  it('exports Logo and HamburgerIcon primitives', () => {
    expect(Logo).toBeDefined();
    expect(HamburgerIcon).toBeDefined();
  });
});
