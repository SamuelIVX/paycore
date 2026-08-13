/**
 * IntersectionObserver-backed in-view hook for animate-ui effects.
 */
import * as React from 'react';
import { useInView, type UseInViewOptions } from 'motion/react';

interface UseIsInViewOptions {
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
}

/**
 * Tracks whether `ref`'s element is in view (motion/react useInView).
 * When `options.inView` is falsy, always reports isInView=true (opt-out).
 * @param ref - Imperative handle target for the observed element.
 * @param options - inView gate, once, and margin forwarded to useInView.
 * @returns Local ref to attach and current isInView flag.
 * @example
 * const { ref, isInView } = useIsInView(outerRef, { inView: true, inViewOnce: true });
 */
function useIsInView<T extends HTMLElement = HTMLElement>(
  ref: React.Ref<T>,
  options: UseIsInViewOptions = {},
) {
  const { inView, inViewOnce = false, inViewMargin = '0px' } = options;
  const localRef = React.useRef<T>(null);
  React.useImperativeHandle(ref, () => localRef.current as T);
  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;
  return { ref: localRef, isInView };
}

export { useIsInView, type UseIsInViewOptions };
