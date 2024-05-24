import React from 'react';
import styled from '@mui/system/styled';
import throttleFn from 'lodash.throttle';

export interface ViewableListenerProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  /** Visibility part to detect state as viewable. */
  visiblePart?: boolean | number | undefined;
  throttle?: number | undefined;
  documentVisibility?: boolean | undefined;
  onChange: (viewable: boolean) => void;
}

export default styled(function ViewableListener({
  visiblePart: visiblePartProp = 0.8,
  throttle = 200,
  documentVisibility = true,
  onChange,
  ...rest
}: ViewableListenerProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const { current: root } = rootRef;
    if (!root) return undefined;

    const visiblePart = +visiblePartProp;
    let raf = 0;
    let lastViewable: boolean | undefined;
    let lastDocumentViewable = document.visibilityState === 'visible';

    const check = (): void => {
      if (documentVisibility && document.visibilityState !== 'visible') return;
      raf = window.requestAnimationFrame(() => {
        const { top, bottom, height } = root.getBoundingClientRect();
        const visibleHeight = height * visiblePart;
        const bottomPos = top + visibleHeight;
        const viewable = window.innerHeight >= bottomPos && bottom > visibleHeight;
        // console.log(bottomPos, top, bottom, visibleHeight, viewable);
        if (lastViewable !== viewable) {
          lastViewable = viewable;
          onChange(viewable);
        }
      });
    };

    const checkDocumentVisibility = (): void => {
      const viewable = document.visibilityState === 'visible';
      if (lastDocumentViewable !== viewable) {
        lastDocumentViewable = viewable;
        // Check if visible on page
        if (viewable && visiblePart > 0) {
          // Always re-check, the page size may be changed or something else.
          lastViewable = undefined;
          check();
        }
        // Hidden tab
        else if (visiblePart <= 0 || lastViewable !== viewable) {
          onChange(viewable);
        }
      }
    };

    const handler = throttle && throttle > 0 ? throttleFn(check, throttle) : check;

    if (visiblePart > 0) {
      window.addEventListener('scroll', handler, { capture: false, passive: true });
      check();
    }

    if (documentVisibility) {
      document.addEventListener('visibilitychange', checkDocumentVisibility);
      checkDocumentVisibility();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', handler, { capture: false });
      document.removeEventListener('visibilitychange', checkDocumentVisibility);
    };
  }, [documentVisibility, onChange, throttle, visiblePartProp]);

  return <div ref={rootRef} {...rest} />;
})({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  opacity: 0,
  visibility: 'hidden',
});
