import React, { useEffect, useState } from 'react';
import useIsMounted from '@js-toolkit/react-hooks/useIsMounted';

export interface SuspenseFallbackProps {
  readonly delay?: number | undefined;
  readonly onMountChanged?: ((mounted: boolean) => void) | undefined;
  readonly onMount?: VoidFunction | undefined;
  readonly onUnmount?: VoidFunction | undefined;
  readonly element?: React.SuspenseProps['fallback'] | undefined;
}

export default function SuspenseFallback({
  delay,
  onMountChanged,
  onMount,
  onUnmount,
  element,
}: SuspenseFallbackProps): JSX.Element | null {
  const [isCanRender, setCanRender] = useState(delay == null || delay <= 0);

  const isMounted = useIsMounted();

  useEffect(() => {
    const timer =
      delay != null && delay > 0 ? window.setTimeout(() => setCanRender(true), delay) : undefined;

    return () => {
      window.clearTimeout(timer);
    };
  }, [delay]);

  useEffect(() => {
    if (isCanRender) {
      onMountChanged && onMountChanged(true);
      onMount && onMount();
    }

    return () => {
      if (isCanRender || !isMounted()) {
        onMountChanged && onMountChanged(false);
        onUnmount && onUnmount();
      }
    };
  }, [isCanRender, isMounted, onMount, onMountChanged, onUnmount]);

  return (isCanRender && (element as JSX.Element)) || null;
}
