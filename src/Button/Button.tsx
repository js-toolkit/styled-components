import React, { useMemo } from 'react';
import { Flex, FlexAllProps } from 'reflexy/styled';
import useStyles from './useStyles';

export interface ButtonSizes {
  contain: 'contain';
  xs: 'xs';
  s: 's';
  m: 'm';
  l: 'l';
  xl: 'xl';
}

export interface ButtonColors {
  none: 'none';
  default: 'default';
  primary: 'primary';
  secondary: 'secondary';
}

export interface ButtonVariants {
  outlined: 'outlined';
  filled: 'filled';
  text: 'text';
}

export type ButtonSize = keyof ButtonSizes;

export type ButtonColor = keyof ButtonColors;

export type ButtonVariant = keyof ButtonVariants;

export interface ButtonStyleProps {
  // size?: ButtonSize;
  // color?: ButtonColor;
  // variant?: ButtonVariant;
  size?: ButtonSizes[ButtonSize];
  color?: ButtonColors[ButtonColor];
  variant?: ButtonVariants[ButtonVariant];
}

export type ButtonProps<C extends React.ElementType = 'button'> = FlexAllProps<C, true> &
  ButtonStyleProps;

export default function Button<C extends React.ElementType = 'button'>({
  component = 'button',
  size = 'm',
  color = 'default',
  variant = 'filled',
  className,
  ...rest
}: ButtonProps<C>): JSX.Element {
  const css = useStyles({ classes: { root: className }, variant });

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
    <Flex
      center
      shrink={false}
      className={`${css.root} ${sizeClassName} ${colorClassName}`}
      component={component}
      {...(rest as any)}
    />
  );
}
