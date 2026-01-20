/* eslint-disable react-hooks/refs */
import React, { useRef } from 'react';
import Fade from '@mui/material/Fade';
import type { TransitionProps } from '@mui/material/transitions/transition';
import type { DefaultComponentType } from 'reflexy/styled';
import type { TweakableComponentProps } from 'reflexy/types';
import { useChainRefCallback } from '@js-toolkit/react-hooks/useChainRefCallback';

export type TransitionComponent = React.JSXElementConstructor<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TransitionProps & { children: React.ReactElement<any, any> }
>;

export interface HideableProps<T extends TransitionComponent = TransitionComponent> {
  readonly hidden?: boolean | undefined;
  readonly appear?: boolean | undefined;
  readonly disposable?: boolean | undefined;
  readonly keepChildren?: boolean | undefined;
  readonly transition?: T | undefined;
  readonly transitionProps?: OmitStrict<React.ComponentProps<T>, 'children'> | undefined;
  readonly transitionDuration?: TransitionProps['timeout'] | undefined;
  readonly onHidden?: VoidFunction | undefined;
  readonly onShown?: VoidFunction | undefined;
}

export type TransitionWrapperProps<
  C extends React.ElementType = DefaultComponentType,
  T extends TransitionComponent = TransitionComponent,
> = RequiredSome<TweakableComponentProps<C>, 'component'> & HideableProps<T>;

/**
 * The component must accept `ref` prop.
 * Default transition is `Fade`.
 */
function TransitionWrapper<
  C extends React.ElementType = DefaultComponentType,
  T extends TransitionComponent = TransitionComponent,
>({
  component,
  transition = Fade as T,
  transitionProps,
  transitionDuration,
  hidden,
  appear, // Will be overrided by TransitionGroup.
  disposable,
  keepChildren,
  onHidden,
  onShown,
  ...rest
}: TransitionWrapperProps<C, T>): React.JSX.Element {
  const {
    // In case if inside TransitionGroup
    in: inProp,
    enter,
    exit,
    onExited,
    onEntered, // really also passed?
    // Other props
    children: childrenProp,
    ...rootRest
  } = rest as React.PropsWithChildren<NonNullable<HideableProps['transitionProps']>>;

  const lastChildrenRef = useRef(childrenProp);
  if (keepChildren && !hidden) {
    lastChildrenRef.current = childrenProp;
  }

  const children = keepChildren ? childrenProp || lastChildrenRef.current : childrenProp;
  const trProps = transitionProps as TransitionProps | undefined;

  const enteredHandler = useChainRefCallback(
    onShown && (() => onShown()),
    trProps?.onEntered,
    onEntered
  );

  const exitedHandler = useChainRefCallback(
    onHidden && (() => onHidden()),
    trProps?.onExited,
    onExited
  );

  if (hidden != null && inProp != null) {
    console.warn('You should not use `hidden` prop inside <TransitionGroup>.');
  }

  return React.createElement(
    transition as React.FC<TransitionProps>,
    {
      ...trProps,
      in: inProp ?? (hidden == null ? (trProps?.in ?? true) : !hidden),
      appear: appear ?? trProps?.appear,
      enter: enter ?? trProps?.enter,
      exit: exit ?? trProps?.exit,
      unmountOnExit: disposable ?? trProps?.unmountOnExit,
      timeout: transitionDuration ?? trProps?.timeout,
      onEntered: enteredHandler,
      onExited: exitedHandler,
    },
    React.createElement(component, rootRest, children)
  );
}

export default TransitionWrapper;
