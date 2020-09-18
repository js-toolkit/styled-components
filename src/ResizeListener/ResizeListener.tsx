import React, { useEffect, useMemo, useRef } from 'react';

export interface Size {
  width: number;
  height: number;
}

export interface ResizeListenerProps {
  onlyWidth?: boolean;
  onlyHeight?: boolean;
  onSizeChange: (size: Size, domRect: DOMRect) => void;
}

export default function ResizeListener({
  onlyWidth,
  onlyHeight,
  onSizeChange,
}: ResizeListenerProps): JSX.Element {
  const style = useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'transparent',
      border: 'none',
      // Must be visible for FireFox.
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1295245
      visibility: 'visible',
      opacity: 0,
      zIndex: -1,
    }),
    []
  );

  const rootRef = useRef<HTMLIFrameElement>(null);
  const lastRectRef = useRef<DOMRect>();

  useEffect(() => {
    const { current: root } = rootRef;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    if (!root) return () => {};

    const resizeHandler = (): void => {
      const checkWidth = onlyWidth == null ? !onlyHeight : onlyWidth;
      const checkHeight = onlyHeight == null ? !onlyWidth : onlyHeight;
      const nextRect = root.getBoundingClientRect();
      const { current: prevRect } = lastRectRef;
      if (prevRect) {
        if (
          checkWidth &&
          checkHeight &&
          prevRect.width === nextRect.width &&
          prevRect.height === nextRect.height
        )
          return;
        if (checkWidth && !checkHeight && prevRect.width === nextRect.width) return;
        if (checkHeight && !checkWidth && prevRect.height === nextRect.height) return;
      }
      lastRectRef.current = nextRect;
      onSizeChange({ width: root.offsetWidth, height: root.offsetHeight }, nextRect);
    };

    const setupWindow = (windowToListenOn: Window): void => {
      windowToListenOn.addEventListener('resize', resizeHandler, { passive: true });
      resizeHandler();
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
      lastRectRef.current = undefined;
    };
  }, [onSizeChange, onlyHeight, onlyWidth]);

  // eslint-disable-next-line jsx-a11y/iframe-has-title
  return <iframe ref={rootRef} style={style} />;
}
