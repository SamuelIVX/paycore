/**
 * Vitest coverage for components/ui/navbars/external-search-navbar.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ExternalSearchNavbar } from '@/components/ui/navbars/external-search-navbar';

const mockSetTheme = vi.fn();
let mockResolvedTheme = 'light';

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    resolvedTheme: mockResolvedTheme,
    setTheme: mockSetTheme,
  }),
}));

describe('ExternalSearchNavbar component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResolvedTheme = 'light';
  });

  it('renders branding and back to login link', () => {
    render(<ExternalSearchNavbar />);

    expect(screen.getByText('PayCore')).toBeInTheDocument();
    expect(screen.getByText('Directory Search')).toBeInTheDocument();

    const backLink = screen.getByRole('link', { name: /Back to login/i });
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('toggles theme when theme toggle button is clicked', () => {
    render(<ExternalSearchNavbar />);

    const themeBtn = screen.getByRole('button', { name: 'Toggle color theme' });
    fireEvent.click(themeBtn);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('toggles from dark to light theme', () => {
    mockResolvedTheme = 'dark';
    render(<ExternalSearchNavbar />);

    const themeBtn = screen.getByRole('button', { name: 'Toggle color theme' });
    fireEvent.click(themeBtn);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
});
