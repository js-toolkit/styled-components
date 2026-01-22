import React from 'react';
import { Flex, type DefaultComponentType, type FlexAllProps } from 'reflexy/styled';
import { copyInternalProps } from 'reflexy/copyInternalProps';
import TweakableElementWrapper from 'reflexy/TweakableElementWrapper';
import TransitionWrapper, {
  type HideableProps,
  type TransitionComponent,
} from '../TransitionWrapper';

export type { TransitionComponent, HideableProps };

export function NoTransition({ children }: React.PropsWithChildren): React.ReactNode {
  return children;
}

export type TransitionFlexProps<
  C extends React.ElementType = DefaultComponentType,
  T extends TransitionComponent = TransitionComponent,
> = FlexAllProps<C, { inferStyleProps: { style: true } }> & HideableProps<T>;

/**
 * The component must accept `ref` prop.
 * Default transition is `Fade`.
 */
function TransitionFlex<
  C extends React.ElementType = DefaultComponentType,
  T extends TransitionComponent = TransitionComponent,
>({ component, style, className, ...rest }: TransitionFlexProps<C, T>): React.JSX.Element {
  return (
    <TransitionWrapper
      component={TweakableElementWrapper}
      forwardProps
      element={<Flex component={component as DefaultComponentType} />}
      style={style as never}
      className={className}
      {...rest}
    />
  );
}

export default copyInternalProps(Flex, TransitionFlex);
