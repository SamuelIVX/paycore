/**
 * Vitest coverage for hooks.
 */
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useControlledState } from '@/hooks/use-controlled-state';

describe('useControlledState', () => {
  it('preserves a function-valued defaultValue as state', () => {
    const defaultValue = () => 'default';

    const { result } = renderHook(() =>
      useControlledState<() => string>({ defaultValue }),
    );

    expect(result.current[0]).toBe(defaultValue);
  });

  it('treats value={undefined} as controlled when the value prop is present', () => {
    const onChange = vi.fn();

    const { result } = renderHook(() =>
      useControlledState<string | undefined>({ value: undefined, defaultValue: 'fallback', onChange }),
    );

    expect(result.current[0]).toBeUndefined();

    act(() => {
      result.current[1]('next');
    });

    expect(result.current[0]).toBeUndefined();
    expect(onChange).toHaveBeenCalledWith('next');
  });

  it('updates state internally when uncontrolled and calls onChange if provided', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControlledState<string, [number]>({ defaultValue: 'initial', onChange }),
    );

    expect(result.current[0]).toBe('initial');

    act(() => {
      result.current[1]('updated', 42);
    });

    expect(result.current[0]).toBe('updated');
    expect(onChange).toHaveBeenCalledWith('updated', 42);
  });

  it('works when uncontrolled without an onChange handler', () => {
    const { result } = renderHook(() =>
      useControlledState<number>({ defaultValue: 10 }),
    );

    expect(result.current[0]).toBe(10);
    act(() => {
      result.current[1](20);
    });
    expect(result.current[0]).toBe(20);
  });

  it('forwards rest parameters in controlled mode', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControlledState<string, [string, boolean]>({ value: 'fixed', onChange }),
    );

    expect(result.current[0]).toBe('fixed');
    act(() => {
      result.current[1]('new-val', 'meta', true);
    });
    expect(onChange).toHaveBeenCalledWith('new-val', 'meta', true);
    expect(result.current[0]).toBe('fixed');
  });
});
