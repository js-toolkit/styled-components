/* eslint-disable @typescript-eslint/no-empty-object-type */
import React from 'react';
import styled from '@mui/system/styled';
import type { MUIStyledCommonProps } from '@mui/system';
import { Flex, type FlexAllProps, type FlexComponentProps } from 'reflexy/styled';
import type { GetOverridedKeys } from '../types/local';
import type { CSSProperties } from '../theme';

export interface ButtonSizes {}
export interface ButtonColors {}
export interface ButtonVariants {}

export type ButtonSize = GetOverridedKeys<'contain' | 'xs' | 's' | 'm' | 'l' | 'xl', ButtonSizes>;

export type ButtonColor = GetOverridedKeys<
  'none' | 'default' | 'primary' | 'secondary',
  ButtonColors
>;

export type ButtonVariant = GetOverridedKeys<'outlined' | 'filled' | 'text', ButtonVariants>;

export interface ButtonStyleProps {
  readonly size?: ButtonSize | undefined;
  readonly color?: ButtonColor | undefined;
  readonly variant?: ButtonVariant | undefined;
}

export type ButtonProps<C extends React.ElementType = 'button'> = FlexAllProps<C> &
  ButtonStyleProps &
  Pick<MUIStyledCommonProps, 'sx'>;

// function excludeHoverRules<T extends AnyObject | undefined>(rules: T): T {
//   if (rules == null) return rules;
//   const { '&:hover': _, '&&:hover': __, ...rest } = rules;
//   return rest as T;
// }

