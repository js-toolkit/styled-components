import makeStyles from '@material-ui/styles/makeStyles';
import type { Theme, CSSProperties } from '../Theme';
import type { ButtonColor, ButtonProps, ButtonSize, ButtonVariant } from './Button';

type MakeStylesProps = Pick<ButtonProps, 'variant'>;

const useStyles = makeStyles((theme: Theme) => {
  const getBorderWidth = (variant?: MakeStylesProps['variant']): string =>
    variant === 'outlined' ? '1px' : '0px';

  const {
    root,
    // none: colorNone,
    default: colorDefault,
    primary: colorPrimary,
    secondary: colorSecondary,
    // 'size-contain': sizeContain,
    'size-xs': sizeXS,
    'size-s': sizeS,
    'size-m': sizeM,
    'size-l': sizeL,
    'size-xl': sizeXL,
    ...restTheme
  } = theme.rc?.Button ?? {};

  // Build futured classes from theme
  const themeClasses = Object.getOwnPropertyNames(restTheme).reduce(
    (acc, p) => {
      if (p.indexOf('size-') === 0) acc.sizes[p] = { ...(restTheme[p] as CSSProperties) };
      else {
        const colorTheme = restTheme[p] as Record<ButtonVariant, CSSProperties>;
        Object.getOwnPropertyNames(colorTheme).forEach((variant) => {
          acc.colors[`${p}-${variant}`] = { ...(colorTheme[variant] as CSSProperties) };
        });
      }
      return acc;
    },
    {
      sizes: {} as Record<ButtonSize, CSSProperties>,
      colors: {} as Record<`${ButtonColor}-${ButtonVariant}`, CSSProperties>,
    }
  );

  return {
    root: {
      borderRadius: 'var(--rc--border-radius-xs, 3px)',
      border: ({ variant }: MakeStylesProps) => `${getBorderWidth(variant)} solid transparent`,
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
      ...root,

      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 'var(--rc--disabled-opacity, 0.5)',
        ...(root?.['&:disabled'] as CSSProperties),
      },
    },

    // Sizes

    ...themeClasses.sizes,

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

    // Colors and variants

    ...themeClasses.colors,

    'default-filled': {
      backgroundColor: 'rgb(210, 220, 220)',
      color: 'rgb(70, 80, 80)',
      ...colorDefault?.filled,
      // ...(colorDefault?.filled?.[sizeProp] as CSSProperties),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgb(195, 205, 205)',
          color: 'rgb(50, 60, 60)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorDefault?.filled?.['&:hover'] as CSSProperties),
        },
      },

      // https://github.com/cssinjs/jss/issues/1045
      '&&:active': {
        backgroundColor: 'rgb(210, 220, 220)',
        ...(root?.['&&:active'] as CSSProperties),
        ...(colorDefault?.filled?.['&&:active'] as CSSProperties),
      },
    },

    'default-outlined': {
      border: ({ variant }: MakeStylesProps) =>
        `${getBorderWidth(variant)} solid rgb(195, 205, 205)`,
      color: 'rgb(70, 80, 80)',
      ...colorDefault?.outlined,
      // ...(colorDefault?.outlined?.[sizeProp] as CSSProperties),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgb(225, 235, 235)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorDefault?.outlined?.['&:hover'] as CSSProperties),
        },
      },

      '&&:active': {
        backgroundColor: 'rgb(210, 220, 220)',
        ...(root?.['&&:active'] as CSSProperties),
        ...(colorDefault?.outlined?.['&&:active'] as CSSProperties),
      },
    },

    'default-text': {
      color: 'rgb(70, 80, 80)',
      ...colorDefault?.text,
      // ...(colorDefault?.text?.[sizeProp] as CSSProperties),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgba(225, 235, 235, 0.2)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorDefault?.text?.['&:hover'] as CSSProperties),
        },
      },

      '&&:active': {
        backgroundColor: 'rgba(210, 220, 220, 0.7)',
        ...(root?.['&&:active'] as CSSProperties),
        ...(colorDefault?.text?.['&&:active'] as CSSProperties),
      },
    },

    'primary-filled': {
      backgroundColor: 'rgb(92, 184, 92)',
      color: '#fff',
      ...colorPrimary?.filled,
      // ...(colorPrimary?.filled?.[sizeProp] as CSSProperties),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgb(73, 167, 73)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorPrimary?.filled?.['&:hover'] as CSSProperties),
        },
      },

      '&&:active': {
        backgroundColor: 'rgb(92, 184, 92)',
        ...(root?.['&&:active'] as CSSProperties),
        ...(colorPrimary?.filled?.['&&:active'] as CSSProperties),
      },
    },

    'primary-outlined': {
      border: ({ variant }: MakeStylesProps) => `${getBorderWidth(variant)} solid rgb(92, 184, 92)`,
      color: 'rgb(92, 184, 92)',
      ...colorPrimary?.outlined,
      // ...(colorPrimary?.outlined?.[sizeProp] as CSSProperties),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgba(73, 167, 73, 0.2)',
          color: 'rgb(73, 167, 73)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorPrimary?.outlined?.['&:hover'] as CSSProperties),
        },
      },

      '&&:active': {
        backgroundColor: 'rgb(92, 184, 92)',
        color: '#fff',
        ...(root?.['&&:active'] as CSSProperties),
        ...(colorPrimary?.outlined?.['&&:active'] as CSSProperties),
      },
    },

    'primary-text': {
      color: 'rgb(92, 184, 92)',
      ...colorPrimary?.text,
      // ...(colorPrimary?.text?.[sizeProp] as CSSProperties),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgba(73, 167, 73, 0.2)',
          color: 'rgb(73, 167, 73)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorPrimary?.text?.['&:hover'] as CSSProperties),
        },
      },

      '&&:active': {
        backgroundColor: 'rgb(92, 184, 92)',
        color: '#fff',
        ...(root?.['&&:active'] as CSSProperties),
        ...(colorPrimary?.text?.['&&:active'] as CSSProperties),
      },
    },

    'secondary-filled': {
      backgroundColor: 'rgb(220, 0, 78)',
      color: '#fff',
      ...colorSecondary?.filled,
      // ...(colorSecondary?.filled?.[sizeProp] as CSSProperties),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgb(200, 0, 58)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorSecondary?.filled?.['&:hover'] as CSSProperties),
        },
      },

      '&&:active': {
        backgroundColor: 'rgb(220, 0, 78)',
        ...(root?.['&&:active'] as CSSProperties),
        ...(colorSecondary?.filled?.['&&:active'] as CSSProperties),
      },
    },

    'secondary-outlined': {
      border: ({ variant }: MakeStylesProps) => `${getBorderWidth(variant)} solid rgb(220, 0, 78)`,
      color: 'rgb(220, 0, 78)',
      ...colorSecondary?.outlined,
      // ...(colorSecondary?.outlined?.[sizeProp] as CSSProperties),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgba(200, 0, 58, 0.2)',
          color: 'rgb(200, 0, 58)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorSecondary?.outlined?.['&:hover'] as CSSProperties),
        },
      },

      '&&:active': {
        backgroundColor: 'rgb(220, 0, 78)',
        color: '#fff',
        ...(root?.['&&:active'] as CSSProperties),
        ...(colorSecondary?.outlined?.['&&:active'] as CSSProperties),
      },
    },

    'secondary-text': {
      color: 'rgb(220, 0, 78)',
      ...colorSecondary?.text,
      // ...(colorSecondary?.text?.[sizeProp] as CSSProperties),

      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: 'rgba(200, 0, 58, 0.2)',
          color: 'rgb(200, 0, 58)',
          ...(root?.['&:hover'] as CSSProperties),
          ...(colorSecondary?.text?.['&:hover'] as CSSProperties),
        },
      },

      '&&:active': {
        backgroundColor: 'rgb(220, 0, 78)',
        color: '#fff',
        ...(root?.['&&:active'] as CSSProperties),
        ...(colorSecondary?.text?.['&&:active'] as CSSProperties),
      },
    },
  };
});

export default useStyles;
