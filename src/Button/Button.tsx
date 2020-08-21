import React, { useMemo } from 'react';
// import type { SpaceProps } from 'reflexy/styled';
import LoadableFlex, {
  LoadableFlexProps,
  SpinnerPosition as LoadableSpinnerPosition,
} from '../LoadableFlex';
import useStyles from './useStyles';

export type ButtonSize = 'contain' | 'xs' | 's' | 'm' | 'l' | 'xl';

export type ButtonColor = 'none' | 'default' | 'primary' | 'secondary';

export type ButtonVariant = 'outlined' | 'filled' | 'text';

export type SpinnerPosition = Extract<LoadableSpinnerPosition, 'right' | 'left' | 'center'>;

export type ButtonProps<C extends React.ElementType = 'button'> = Omit<
  LoadableFlexProps<C>,
  'size' | 'color' | 'variant' | 'spinnerPosition' | 'spinnerSize'
> & {
  size?: ButtonSize;
  color?: ButtonColor;
  variant?: ButtonVariant;
  loading?: boolean;
  spinnerPosition?: SpinnerPosition;
};

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
    variant,
    loading,
    spinnerPosition,
  });

  const sizeClassName = useMemo(() => {
    if (size === 'contain') return css.sizeContain;
    if (size === 'xs') return css.sizeXS;
    if (size === 's') return css.sizeS;
    if (size === 'm') return css.sizeM;
    if (size === 'l') return css.sizeL;
    if (size === 'xl') return css.sizeXL;
    return '';
  }, [css.sizeContain, css.sizeL, css.sizeM, css.sizeS, css.sizeXL, css.sizeXS, size]);

  const colorClassName = useMemo(() => {
    if (color === 'default') {
      if (variant === 'filled') return css.defaultFilled;
      if (variant === 'outlined') return css.defaultOutlined;
      if (variant === 'text') return css.defaultText;
    }
    if (color === 'primary') {
      if (variant === 'filled') return css.primaryFilled;
      if (variant === 'outlined') return css.primaryOutlined;
      if (variant === 'text') return css.primaryText;
    }
    if (color === 'secondary') {
      if (variant === 'filled') return css.secondaryFilled;
      if (variant === 'outlined') return css.secondaryOutlined;
      if (variant === 'text') return css.secondaryText;
    }
    return '';
  }, [
    color,
    css.defaultFilled,
    css.defaultOutlined,
    css.defaultText,
    css.primaryFilled,
    css.primaryOutlined,
    css.primaryText,
    css.secondaryFilled,
    css.secondaryOutlined,
    css.secondaryText,
    variant,
  ]);

  return (
    <LoadableFlex
      // {...getSpaceProps(size)}
      center
      shrink={false}
      className={`${css.root} ${sizeClassName} ${colorClassName}`}
      component={component}
      loading={loading}
      spinnerPosition={spinnerPosition}
      spinnerClassName={css.spinner}
      {...(rest as any)}
    />
  );
}
