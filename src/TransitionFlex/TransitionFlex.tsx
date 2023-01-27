import React, { useRef } from 'react';
import type { TransitionProps } from '@mui/material/transitions/transition';
import Fade from '@mui/material/Fade';
import clsx from 'clsx';
import { DefaultComponentType, FlexAllProps, FlexWithRef } from 'reflexy';
import useChainRefCallback from '@jstoolkit/react-hooks/useChainRefCallback';

export type TransitionComponent = React.JSXElementConstructor<
  TransitionProps & { children: React.ReactElement<any, any> }
>;

export interface HideableProps<T extends TransitionComponent = TransitionComponent> {
  readonly hidden?: boolean | undefined;
  readonly appear?: boolean | undefined;
  readonly disposable?: boolean | undefined;
  readonly keepChildren?: boolean | undefined;
  readonly hiddenClassName?: string | undefined;
  readonly onHidden?: VoidFunction | undefined;
  readonly onShown?: VoidFunction | undefined;
  readonly transition?: T | undefined;
  readonly transitionProps?: OmitStrict<React.ComponentProps<T>, 'children'> | undefined;
  readonly transitionDuration?: TransitionProps['timeout'] | undefined;
}

export type TransitionFlexProps<
  T extends TransitionComponent = TransitionComponent,
  C extends React.ElementType = DefaultComponentType
> = FlexAllProps<C, { inferStyleProps: { style: true } }> & HideableProps<T>;

/** Default transition is `Fade`. */
export default function TransitionFlex<
  T extends TransitionComponent = TransitionComponent,
  C extends React.ElementType = DefaultComponentType
>({
  transition = Fade as T,
  transitionProps,
  transitionDuration = (transitionProps as TransitionProps)?.timeout,
  hidden = !((transitionProps as TransitionProps)?.in ?? true),
  appear = (transitionProps as TransitionProps)?.appear ?? true,
  disposable = (transitionProps as TransitionProps)?.unmountOnExit,
  keepChildren,
  onHidden,
  onShown,
  className,
  hiddenClassName,
  ...rest
}: TransitionFlexProps<T, C>): JSX.Element {
  const { children: childrenProp } = rest as React.PropsWithChildren<unknown>;

  const lastChildrenRef = useRef(childrenProp);
  if (keepChildren && !hidden) {
    lastChildrenRef.current = childrenProp;
  }

  const children = keepChildren ? childrenProp || lastChildrenRef.current : childrenProp;

  const enteredHandler = useChainRefCallback(
    onShown && (() => onShown()),
    (transitionProps as TransitionProps)?.onEntered
  );

  const exitedHandler = useChainRefCallback(
    onHidden && (() => onHidden()),
    (transitionProps as TransitionProps)?.onExited
  );

  return React.createElement(
    transition as React.ComponentType<TransitionProps>,
    {
      ...transitionProps,
      in: !hidden,
      appear,
      unmountOnExit: disposable,
      timeout: transitionDuration,
      onEntered: enteredHandler,
      onExited: exitedHandler,
    },
    <FlexWithRef component="div" className={clsx(className, hidden && hiddenClassName)} {...rest}>
      {children}
    </FlexWithRef>
  );
}
