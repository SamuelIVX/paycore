/**
 * Controlled/uncontrolled state helper (prop value + onChange vs internal state).
 */
import * as React from 'react';

interface CommonControlledStateProps<T> {
  /** Passing the `value` prop makes the state controlled, even when the value is `undefined`. */
  value?: T;
  defaultValue?: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * Hook: use Controlled State.
 */
export function useControlledState<T, Rest extends any[] = []>(
  props: CommonControlledStateProps<T> & {
    onChange?: (value: T, ...args: Rest) => void;
  },
): readonly [T, (next: T, ...args: Rest) => void] {
  const { value, defaultValue, onChange } = props;
  const isControlled = Object.prototype.hasOwnProperty.call(props, 'value');

  const [uncontrolledState, setInternalState] = React.useState<T>(
    () => defaultValue as T,
  );
  const state = (isControlled ? value : uncontrolledState) as T;

  const setState = React.useCallback(
    (next: T, ...args: Rest) => {
      if (!isControlled) setInternalState(next);
      onChange?.(next, ...args);
    },
    [isControlled, onChange],
  );

  return [state, setState] as const;
}
