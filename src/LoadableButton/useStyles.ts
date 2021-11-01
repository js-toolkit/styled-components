import makeStyles from '@mui/styles/makeStyles';
import type { Theme, CSSProperties } from '../theme';
import type { LoadableButtonProps } from './LoadableButton';

type MakeStylesProps = Pick<LoadableButtonProps, 'loading' | 'spinnerPosition'>;

const useStyles = makeStyles((theme: Theme) => {
  const spinnerSize = '1.5em';
  const buttonTheme = theme.rc?.LoadableButton ?? {};

  return {
    root: {
      ...buttonTheme.root,

      // Space for spinner
      '&::after': {
        content: ({ loading, spinnerPosition }: MakeStylesProps) =>
          loading && spinnerPosition !== 'center' ? '""' : 'unset',
        width: spinnerSize,
        ...(buttonTheme.root?.['&::after'] as CSSProperties),
      },
    },

    spinner: {
      width: spinnerSize,
      left: ({ spinnerPosition }: MakeStylesProps) =>
        spinnerPosition === 'left' ? '0.75em' : undefined,
      right: ({ spinnerPosition }: MakeStylesProps) =>
        spinnerPosition === 'right' ? '0.75em' : undefined,
      order: ({ spinnerPosition }: MakeStylesProps) =>
        spinnerPosition === 'left' ? -1 : undefined,
      ...buttonTheme.spinner,

      '& > svg': {
        left: ({ spinnerPosition }: MakeStylesProps) =>
          spinnerPosition !== 'center' ? 0 : undefined,
        ...(buttonTheme.spinner?.['& > svg'] as CSSProperties),
      },
    },
  };
});

export default useStyles;
