import React from 'react';
import throttleFn from 'lodash.throttle';
import type { Size } from '@js-toolkit/utils/types/utils';
import HiddenIFrame from '../HiddenIFrame';

export interface ResizeListenerProps {
  throttle?: number | undefined;
  onlyWidth?: boolean | undefined;
  onlyHeight?: boolean | undefined;
  onSizeChange: (size: Size, domRect: DOMRect) => void;
}

/**
 * If used inside iframe with `sandbox` it needs to allow `allow-same-origin`.
 */
export default function ResizeListener({
  throttle,
  onlyWidth,
  onlyHeight,
  onSizeChange,
}: ResizeListenerProps): JSX.Element {
  const rootRef = React.useRef<HTMLIFrameElement>(null);
  const lastRectRef = React.useRef<DOMRect>();

  React.useEffect(() => {
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

    const handler = throttle && throttle > 0 ? throttleFn(resizeHandler, throttle) : resizeHandler;

    const setupWindow = (windowToListenOn: Window): void => {
      windowToListenOn.addEventListener('resize', handler, { passive: true });
      resizeHandler();
    };

    const loadHandler = (): void => {
      if (root.contentWindow) setupWindow(root.contentWindow);
    };

    if (root.contentWindow) {
      loadHandler();
    } else {
      root.addEventListener('load', loadHandler, { once: true });
    }

    return () => {
      root.removeEventListener('load', loadHandler);
      if (root.contentWindow) root.contentWindow.removeEventListener('resize', handler);
      lastRectRef.current = undefined;
    };
  }, [onSizeChange, onlyHeight, onlyWidth, throttle]);

  return <HiddenIFrame ref={rootRef} />;
}
