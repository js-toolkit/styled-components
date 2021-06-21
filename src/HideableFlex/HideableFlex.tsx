import React, { useEffect, useLayoutEffect } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Flex, DefaultComponentType, FlexAllProps } from 'reflexy';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import useUpdateState from '@js-toolkit/react-hooks/useUpdateState';
import useIsFirstMount from '@js-toolkit/react-hooks/useIsFirstMount';

const useStyles = makeStyles({
  root: ({
    hidden,
    collapsable,
    transitionDuration = '0.2s',
    transitionTimingFunction = 'ease',
  }: Pick<
    HideableFlexProps,
    'hidden' | 'collapsable' | 'transitionDuration' | 'transitionTimingFunction'
  >) => {
    if (hidden) {
      return {
        pointerEvents: 'none',
        visibility: 'hidden',
        opacity: 0,
        maxHeight: collapsable ? 0 : undefined,
        transition: `visibility 0.1ms ${transitionTimingFunction} ${transitionDuration}, max-height ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`,
      };
    }
    return {
      visibility: 'visible',
      opacity: 1,
      maxHeight: collapsable ? '100vh' : undefined,
      transition: `visibility 0.1ms ${transitionTimingFunction} 0s, max-height ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`,
    };
  },
});

export type HideableFlexProps<C extends React.ElementType = DefaultComponentType> = FlexAllProps<
  C,
  true
> &
  Pick<React.CSSProperties, 'transitionDuration' | 'transitionTimingFunction'> & {
    hidden?: boolean;
    disposable?: boolean;
    collapsable?: boolean;
    keepChildren?: boolean;
    mountWithTransition?: boolean;
    hiddenClassName?: string;
    onHidden?: VoidFunction;
    onShown?: VoidFunction;
  };

export default function HideableFlex<C extends React.ElementType = DefaultComponentType>({
  hidden: hiddenProp,
  disposable,
  collapsable,
  keepChildren,
  mountWithTransition = true,
  className,
  hiddenClassName,
  transitionDuration,
  transitionTimingFunction,
  onHidden,
  onShown,
  ...rest
}: HideableFlexProps<C>): JSX.Element | null {
  const { onTransitionEnd, children: childrenProp } = rest as React.HTMLAttributes<Element>;

  const isFirstMount = useIsFirstMount();

  const [getState, setState] = useUpdateState({
    hidden: mountWithTransition ? true : hiddenProp,
    disposed: disposable ? !!hiddenProp || mountWithTransition : false,
    lastChildren: childrenProp,
  });

  // Sync state with prop
  useLayoutEffect(() => {
    if (isFirstMount()) return;
    setState((prev) => ({
      ...prev,
      hidden: hiddenProp,
      // Restore if not hidden
      disposed: disposable && !hiddenProp ? false : prev.disposed,
    }));
  }, [disposable, hiddenProp, isFirstMount, setState]);

  // Immediatly show after first render to activate transition
  useEffect(() => {
    if (mountWithTransition && !hiddenProp) {
      setState((prev) => ({ ...prev, hidden: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transitionEndHandler = useRefCallback<React.TransitionEventHandler>((event) => {
    onTransitionEnd && onTransitionEnd(event);
    if (disposable && event.propertyName === 'visibility') {
      const { hidden, disposed } = getState();
      if (hidden && !disposed) setState((prev) => ({ ...prev, disposed: true }));
      else if (!hidden && disposed) setState((prev) => ({ ...prev, disposed: false }));
    }
    if (event.propertyName === 'opacity') {
      if (getState().hidden) {
        keepChildren && setState((prev) => ({ ...prev, lastChildren: undefined }));
        onHidden && onHidden();
      } else {
        keepChildren && setState((prev) => ({ ...prev, lastChildren: childrenProp }));
        onShown && onShown();
      }
    }
  });

  const { hidden, disposed, lastChildren } = getState();
  const children = keepChildren ? childrenProp || lastChildren : childrenProp;

  const css = useStyles({
    classes: { root: className },
    hidden: disposable ? hidden || disposed : hidden,
    collapsable,
    transitionDuration,
    transitionTimingFunction,
  });

  if (hidden && disposable && disposed) return null;

  return (
    <Flex
      className={hidden && hiddenClassName ? `${css.root} ${hiddenClassName}` : css.root}
      {...rest}
      onTransitionEnd={transitionEndHandler}
      // eslint-disable-next-line react/no-children-prop
      children={children}
    />
  );
}
