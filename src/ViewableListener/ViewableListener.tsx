import React, { useRef, useEffect, useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import useRafState from 'react-use/esm/useRafState';
import noop from '@vlazh/ts-utils/noop';
import EventTargetListener from '@vlazh/web-utils/EventTargetListener';

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
  const [isViewable, setViewable] = useState(false);
  const [y, setY] = useRafState(window.pageYOffset);
  const rootRef = useRef<HTMLDivElement>(null);

  // Subscribe to window scroll
  useEffect(() => {
    if (!isViewable) return noop;

    const handler = (): void => {
      setY(window.pageYOffset);
    };

    const listener = new EventTargetListener(window);
    listener.on('scroll', handler, { capture: false, passive: true });

    return () => {
      listener.removeAllListeners();
    };
  }, [isViewable, setY]);

  // Detect is viewable
  useEffect(() => {
    const { current: root } = rootRef;
    if (!root) return;

    const { top } = root.getBoundingClientRect();
    const startPoint = (window.innerHeight * 2) / 3;

    if (top <= startPoint) {
      setViewable(true);
      onViewable();
    }
  }, [onViewable, y]);

  return <div ref={rootRef} className={css.root} style={style} />;
}
