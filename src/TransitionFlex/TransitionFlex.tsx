import React, { useRef } from 'react';
import Fade from '@mui/material/Fade';
import type { TransitionProps } from '@mui/material/transitions/transition';
import { Flex, type DefaultComponentType, type FlexAllProps } from 'reflexy/styled';
import { copyInternalProps } from 'reflexy/utils';
import FlexWithRef from 'reflexy/FlexWithRef';
import useChainRefCallback from '@js-toolkit/react-hooks/useChainRefCallback';

export type TransitionComponent = React.JSXElementConstructor<
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

export type TransitionFlexProps<
  T extends TransitionComponent = TransitionComponent,
  C extends React.ElementType = DefaultComponentType,
> = FlexAllProps<C, { inferStyleProps: { style: true } }> & HideableProps<T>;

/**
 * The component must accept `ref` or `componentRef` prop.
 * Default transition is `Fade`.
 */
function TransitionFlex<
  T extends TransitionComponent = TransitionComponent,
  C extends React.ElementType = DefaultComponentType,
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
  ...rest
}: TransitionFlexProps<T, C>): JSX.Element {
  // In case if inside TransitionGroup
  const {
    in: inProp = !hidden,
    enter,
    exit,
    onEntered,
    onExited,
    children: childrenProp,
    ...rootRest
  } = rest as React.PropsWithChildren<NonNullable<HideableProps['transitionProps']>>;

  const lastChildrenRef = useRef(childrenProp);
  if (keepChildren && !hidden) {
    lastChildrenRef.current = childrenProp;
  }

  const children = keepChildren ? childrenProp || lastChildrenRef.current : childrenProp;

  const enteredHandler = useChainRefCallback(
    onShown && (() => onShown()),
    (transitionProps as TransitionProps)?.onEntered,
    onEntered
  );

  const exitedHandler = useChainRefCallback(
    onHidden && (() => onHidden()),
    (transitionProps as TransitionProps)?.onExited,
    onExited
  );

  return React.createElement(
    transition as React.FC<TransitionProps>,
    {
      ...transitionProps,
      in: inProp,
      appear,
      enter,
      exit,
      unmountOnExit: disposable,
      timeout: transitionDuration,
      onEntered: enteredHandler,
      onExited: exitedHandler,
    },
    <FlexWithRef FlexComponent={Flex} component="div" {...rootRest}>
      {children}
    </FlexWithRef>
  );
}

export default copyInternalProps(Flex, TransitionFlex);
