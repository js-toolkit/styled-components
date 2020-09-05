import React from 'react';
import LoadableFlex, {
  LoadableFlexProps,
  SpinnerPosition as LoadableSpinnerPosition,
} from '../LoadableFlex';
import Button, { ButtonProps } from '../Button';
import useStyles from './useStyles';

export type SpinnerPosition = Extract<LoadableSpinnerPosition, 'right' | 'left' | 'center'>;

export type LoadableButtonProps<C extends React.ElementType = 'button'> = Omit<
  LoadableFlexProps<C>,
  'size' | 'color' | 'variant' | 'spinnerPosition' | 'spinnerSize'
> &
  ButtonProps<C> & { spinnerPosition?: SpinnerPosition };

export default function LoadableButton<C extends React.ElementType = 'button'>({
  // component = 'button',
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
      component={Button}
      loading={loading}
      spinnerPosition={spinnerPosition}
      spinnerClassName={css.spinner}
      {...(rest as any)}
    />
  );
}