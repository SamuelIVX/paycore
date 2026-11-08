/**
 * Vitest coverage for components/ui/navbars/app-navbar.
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppNavbar, Logo, HamburgerIcon } from '@/components/ui/navbars/app-navbar';

const mockSetTheme = vi.fn();
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
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

  it('toggles theme when theme switch button is clicked', () => {
    render(<AppNavbar />);

    const themeToggleBtn = screen.getByRole('button', { name: 'Toggle color theme' });
    expect(themeToggleBtn).toBeInTheDocument();

    fireEvent.click(themeToggleBtn);
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    const updater = mockSetTheme.mock.calls[0][0];
    if (typeof updater === 'function') {
      expect(updater('light')).toBe('dark');
      expect(updater('dark')).toBe('light');
    }
  });
});
