import React from 'react';
// import type { SpaceProps } from 'reflexy/styled';
import LoadableFlex, { LoadableFlexProps } from '../LoadableFlex';
import useStyles, { ButtonStyleProps } from './useStyles';

export type ButtonProps<C extends React.ElementType = 'button'> = Omit<
  LoadableFlexProps<C>,
  'size' | 'color' | 'variant' | 'spinnerPosition' | 'spinnerSize'
> &
  ButtonStyleProps;

// function getSpaceProps(size: ButtonSize): SpaceProps {
//   if (!size) return {};
//   if (size === 'contain') return { p: 0 };
//   if (size === 'xs') return { px: 0.75, py: 's' };
//   if (size === 's') return { px: 'm', py: 's' };
//   if (size === 'm') return { px: 'm', py: 's' };
//   if (size === 'l') return { px: 'l', py: 0.75 };
//   if (size === 'xl') return { px: 'xl', py: 'm' };
//   return { p: size };
// }

export default function Button<C extends React.ElementType = 'button'>({
  component = 'button',
  size = 'm',
  color = 'default',
  variant = 'filled',
  loading,
  spinnerPosition = 'center',
  spinnerClassName,
  className,
  ...rest
}: ButtonProps<C>): JSX.Element {
  const css = useStyles({
    classes: { root: className, spinner: spinnerClassName },
    size,
    color,
    variant,
    loading,
    spinnerPosition,
  });

  return (
    <LoadableFlex
      // {...getSpaceProps(size)}
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