const Root = styled(
  (props: FlexComponentProps & ButtonStyleProps) => (
    <Flex center shrink={0} component="button" {...props} />
  ),
  {
    shouldForwardProp: (key) => {
      const prop = key as keyof ButtonStyleProps;
      return prop !== 'size' && prop !== 'color' && prop !== 'variant';
    },
  }
)(({ theme: { rc }, size = 'm', color = 'default', variant = 'filled' }) => {
  const outlinedBorderWidth = '1px';
  const borderWidth = variant === 'outlined' ? outlinedBorderWidth : '0px';
  const theme = rc?.Button ?? {};

  const hover = {
    '@media (hover: hover)': {
      '&:hover': {
        ...theme.hover,

        ...(color === 'default' &&
          variant === 'filled' && {
            backgroundColor: 'rgb(195, 205, 205)',
            color: 'rgb(50, 60, 60)',
          }),

        ...(color === 'default' &&
          variant === 'outlined' && {
            backgroundColor: 'rgb(225, 235, 235)',
          }),

        ...(color === 'default' &&
          variant === 'text' && {
            backgroundColor: 'rgba(225, 235, 235, 0.2)',
          }),

        ...(color === 'primary' &&
          variant === 'filled' && {
            backgroundColor: 'rgb(73, 167, 73)',
          }),

        ...(color === 'primary' &&
          variant === 'outlined' && {
            backgroundColor: 'rgba(73, 167, 73, 0.2)',
            color: 'rgb(73, 167, 73)',
          }),

        ...(color === 'primary' &&
          variant === 'text' && {
            backgroundColor: 'rgba(73, 167, 73, 0.2)',
            color: 'rgb(73, 167, 73)',
          }),

        ...(color === 'secondary' &&
          variant === 'filled' && {
            backgroundColor: 'rgb(200, 0, 58)',
          }),

        ...(color === 'secondary' &&
          variant === 'outlined' && {
            backgroundColor: 'rgba(200, 0, 58, 0.2)',
            color: 'rgb(200, 0, 58)',
          }),

        ...(color === 'secondary' &&
          variant === 'text' && {
            backgroundColor: 'rgba(200, 0, 58, 0.2)',
            color: 'rgb(200, 0, 58)',
          }),

        ...theme[color]?.[variant]?.hover,
      },
    },
  };

  const active = {
    '&:active': {
      ...theme.active,

      ...(color === 'default' &&
        variant === 'filled' && {
          backgroundColor: 'rgb(210, 220, 220)',
        }),

      ...(color === 'default' &&
        variant === 'outlined' && {
          backgroundColor: 'rgb(210, 220, 220)',
        }),

      ...(color === 'default' &&
        variant === 'text' && {
          backgroundColor: 'rgba(210, 220, 220, 0.7)',
        }),

      ...(color === 'primary' &&
        variant === 'filled' && {
          backgroundColor: 'rgb(92, 184, 92)',
        }),

      ...(color === 'primary' &&
        variant === 'outlined' && {
          backgroundColor: 'rgb(92, 184, 92)',
          color: '#fff',
        }),

      ...(color === 'primary' &&
        variant === 'text' && {
          backgroundColor: 'rgb(92, 184, 92)',
          color: '#fff',
        }),

      ...(color === 'secondary' &&
        variant === 'filled' && {
          backgroundColor: 'rgb(220, 0, 78)',
        }),

      ...(color === 'secondary' &&
        variant === 'outlined' && {
          backgroundColor: 'rgb(220, 0, 78)',
          color: '#fff',
        }),

      ...(color === 'secondary' &&
        variant === 'text' && {
          backgroundColor: 'rgb(220, 0, 78)',
          color: '#fff',
        }),

      ...theme[color]?.[variant]?.active,
    },
  };

  return {
    borderRadius: 'var(--rc--border-radius-xs, 3px)',
    border: 'none',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    fontFamily: 'inherit',
    lineHeight: 1.5,
    cursor: 'pointer',
    userSelect: 'none',
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'inherit',
    padding: 0,
    margin: 0,
    touchAction: 'manipulation',
    ...theme.root,

    '&:disabled': {
      cursor: 'default',
      opacity: 'var(--rc--disabled-opacity, 0.5)',
      pointerEvents: 'none', // Fix onMouseEnter in TooltipButton when the pointer moving from disabled button to enabled one.
      ...(theme.root?.['&:disabled'] as CSSProperties),
    },

    // Sizes

    ...(size === 'contain' && {
      lineHeight: 'inherit',
    }),

    // 28
    ...(size === 'xs' && {
      fontSize: '0.75em',
      padding: `calc((1.75rem - 1.5em) / 2 - ${borderWidth}) calc(0.75rem - ${borderWidth})`,
    }),

    // 32
    ...(size === 's' && {
      fontSize: '0.875em',
      padding: `calc((2rem - 1.5em) / 2 - ${borderWidth}) calc(1rem - ${borderWidth})`,
    }),

    // 40
    ...(size === 'm' && {
      fontSize: '1em',
      padding: `calc((2.5rem - 1.5em) / 2 - ${borderWidth}) calc(1.25rem - ${borderWidth})`,
    }),

    // 48
    ...(size === 'l' && {
      fontSize: '1.125em',
      padding: `calc((3rem - 1.5em) / 2 - ${borderWidth}) calc(1.25rem - ${borderWidth})`,
    }),

    // 56
    ...(size === 'xl' && {
      fontSize: '1.25em',
      padding: `calc((3.5rem - 1.5em) / 2 - ${borderWidth}) calc(1.25rem - ${borderWidth})`,
    }),

    ...theme[`size-${size}`],

    // Variants

    ...(variant === 'outlined' && {
      borderWidth: outlinedBorderWidth,
      borderStyle: 'solid',
    }),

    ...theme[`variant-${variant}`],

    // Colors and variants

    ...(color === 'default' &&
      variant === 'filled' && {
        backgroundColor: 'rgb(210, 220, 220)',
        color: 'rgb(70, 80, 80)',
      }),

    ...(color === 'default' &&
      variant === 'outlined' && {
        borderColor: 'rgb(195, 205, 205)',
        color: 'rgb(70, 80, 80)',
      }),

    ...(color === 'default' &&
      variant === 'text' && {
        color: 'rgb(70, 80, 80)',
      }),

    ...(color === 'primary' &&
      variant === 'filled' && {
        backgroundColor: 'rgb(92, 184, 92)',
        color: '#fff',
      }),

    ...(color === 'primary' &&
      variant === 'outlined' && {
        borderColor: 'rgb(92, 184, 92)',
        color: 'rgb(92, 184, 92)',
      }),

    ...(color === 'primary' &&
      variant === 'text' && {
        color: 'rgb(92, 184, 92)',
      }),

    ...(color === 'secondary' &&
      variant === 'filled' && {
        backgroundColor: 'rgb(220, 0, 78)',
        color: '#fff',
      }),

    ...(color === 'secondary' &&
      variant === 'outlined' && {
        borderColor: 'rgb(220, 0, 78)',
        color: 'rgb(220, 0, 78)',
      }),

    ...(color === 'secondary' &&
      variant === 'text' && {
        color: 'rgb(220, 0, 78)',
      }),

    // ...excludeHoverRules(theme[color]?.[variant]?.root),
    ...theme[color]?.[variant]?.root,

    ...hover,
    ...active,
  };
});

export default function Button<C extends React.ElementType = 'button'>(
  props: ButtonProps<C>
): React.JSX.Element {
  return <Root {...props} />;
}
