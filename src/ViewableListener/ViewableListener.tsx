import React, { useRef, useEffect, useCallback } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import useRefState from '@js-toolkit/react-hooks/useRefState';
import EventTargetListener from '@js-toolkit/web-utils/EventTargetListener';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    opacity: 0,
  },
});

export interface ViewableListenerProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  onViewable: () => void;
}

export default function ViewableListener({
  onViewable,
  className,
  style,
}: ViewableListenerProps): JSX.Element {
  const css = useStyles({ classes: { root: className } });
  const rootRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [isViewable, setViewable] = useRefState(false);

  const check = useCallback(() => {
    const { current: root } = rootRef;
    if (!root) return;

    window.cancelAnimationFrame(raf.current);

    raf.current = window.requestAnimationFrame(() => {
      const { top } = root.getBoundingClientRect();
      const startPoint = (window.innerHeight * 2) / 3;

      const viewable = top <= startPoint;
      if (!isViewable() && viewable) {
        onViewable();
      }
      if (isViewable() !== viewable) {
        setViewable(viewable);
      }
    });
  }, [isViewable, onViewable, setViewable]);

  useEffect(() => {
    // Subscribe to window scroll
    const listener = new EventTargetListener(window);
    listener.on('scroll', check, { capture: false, passive: true });

    // Detect is viewable
    check();

    return () => {
      window.cancelAnimationFrame(raf.current);
      listener.removeAllListeners();
    };
  }, [check]);

  return <div ref={rootRef} className={css.root} style={style} />;
}
