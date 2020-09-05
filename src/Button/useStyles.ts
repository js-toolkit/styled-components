import makeStyles from '@material-ui/styles/makeStyles';
import Theme, { CSSProperties } from '../Theme';
import type { ButtonProps } from './Button';

type MakeStylesProps = Pick<ButtonProps, 'variant'>;

const useStyles = makeStyles((theme: Theme) => {
  const buttonTheme = theme.rc?.Button ?? {};

  const getBorderWidth = (variant?: MakeStylesProps['variant']): string =>
    variant === 'outlined' ? '1px' : '0px';

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
      ...buttonTheme.root,

      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 'var(--rc--disabled-opacity, 0.5)',
        ...(buttonTheme.root?.['&:disabled'] as CSSProperties),
      },
    },

    // Sizes

    sizeContain: {
      ...buttonTheme.sizeContain,
    },
    // 28
    sizeXS: {
      fontSize: '0.75em',
      padding: ({ variant }: MakeStylesProps) => {
        const borderWidth = getBorderWidth(variant);
        return `calc((1.75rem - 1.5em) / 2 - ${borderWidth}) calc(0.75rem - ${borderWidth})`;
      },
      ...buttonTheme.sizeXS,
    },
    // 32
    sizeS: {
      fontSize: '0.875em',
      padding: ({ variant }: MakeStylesProps) => {
        const borderWidth = getBorderWidth(variant);
        return `calc((2rem - 1.5em) / 2 - ${borderWidth}) calc(1rem - ${borderWidth})`;
      },
      ...buttonTheme.sizeS,
    },
    // 40
    sizeM: {
      fontSize: '1em',
      padding: ({ variant }: MakeStylesProps) => {
        const borderWidth = getBorderWidth(variant);
        return `calc((2.5rem - 1.5em) / 2 - ${borderWidth}) calc(1.25rem - ${borderWidth})`;
      },
      ...buttonTheme.sizeM,
    },
    // 48
    sizeL: {
      fontSize: '1.125em',
      padding: ({ variant }: MakeStylesProps) => {
        const borderWidth = getBorderWidth(variant);
        return `calc((3rem - 1.5em) / 2 - ${borderWidth}) calc(1.25rem - ${borderWidth})`;
      },
      ...buttonTheme.sizeL,
    },
    // 56
    sizeXL: {
      fontSize: '1.25em',
      padding: ({ variant }: MakeStylesProps) => {
        const borderWidth = getBorderWidth(variant);
        return `calc((3.5rem - 1.5em) / 2 - ${borderWidth}) calc(1.25rem - ${borderWidth})`;
      },
      ...buttonTheme.sizeXL,
    },

    // Colors

    defaultFilled: {
      backgroundColor: 'rgb(210, 220, 220)',
      color: 'rgb(70, 80, 80)',
      ...buttonTheme.default?.filled,
      // ...(buttonTheme.default?.filled?.[sizeProp] as CSSProperties),

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
    },

    defaultOutlined: {
      border: ({ variant }: MakeStylesProps) =>
        `${getBorderWidth(variant)} solid rgb(195, 205, 205)`,
      color: 'rgb(70, 80, 80)',
      ...buttonTheme.default?.outlined,
      // ...(buttonTheme.default?.outlined?.[sizeProp] as CSSProperties),

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
    },

    defaultText: {
      color: 'rgb(70, 80, 80)',
      ...buttonTheme.default?.text,
      // ...(buttonTheme.default?.text?.[sizeProp] as CSSProperties),

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
    },

    primaryFilled: {
      backgroundColor: 'rgb(92, 184, 92)',
      color: '#fff',
      ...buttonTheme.primary?.filled,
      // ...(buttonTheme.primary?.filled?.[sizeProp] as CSSProperties),

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
    },

    primaryOutlined: {
      border: ({ variant }: MakeStylesProps) => `${getBorderWidth(variant)} solid rgb(92, 184, 92)`,
      color: 'rgb(92, 184, 92)',
      ...buttonTheme.primary?.outlined,
      // ...(buttonTheme.primary?.outlined?.[sizeProp] as CSSProperties),

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
    },

    primaryText: {
      color: 'rgb(92, 184, 92)',
      ...buttonTheme.primary?.text,
      // ...(buttonTheme.primary?.text?.[sizeProp] as CSSProperties),

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
    },

    secondaryFilled: {
      backgroundColor: 'rgb(220, 0, 78)',
      color: '#fff',
      ...buttonTheme.secondary?.filled,
      // ...(buttonTheme.secondary?.filled?.[sizeProp] as CSSProperties),

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
    },

    secondaryOutlined: {
      border: ({ variant }: MakeStylesProps) => `${getBorderWidth(variant)} solid rgb(220, 0, 78)`,
      color: 'rgb(220, 0, 78)',
      ...buttonTheme.secondary?.outlined,
      // ...(buttonTheme.secondary?.outlined?.[sizeProp] as CSSProperties),

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
    },

    secondaryText: {
      color: 'rgb(220, 0, 78)',
      ...buttonTheme.secondary?.text,
      // ...(buttonTheme.secondary?.text?.[sizeProp] as CSSProperties),

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
    },
  };
});

export default useStyles;
