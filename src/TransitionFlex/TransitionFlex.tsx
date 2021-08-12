import React, { useState } from 'react';
import type { TransitionProps } from '@material-ui/core/transitions/transition';
import Fade from '@material-ui/core/Fade';
import clsx from 'clsx';
import { Flex, DefaultComponentType, FlexAllProps } from 'reflexy';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';

type TransitionComponent = React.JSXElementConstructor<
  TransitionProps & { children?: React.ReactElement<any, any> }
>;

export interface HideableProps<T extends TransitionComponent = TransitionComponent> {
  readonly hidden?: boolean;
  readonly appear?: boolean;
  readonly disposable?: boolean;
  readonly keepChildren?: boolean;
  readonly hiddenClassName?: string;
  readonly onHidden?: VoidFunction;
  readonly onShown?: VoidFunction;
  readonly transition?: T;
  readonly transitionProps?: React.ComponentPropsWithoutRef<T>;
  readonly transitionDuration?: TransitionProps['timeout'];
}

export type TransitionFlexProps<
  T extends TransitionComponent = TransitionComponent,
  C extends React.ElementType = DefaultComponentType
> = FlexAllProps<C, { defaultStyles: { className: true } }> & HideableProps<T>;

/** Default transition is `Fade`. */
export default function TransitionFlex<
  T extends TransitionComponent = TransitionComponent,
  C extends React.ElementType = DefaultComponentType
>({
  hidden,
  appear = true,
  disposable,
  keepChildren,
  transition = Fade as T,
  transitionProps,
  transitionDuration,
  onHidden,
  onShown,
  className,
  hiddenClassName,
  ...rest
}: TransitionFlexProps<T, C>): JSX.Element {
  const { children: childrenProp } = rest as React.HTMLAttributes<Element>;

  const [lastChildren, setLastChildren] = useState(keepChildren ? childrenProp : undefined);

  const children = keepChildren ? childrenProp || lastChildren : childrenProp;

  const enteredHandler = useRefCallback(() => {
    keepChildren && setLastChildren(childrenProp);
    onShown && onShown();
  });

  const exitedHandler = useRefCallback(() => {
    if (keepChildren) {
      setLastChildren(undefined);
    }
    onHidden && onHidden();
  });

  return React.createElement(
    transition,
    {
      in: !hidden,
      appear,
      unmountOnExit: disposable,
      timeout: transitionDuration,
      onEntered: enteredHandler,
      onExited: exitedHandler,
      ...transitionProps,
    },
    <Flex className={clsx(className, hidden && hiddenClassName)} {...rest}>
      {children}
    </Flex>
  );
}
