import React, { useEffect, useState } from 'react';
import useIsMounted from '@jstoolkit/react-hooks/useIsMounted';

export interface SuspenseFallbackProps {
  readonly delay?: number;
  readonly onMountChanged?: (mounted: boolean) => void;
  readonly onMount?: VoidFunction;
  readonly onUnmount?: VoidFunction;
  readonly element?: React.SuspenseProps['fallback'];
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
