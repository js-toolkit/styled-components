import React, { useEffect, useRef } from 'react';
import type { Size } from '@js-toolkit/utils/types/utils';
import HiddenIFrame from '../HiddenIFrame';

export interface ResizeListenerProps {
  onlyWidth?: boolean | undefined;
  onlyHeight?: boolean | undefined;
  onSizeChange: (size: Size, domRect: DOMRect) => void;
}

/**
 * If used inside iframe with `sandbox` it needs to allow `allow-same-origin`.
 */
export default function ResizeListener({
  onlyWidth,
  onlyHeight,
  onSizeChange,
}: ResizeListenerProps): JSX.Element {
  const rootRef = useRef<HTMLIFrameElement>(null);
  const lastRectRef = useRef<DOMRect>();

  useEffect(() => {
    const { current: root } = rootRef;
    if (!root) return undefined;

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

  return <HiddenIFrame ref={rootRef} />;
}
