/**
 * Vitest coverage for hooks.
 */
import { renderHook } from '@testing-library/react';
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

    result.current[1]('next');

    expect(result.current[0]).toBeUndefined();
    expect(onChange).toHaveBeenCalledWith('next');
  });
});
