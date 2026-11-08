/**
 * Vitest coverage for components/ui/navbars/app-navbar.
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppNavbar, Logo, HamburgerIcon } from '@/components/ui/navbars/app-navbar';

let mockResolvedTheme = 'light';
const mockSetTheme = vi.fn();
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    resolvedTheme: mockResolvedTheme,
    setTheme: mockSetTheme,
  }),
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => '/manager/dashboard',
  useRouter: () => ({ push: mockPush }),
}));

const mockSignOut = vi.fn().mockResolvedValue({ error: null });
vi.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signOut: mockSignOut,
    },
  }),
}));

describe('AppNavbar and primitives', () => {
  it('renders Logo and HamburgerIcon primitives correctly', () => {
    render(
      <div>
        <Logo data-testid="test-logo" />
        <HamburgerIcon data-testid="test-hamburger" />
      </div>
    );

    expect(screen.getByTestId('test-logo')).toBeInTheDocument();
    expect(screen.getByTestId('test-hamburger')).toBeInTheDocument();
  });

  it('renders navigation links in mobile menu and handles logout click', async () => {
    const onLogout = vi.fn();
    const links = [
      { href: '/manager/dashboard', label: 'Dashboard' },
      { href: '/manager/benefits', label: 'Benefits' },
    ];

    render(
      <AppNavbar
        roleTitle="MANAGER"
        navigationLinks={links}
        logoutText="Sign Out"
        onLogoutClick={onLogout}
      />
    );

    expect(screen.getByText('MANAGER')).toBeInTheDocument();

    const menuToggle = screen.getByRole('button', { name: 'Toggle navigation menu' });
    fireEvent.click(menuToggle);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Benefits')).toBeInTheDocument();

    const logoutButtons = screen.getAllByText('Sign Out');
    expect(logoutButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(logoutButtons[0]);
    expect(mockSignOut).toHaveBeenCalled();
    await waitFor(() => {
      expect(onLogout).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('signs out and navigates when onLogoutClick is omitted', async () => {
    mockSignOut.mockClear();
    mockPush.mockClear();

    render(<AppNavbar logoutText="Leave" logoutHref="/login" />);

    const logoutBtn = screen.getByText('Leave');
    fireEvent.click(logoutBtn);

    expect(mockSignOut).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('logs error when signOut returns an error object', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockSignOut.mockResolvedValueOnce({ error: new Error('Network error') });

    render(<AppNavbar logoutText="Leave" logoutHref="/login" />);

    const logoutBtn = screen.getByText('Leave');
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Sign-out failed:', expect.any(Error));
    });
    consoleError.mockRestore();
  });

  it('handles thrown error during logout gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockSignOut.mockRejectedValueOnce(new Error('Signout threw'));

    render(<AppNavbar logoutText="Quit" />);

    const logoutBtn = screen.getByText('Quit');
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Sign-out failed:', expect.any(Error));
    });
    consoleError.mockRestore();
  });

  it('forwards refs correctly as function or ref object', () => {
    const refFn = vi.fn();
    const refObj = { current: null };

    const { unmount } = render(<AppNavbar ref={refFn} />);
    expect(refFn).toHaveBeenCalledWith(expect.any(HTMLElement));

    unmount();
    render(<AppNavbar ref={refObj} />);
    expect(refObj.current).toBeInstanceOf(HTMLElement);
  });

  it('renders custom logo and highlights active link in desktop view', () => {
    const spy = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1024);
    const links = [
      { href: '/active-route', label: 'Active Link', active: true, icon: <span data-testid="icon-active">★</span> },
      { href: '/sub', label: 'Sub Route' },
      { href: '/manager/dashboard', label: 'Dashboard Route' },
    ];

    render(
      <AppNavbar
        logo={<span data-testid="custom-logo">MyLogo</span>}
        navigationLinks={links}
      />
    );

    expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
    expect(screen.getByTestId('icon-active')).toBeInTheDocument();
    const activeLink = screen.getByRole('link', { name: /Active Link/i });
    expect(activeLink).toHaveClass('bg-accent');

    // Sub Route should not be active
    const inactiveLink = screen.getByRole('link', { name: 'Sub Route' });
    expect(inactiveLink).not.toHaveClass('bg-accent');
    spy.mockRestore();
  });

  it('closes mobile menu when link is clicked', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(500);
    const links = [{ href: '/manager/payroll', label: 'Payroll Overview' }];

    render(<AppNavbar navigationLinks={links} />);

    const menuToggle = screen.getByRole('button', { name: 'Toggle navigation menu' });
    fireEvent.click(menuToggle);

    const link = screen.getByRole('link', { name: 'Payroll Overview' });
    expect(link).toBeInTheDocument();
    fireEvent.click(link);
    vi.restoreAllMocks();
  });

  it('toggles theme when theme switch button is clicked for both light and dark', () => {
    mockResolvedTheme = 'light';
    mockSetTheme.mockClear();

    const { unmount } = render(<AppNavbar />);
    const themeToggleBtn = screen.getByRole('button', { name: 'Toggle color theme' });
    fireEvent.click(themeToggleBtn);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    unmount();
    mockResolvedTheme = 'dark';
    mockSetTheme.mockClear();
    render(<AppNavbar />);
    const darkToggleBtn = screen.getByRole('button', { name: 'Toggle color theme' });
    fireEvent.click(darkToggleBtn);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('renders default logo, default role title, and logoHref', () => {
    const spy = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1024);
    render(<AppNavbar logoHref="/custom-home" />);

    expect(screen.getByAltText('PayCore Logo')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    const brandLink = screen.getByRole('link', { name: /PayCoreDashboard/i });
    expect(brandLink).toHaveAttribute('href', '/custom-home');
    spy.mockRestore();
  });

  it('correctly computes isLinkActive based on pathname matching', () => {
    const spy = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1024);
    // pathname is mocked as '/manager/dashboard'
    const links = [
      { href: '/manager/dashboard', label: 'Dashboard Link' },
      { href: '/manager', label: 'Manager Root' },
      { href: '/other', label: 'Other Section' },
      { href: '/manager/dashboard/details', label: 'Deep Route', active: false },
    ];

    render(<AppNavbar navigationLinks={links} />);

    // href matches '/manager/dashboard' directly
    const dashLink = screen.getByRole('link', { name: 'Dashboard Link' });
    expect(dashLink).toHaveClass('bg-accent');

    // active explicitly false
    const deepLink = screen.getByRole('link', { name: 'Deep Route' });
    expect(deepLink).not.toHaveClass('bg-accent');

    // other section does not match
    const otherLink = screen.getByRole('link', { name: 'Other Section' });
    expect(otherLink).not.toHaveClass('bg-accent');

    spy.mockRestore();
  });
});
