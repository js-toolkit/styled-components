import React from 'react';
import LoadableFlex, {
  type LoadableFlexProps,
  type SpinnerPosition as LoadableSpinnerPosition,
} from '../LoadableFlex';
import Button, { type ButtonProps } from '../Button';
import useStyles from './useStyles';

export type SpinnerPosition = Extract<LoadableSpinnerPosition, 'right' | 'left' | 'center'>;

export type LoadableButtonProps<C extends React.ElementType = 'button'> = Omit<
  LoadableFlexProps<any>,
  'size' | 'color' | 'variant' | 'spinnerPosition' | 'spinnerSize'
> &
  ButtonProps<C> & { spinnerPosition?: SpinnerPosition | undefined };

export default function LoadableButton<C extends React.ElementType = 'button'>({
  component = Button as C,
  loading,
  spinnerPosition = 'center',
  spinnerClassName,
  className,
  ...rest
}: LoadableButtonProps<C>): JSX.Element {
  const css = useStyles({
    classes: { root: className, spinner: spinnerClassName },
    loading,
    spinnerPosition,
  });

  return (
    <LoadableFlex
      center
      shrink={false}
      className={css.root}
      component={component}
      loading={loading}
      spinnerPosition={spinnerPosition}
      spinnerClassName={css.spinner}
      {...(rest as any)}
    />
  );
}
