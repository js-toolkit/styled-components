import makeStyles from '@mui/styles/makeStyles';
import type { Theme, ButtonTheme, CSSProperties } from '../theme';
import type { ButtonColor, ButtonProps, ButtonSize, ButtonVariant } from './Button';

type MakeStylesProps = Pick<ButtonProps, 'variant'>;

function excludeHoverRules<T extends AnyObject | undefined>(rules: T): T {
  if (rules == null) return rules;
  const { '&:hover': _, '&&:hover': __, ...rest } = rules;
  return rest as T;
}

const useStyles = makeStyles((theme: Theme) => {
  const outlinedBorderWidth = '1px';

  const getBorderWidth = (variant?: MakeStylesProps['variant'] | undefined): string =>
    variant === 'outlined' ? outlinedBorderWidth : '0px';

  const {
    root,
    // none: colorNone,
    default: colorDefault,
    primary: colorPrimary,
    secondary: colorSecondary,
    'variant-text': variantText,
    'variant-outlined': variantOutlined,
    'variant-filled': variantFilled,
    'size-contain': sizeContain,
    'size-xs': sizeXS,
    'size-s': sizeS,
    'size-m': sizeM,
    'size-l': sizeL,
    'size-xl': sizeXL,
    css,
    ...rest
  } = theme.rc?.Button ?? {};

  const restTheme = rest as ButtonTheme;

  // Build futured classes from theme
  const themeClasses = Object.getOwnPropertyNames(restTheme).reduce(
    (acc, p) => {
      if (p.indexOf('size-') === 0) {
        const size = p as `size-${ButtonSize}`;
        acc.sizes[size] = { ...(restTheme[size] as CSSProperties) };
      } else if (p.indexOf('variant-') === 0) {
        const variant = p as `variant-${ButtonVariant}`;
        acc.variants[variant] = { ...(restTheme[variant] as CSSProperties) };
      } else {
        const color = p as ButtonColor;
        const colorTheme = restTheme[color];
        colorTheme &&
          Object.getOwnPropertyNames(colorTheme).forEach((k) => {
            const variant = k as ButtonVariant;
            acc.colors[`${color}-${variant}`] = { ...colorTheme[variant] };
          });
      }
      return acc;
    },
    {
      sizes: {} as Record<`size-${ButtonSize}`, CSSProperties>,
      colors: {} as Record<`${ButtonColor}-${ButtonVariant}`, CSSProperties>,
      variants: {} as Record<`variant-${ButtonVariant}`, CSSProperties>,
    }
  );

  return {
    root: {
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
      ...root,

      '&:disabled': {
        cursor: 'default',
        opacity: 'var(--rc--disabled-opacity, 0.5)',
        pointerEvents: 'none', // Fix onMouseEnter in TooltipButton when the pointer moving from disabled button to enabled one.
        ...(root?.['&:disabled'] as CSSProperties),
      },
    },

    // Custom CSS
    ...css,

    // Sizes

    ...themeClasses.sizes,

    'size-contain': {
      lineHeight: 'inherit',
      ...sizeContain,
    },

    // 28
    'size-xs': {
      fontSize: '0.75em',
      padding: ({ variant }: MakeStylesProps) => {
        const borderWidth = getBorderWidth(variant);
        return `calc((1.75rem - 1.5em) / 2 - ${borderWidth}) calc(0.75rem - ${borderWidth})`;
      },
      ...sizeXS,
    },
    // 32
    'size-s': {
      fontSize: '0.875em',
      padding: ({ variant }: MakeStylesProps) => {
        const borderWidth = getBorderWidth(variant);
        return `calc((2rem - 1.5em) / 2 - ${borderWidth}) calc(1rem - ${borderWidth})`;
      },
      ...sizeS,
    },
    // 40
    'size-m': {
      fontSize: '1em',
      padding: ({ variant }: MakeStylesProps) => {
        const borderWidth = getBorderWidth(variant);
        return `calc((2.5rem - 1.5em) / 2 - ${borderWidth}) calc(1.25rem - ${borderWidth})`;
      },
      ...sizeM,
    },
    // 48
    'size-l': {
      fontSize: '1.125em',
      padding: ({ variant }: MakeStylesProps) => {
        const borderWidth = getBorderWidth(variant);
        return `calc((3rem - 1.5em) / 2 - ${borderWidth}) calc(1.25rem - ${borderWidth})`;
      },
      ...sizeL,
    },
    // 56
    'size-xl': {
      fontSize: '1.25em',
      padding: ({ variant }: MakeStylesProps) => {
        const borderWidth = getBorderWidth(variant);
        return `calc((3.5rem - 1.5em) / 2 - ${borderWidth}) calc(1.25rem - ${borderWidth})`;
      },
      ...sizeXL,
    },

    // Variants

    ...themeClasses.variants,

    'variant-text': {
      ...variantText,
    },

    'variant-outlined': {
      borderWidth: outlinedBorderWidth,
      borderStyle: 'solid',
      ...variantOutlined,
    },

    'variant-filled': {
      ...variantFilled,
    },

    // Colors and variants

    ...themeClasses.colors,

    'default-filled': {
      backgroundColor: 'rgb(210, 220, 220)',
      color: 'rgb(70, 80, 80)',
      ...excludeHoverRules(colorDefault?.filled),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgb(195, 205, 205)',
          color: 'rgb(50, 60, 60)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorDefault?.filled?.['&:hover'] as CSSProperties),
        },
      },

      // https://github.com/cssinjs/jss/issues/1045
      '&:active': {
        backgroundColor: 'rgb(210, 220, 220)',
        ...(root?.['&:active'] as CSSProperties),
        ...(colorDefault?.filled?.['&:active'] as CSSProperties),
      },
    },

    'default-outlined': {
      borderColor: 'rgb(195, 205, 205)',
      color: 'rgb(70, 80, 80)',
      ...excludeHoverRules(colorDefault?.outlined),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgb(225, 235, 235)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorDefault?.outlined?.['&:hover'] as CSSProperties),
        },
      },

      '&:active': {
        backgroundColor: 'rgb(210, 220, 220)',
        ...(root?.['&:active'] as CSSProperties),
        ...(colorDefault?.outlined?.['&:active'] as CSSProperties),
      },
    },

    'default-text': {
      color: 'rgb(70, 80, 80)',
      ...excludeHoverRules(colorDefault?.text),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgba(225, 235, 235, 0.2)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorDefault?.text?.['&:hover'] as CSSProperties),
        },
      },

      '&:active': {
        backgroundColor: 'rgba(210, 220, 220, 0.7)',
        ...(root?.['&:active'] as CSSProperties),
        ...(colorDefault?.text?.['&:active'] as CSSProperties),
      },
    },

    'primary-filled': {
      backgroundColor: 'rgb(92, 184, 92)',
      color: '#fff',
      ...excludeHoverRules(colorPrimary?.filled),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgb(73, 167, 73)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorPrimary?.filled?.['&:hover'] as CSSProperties),
        },
      },

      '&:active': {
        backgroundColor: 'rgb(92, 184, 92)',
        ...(root?.['&:active'] as CSSProperties),
        ...(colorPrimary?.filled?.['&:active'] as CSSProperties),
      },
    },

    'primary-outlined': {
      borderColor: 'rgb(92, 184, 92)',
      color: 'rgb(92, 184, 92)',
      ...excludeHoverRules(colorPrimary?.outlined),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgba(73, 167, 73, 0.2)',
          color: 'rgb(73, 167, 73)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorPrimary?.outlined?.['&:hover'] as CSSProperties),
        },
      },

      '&:active': {
        backgroundColor: 'rgb(92, 184, 92)',
        color: '#fff',
        ...(root?.['&:active'] as CSSProperties),
        ...(colorPrimary?.outlined?.['&:active'] as CSSProperties),
      },
    },

    'primary-text': {
      color: 'rgb(92, 184, 92)',
      ...excludeHoverRules(colorPrimary?.text),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgba(73, 167, 73, 0.2)',
          color: 'rgb(73, 167, 73)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorPrimary?.text?.['&:hover'] as CSSProperties),
        },
      },

      '&:active': {
        backgroundColor: 'rgb(92, 184, 92)',
        color: '#fff',
        ...(root?.['&:active'] as CSSProperties),
        ...(colorPrimary?.text?.['&:active'] as CSSProperties),
      },
    },

    'secondary-filled': {
      backgroundColor: 'rgb(220, 0, 78)',
      color: '#fff',
      ...excludeHoverRules(colorSecondary?.filled),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgb(200, 0, 58)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorSecondary?.filled?.['&:hover'] as CSSProperties),
        },
      },

      '&:active': {
        backgroundColor: 'rgb(220, 0, 78)',
        ...(root?.['&:active'] as CSSProperties),
        ...(colorSecondary?.filled?.['&:active'] as CSSProperties),
      },
    },

    'secondary-outlined': {
      borderColor: 'rgb(220, 0, 78)',
      color: 'rgb(220, 0, 78)',
      ...excludeHoverRules(colorSecondary?.outlined),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgba(200, 0, 58, 0.2)',
          color: 'rgb(200, 0, 58)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorSecondary?.outlined?.['&:hover'] as CSSProperties),
        },
      },

      '&:active': {
        backgroundColor: 'rgb(220, 0, 78)',
        color: '#fff',
        ...(root?.['&:active'] as CSSProperties),
        ...(colorSecondary?.outlined?.['&:active'] as CSSProperties),
      },
    },

    'secondary-text': {
      color: 'rgb(220, 0, 78)',
      ...excludeHoverRules(colorSecondary?.text),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgba(200, 0, 58, 0.2)',
          color: 'rgb(200, 0, 58)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorSecondary?.text?.['&:hover'] as CSSProperties),
        },
      },

      '&:active': {
        backgroundColor: 'rgb(220, 0, 78)',
        color: '#fff',
        ...(root?.['&:active'] as CSSProperties),
        ...(colorSecondary?.text?.['&:active'] as CSSProperties),
      },
    },
  };
});

export default useStyles;
