import makeStyles from '@material-ui/styles/makeStyles';
import type { SpinnerPosition as LoadableSpinnerPosition } from '../LoadableFlex';
import Theme, { CSSProperties } from '../Theme';

export type ButtonSize = 'contain' | 'xs' | 's' | 'm' | 'l' | 'xl';

export type ButtonColor = 'none' | 'default' | 'primary' | 'secondary';

export type ButtonVariant = 'outlined' | 'filled' | 'text';

export type SpinnerPosition = Extract<LoadableSpinnerPosition, 'right' | 'left' | 'center'>;

export interface ButtonStyleProps {
  size?: ButtonSize;
  color?: ButtonColor;
  variant?: ButtonVariant;
  loading?: boolean;
  spinnerPosition?: SpinnerPosition;
}

const useStyles = makeStyles((theme: Theme) => {
  const spinnerSize = '1.5em';
  const buttonTheme = theme.rc?.Button ?? {};

  return {
    root: ({ size = 'm', variant, color, loading, spinnerPosition }: ButtonStyleProps) => {
      const borderWidth = variant === 'outlined' ? '1px' : '0px';

      return {
        borderRadius: 'var(--rc--border-radius-xs, 3px)',
        border: `${borderWidth} solid transparent`,
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        fontFamily: 'inherit',
        lineHeight: 1.5,
        cursor: 'pointer',
        userSelect: 'none',
        textAlign: 'center',
        backgroundColor: 'unset',
        color: 'inherit',
        padding: 0,
        ...buttonTheme.root,

        '&:disabled': {
          cursor: 'not-allowed',
          opacity: 'var(--rc--disabled-opacity, 0.5)',
          ...(buttonTheme.root?.['&:disabled'] as CSSProperties),
        },

        // Space for spinner
        ...(loading && spinnerPosition !== 'center'
          ? {
              '&::after': {
                content: '""',
                width: spinnerSize,
                ...(buttonTheme.root?.['&::after'] as CSSProperties),
              },
            }
          : undefined),

        // Size
        ...(() => {
          if (size === 'contain') {
            return buttonTheme.sizeContain;
          }
          // 28
          if (size === 'xs') {
            return {
              fontSize: '0.75em',
              padding: `calc((1.75rem - 1.5em) / 2 - ${borderWidth}) calc(0.75rem - ${borderWidth})`,
              ...buttonTheme.sizeXS,
            };
          }
          // 32
          if (size === 's') {
            return {
              fontSize: '0.875em',
              padding: `calc((2rem - 1.5em) / 2 - ${borderWidth}) calc(1rem - ${borderWidth})`,
              ...buttonTheme.sizeS,
            };
          }
          // 40
          if (size === 'm') {
            return {
              fontSize: '1em',
              padding: `calc((2.5rem - 1.5em) / 2 - ${borderWidth}) calc(1.25rem - ${borderWidth})`,
              ...buttonTheme.sizeM,
            };
          }
          // 48
          if (size === 'l') {
            return {
              fontSize: '1.125em',
              padding: `calc((3rem - 1.5em) / 2 - ${borderWidth}) calc(1.25rem - ${borderWidth})`,
              ...buttonTheme.sizeL,
            };
          }
          // 56
          if (size === 'xl') {
            return {
              fontSize: '1.25em',
              padding: `calc((3.5rem - 1.5em) / 2 - ${borderWidth}) calc(1.25rem - ${borderWidth})`,
              ...buttonTheme.sizeXL,
            };
          }
          return {};
        })(),

        // Color
        ...(() => {
          const sizeProp = `size${size === 'contain' ? 'Contain' : size?.toUpperCase()}`;

          if (color === 'default' && variant === 'filled') {
            return {
              backgroundColor: 'rgb(210, 220, 220)',
              color: 'rgb(70, 80, 80)',
              ...buttonTheme.default?.filled,
              ...(buttonTheme.default?.filled?.[sizeProp] as CSSProperties),

              '&:hover': {
                backgroundColor: 'rgb(195, 205, 205)',
                color: 'rgb(50, 60, 60)',
                ...(buttonTheme.root?.['&:hover'] as CSSProperties),
                ...(buttonTheme.default?.filled?.['&:hover'] as CSSProperties),
              },

              // https://github.com/cssinjs/jss/issues/1045
              '&&:active': {
                backgroundColor: 'rgb(210, 220, 220)',
                ...(buttonTheme.root?.['&&:active'] as CSSProperties),
                ...(buttonTheme.default?.filled?.['&&:active'] as CSSProperties),
              },
            };
          }

          if (color === 'default' && variant === 'outlined') {
            return {
              border: `${borderWidth} solid rgb(195, 205, 205)`,
              color: 'rgb(70, 80, 80)',
              ...buttonTheme.default?.outlined,
              ...(buttonTheme.default?.outlined?.[sizeProp] as CSSProperties),

              '&:hover': {
                backgroundColor: 'rgb(225, 235, 235)',
                ...(buttonTheme.root?.['&:hover'] as CSSProperties),
                ...(buttonTheme.default?.outlined?.['&:hover'] as CSSProperties),
              },

              '&&:active': {
                backgroundColor: 'rgb(210, 220, 220)',
                ...(buttonTheme.root?.['&&:active'] as CSSProperties),
                ...(buttonTheme.default?.outlined?.['&&:active'] as CSSProperties),
              },
            };
          }

          if (color === 'default' && variant === 'text') {
            return {
              color: 'rgb(70, 80, 80)',
              ...buttonTheme.default?.text,
              ...(buttonTheme.default?.text?.[sizeProp] as CSSProperties),

              '&:hover': {
                backgroundColor: 'rgba(225, 235, 235, 0.2)',
                ...(buttonTheme.root?.['&:hover'] as CSSProperties),
                ...(buttonTheme.default?.text?.['&:hover'] as CSSProperties),
              },

              '&&:active': {
                backgroundColor: 'rgba(210, 220, 220, 0.7)',
                ...(buttonTheme.root?.['&&:active'] as CSSProperties),
                ...(buttonTheme.default?.text?.['&&:active'] as CSSProperties),
              },
            };
          }

          if (color === 'primary' && variant === 'filled') {
            return {
              backgroundColor: 'rgb(92, 184, 92)',
              color: '#fff',
              ...buttonTheme.primary?.filled,
              ...(buttonTheme.primary?.filled?.[sizeProp] as CSSProperties),

              '&:hover': {
                backgroundColor: 'rgb(73, 167, 73)',
                ...(buttonTheme.root?.['&:hover'] as CSSProperties),
                ...(buttonTheme.primary?.filled?.['&:hover'] as CSSProperties),
              },

              '&&:active': {
                backgroundColor: 'rgb(92, 184, 92)',
                ...(buttonTheme.root?.['&&:active'] as CSSProperties),
                ...(buttonTheme.primary?.filled?.['&&:active'] as CSSProperties),
              },
            };
          }

          if (color === 'primary' && variant === 'outlined') {
            return {
              border: `${borderWidth} solid rgb(92, 184, 92)`,
              color: 'rgb(92, 184, 92)',
              ...buttonTheme.primary?.outlined,
              ...(buttonTheme.primary?.outlined?.[sizeProp] as CSSProperties),

              '&:hover': {
                backgroundColor: 'rgba(73, 167, 73, 0.2)',
                color: 'rgb(73, 167, 73)',
                ...(buttonTheme.root?.['&:hover'] as CSSProperties),
                ...(buttonTheme.primary?.outlined?.['&:hover'] as CSSProperties),
              },

              '&&:active': {
                backgroundColor: 'rgb(92, 184, 92)',
                color: '#fff',
                ...(buttonTheme.root?.['&&:active'] as CSSProperties),
                ...(buttonTheme.primary?.outlined?.['&&:active'] as CSSProperties),
              },
            };
          }

          if (color === 'primary' && variant === 'text') {
            return {
              color: 'rgb(92, 184, 92)',
              ...buttonTheme.primary?.text,
              ...(buttonTheme.primary?.text?.[sizeProp] as CSSProperties),

              '&:hover': {
                backgroundColor: 'rgba(73, 167, 73, 0.2)',
                color: 'rgb(73, 167, 73)',
                ...(buttonTheme.root?.['&:hover'] as CSSProperties),
                ...(buttonTheme.primary?.text?.['&:hover'] as CSSProperties),
              },

              '&&:active': {
                backgroundColor: 'rgb(92, 184, 92)',
                color: '#fff',
                ...(buttonTheme.root?.['&&:active'] as CSSProperties),
                ...(buttonTheme.primary?.text?.['&&:active'] as CSSProperties),
              },
            };
          }

          if (color === 'secondary' && variant === 'filled') {
            return {
              backgroundColor: 'rgb(220, 0, 78)',
              color: '#fff',
              ...buttonTheme.secondary?.filled,
              ...(buttonTheme.secondary?.filled?.[sizeProp] as CSSProperties),

              '&:hover': {
                backgroundColor: 'rgb(200, 0, 58)',
                ...(buttonTheme.root?.['&:hover'] as CSSProperties),
                ...(buttonTheme.secondary?.filled?.['&:hover'] as CSSProperties),
              },

              '&&:active': {
                backgroundColor: 'rgb(220, 0, 78)',
                ...(buttonTheme.root?.['&&:active'] as CSSProperties),
                ...(buttonTheme.secondary?.filled?.['&&:active'] as CSSProperties),
              },
            };
          }

          if (color === 'secondary' && variant === 'outlined') {
            return {
              border: `${borderWidth} solid rgb(220, 0, 78)`,
              color: 'rgb(220, 0, 78)',
              ...buttonTheme.secondary?.outlined,
              ...(buttonTheme.secondary?.outlined?.[sizeProp] as CSSProperties),

              '&:hover': {
                backgroundColor: 'rgba(200, 0, 58, 0.2)',
                color: 'rgb(200, 0, 58)',
                ...(buttonTheme.root?.['&:hover'] as CSSProperties),
                ...(buttonTheme.secondary?.outlined?.['&:hover'] as CSSProperties),
              },

              '&&:active': {
                backgroundColor: 'rgb(220, 0, 78)',
                color: '#fff',
                ...(buttonTheme.root?.['&&:active'] as CSSProperties),
                ...(buttonTheme.secondary?.outlined?.['&&:active'] as CSSProperties),
              },
            };
          }

          if (color === 'secondary' && variant === 'text') {
            return {
              color: 'rgb(220, 0, 78)',
              ...buttonTheme.secondary?.text,
              ...(buttonTheme.secondary?.text?.[sizeProp] as CSSProperties),

              '&:hover': {
                backgroundColor: 'rgba(200, 0, 58, 0.2)',
                color: 'rgb(200, 0, 58)',
                ...(buttonTheme.root?.['&:hover'] as CSSProperties),
                ...(buttonTheme.secondary?.text?.['&:hover'] as CSSProperties),
              },

              '&&:active': {
                backgroundColor: 'rgb(220, 0, 78)',
                color: '#fff',
                ...(buttonTheme.root?.['&&:active'] as CSSProperties),
                ...(buttonTheme.secondary?.text?.['&&:active'] as CSSProperties),
              },
            };
          }

          return {};
        })(),
      };
    },

    spinner: ({ spinnerPosition }: ButtonStyleProps) => ({
      width: spinnerSize,
      left: spinnerPosition === 'left' ? '0.75em' : undefined,
      right: spinnerPosition === 'right' ? '0.75em' : undefined,
      order: spinnerPosition === 'left' ? -1 : undefined,
      ...buttonTheme.spinner,

      '& > svg': {
        left: spinnerPosition !== 'center' ? 0 : undefined,
        ...(buttonTheme.spinner?.['& > svg'] as CSSProperties),
      },
    }),
  };
});

export default useStyles;
