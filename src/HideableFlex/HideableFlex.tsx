import React, { useCallback, useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Flex, DefaultComponentType, FlexAllProps } from 'reflexy';

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
        transition: `visibility 0s ${transitionTimingFunction} ${transitionDuration}, max-height ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`,
      };
    }
    return {
      visibility: 'visible',
      opacity: 1,
      maxHeight: collapsable ? '100vh' : undefined,
      transition: `visibility 0s ${transitionTimingFunction} 0s, max-height ${transitionDuration} ${transitionTimingFunction}, opacity ${transitionDuration} ${transitionTimingFunction}`,
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
    hiddenClassName?: string;
  };

export default function HideableFlex<C extends React.ElementType = DefaultComponentType>({
  hidden,
  disposable,
  collapsable,
  className,
  hiddenClassName,
  transitionDuration,
  transitionTimingFunction,
  ...rest
}: HideableFlexProps<C>): JSX.Element | null {
  const css = useStyles({
    classes: { root: className },
    hidden,
    collapsable,
    transitionDuration,
    transitionTimingFunction,
  });

  const [disposed, setDisposed] = useState(false);

  const { onTransitionEnd } = rest as React.HTMLAttributes<Element>;

  const transitionEndHandler = useCallback<React.TransitionEventHandler>(
    (event) => {
      onTransitionEnd && onTransitionEnd(event);
      if (!disposable || event.propertyName !== 'visibility') return;
      if (hidden) setDisposed(true);
      else setDisposed(false);
    },
    [disposable, hidden, onTransitionEnd]
  );

  if (hidden && disposed) return null;

  return (
    <Flex
      className={hidden && hiddenClassName ? `${css.root} ${hiddenClassName}` : css.root}
      {...rest}
      onTransitionEnd={transitionEndHandler}
    />
  );
}