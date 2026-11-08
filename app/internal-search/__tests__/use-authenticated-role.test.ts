/**
 * Vitest coverage for app/internal-search/use-authenticated-role.
 */
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useAuthenticatedRole } from '../use-authenticated-role';
import { getAuthenticatedUserRoleAction } from '../actions';

vi.mock('../actions', () => ({
  getAuthenticatedUserRoleAction: vi.fn(),
}));

const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();
let authStateCallback: ((event: string, session: { user: { id: string } } | null) => Promise<void>) | null = null;
const mockUnsubscribe = vi.fn();

vi.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
      onAuthStateChange: (...args: unknown[]) => mockOnAuthStateChange(...args),
    },
  }),
}));

describe('useAuthenticatedRole', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authStateCallback = null;
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockOnAuthStateChange.mockImplementation((cb) => {
      authStateCallback = cb;
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
    });
  });

  it('initializes in loading state and transitions to visitor when no session', async () => {
    const { result } = renderHook(() => useAuthenticatedRole());

    // Initially loading
    expect(result.current.role).toBe('visitor');
    expect(result.current.userId).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.role).toBe('visitor');
    expect(result.current.userId).toBeNull();
  });

  it('loads role successfully when session user exists', async () => {
    mockGetSession.mockResolvedValueOnce({
      data: { session: { user: { id: 'user-123' } } },
    });
    vi.mocked(getAuthenticatedUserRoleAction).mockResolvedValueOnce('manager');

    const { result } = renderHook(() => useAuthenticatedRole());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.role).toBe('manager');
    expect(result.current.userId).toBe('user-123');
    expect(getAuthenticatedUserRoleAction).toHaveBeenCalled();
  });

  it('falls back to visitor role when getAuthenticatedUserRoleAction throws', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetSession.mockResolvedValueOnce({
      data: { session: { user: { id: 'user-fail' } } },
    });
    vi.mocked(getAuthenticatedUserRoleAction).mockRejectedValueOnce(new Error('Server action failed'));

    const { result } = renderHook(() => useAuthenticatedRole());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.role).toBe('visitor');
    expect(result.current.userId).toBeNull();
    expect(consoleError).toHaveBeenCalledWith('Error loading user role:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('updates state when onAuthStateChange fires with new session', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });
    vi.mocked(getAuthenticatedUserRoleAction).mockResolvedValue('employee');

    const { result } = renderHook(() => useAuthenticatedRole());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.role).toBe('visitor');

    await act(async () => {
      if (authStateCallback) {
        await authStateCallback('SIGNED_IN', { user: { id: 'emp-456' } });
      }
    });

    await waitFor(() => {
      expect(result.current.role).toBe('employee');
      expect(result.current.userId).toBe('emp-456');
    });
  });

  it('updates state to visitor when onAuthStateChange fires with null session', async () => {
    mockGetSession.mockResolvedValueOnce({
      data: { session: { user: { id: 'emp-789' } } },
    });
    vi.mocked(getAuthenticatedUserRoleAction).mockResolvedValue('employee');

    const { result } = renderHook(() => useAuthenticatedRole());

    await waitFor(() => {
      expect(result.current.role).toBe('employee');
    });

    await act(async () => {
      if (authStateCallback) {
        await authStateCallback('SIGNED_OUT', null);
      }
    });

    await waitFor(() => {
      expect(result.current.role).toBe('visitor');
      expect(result.current.userId).toBeNull();
    });
  });

  it('unsubscribes on unmount', () => {
    const { unmount } = renderHook(() => useAuthenticatedRole());
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
