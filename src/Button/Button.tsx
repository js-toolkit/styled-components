import React from 'react';
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

  const sizeClassName = (css[`size-${size}`] as string) ?? '';
  const colorClassName = (css[`${color}-${variant}`] as string) ?? '';

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
