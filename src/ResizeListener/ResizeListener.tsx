import React, { useEffect, useMemo, useRef } from 'react';

export interface Size {
  width: number;
  height: number;
}

export interface ResizeListenerProps {
  onSizeChange: (size: Size) => void;
}

export default function ResizeListener({ onSizeChange }: ResizeListenerProps): JSX.Element {
  const style = useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'transparent',
      border: 'none',
      visibility: 'hidden',
      zIndex: -1,
    }),
    []
  );

  const rootRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const { current: root } = rootRef;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    if (!root) return () => {};

    const resizeHandler = (): void => {
      onSizeChange({ width: root.offsetWidth, height: root.offsetHeight });
    };

    const setupWindow = (windowToListenOn: Window): void => {
      windowToListenOn.addEventListener('resize', resizeHandler);
    };

    const loadHandler = (): void => {
      root.contentWindow && setupWindow(root.contentWindow);
    };

    if (root.contentWindow) {
      setupWindow(root.contentWindow);
    } else {
      root.addEventListener('load', loadHandler, { once: true });
    }

    return () => {
      root.removeEventListener('load', loadHandler);
      root.contentWindow && root.contentWindow.removeEventListener('resize', resizeHandler);
    };
  }, [onSizeChange]);

  // eslint-disable-next-line jsx-a11y/iframe-has-title
  return <iframe ref={rootRef} style={style} />;
}
