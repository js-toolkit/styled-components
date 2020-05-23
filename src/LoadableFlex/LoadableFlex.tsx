import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Flex, FlexAllProps, DefaultComponentType } from 'reflexy/styled';
import Theme, { CSSProperties } from '../Theme';
import Ring from './Ring';

export type SpinnerPosition = 'top' | 'right' | 'left' | 'bottom' | 'center';
export type SpinnerSize = 'auto' | 'xs' | 's' | 'm' | 'l' | 'xl';

interface LoadableStyleProps {
  loading?: boolean;
  disableOnLoading?: boolean;
  spinnerSize?: SpinnerSize;
  blur?: boolean;
  spinnerPosition?: SpinnerPosition;
  backdrop?: boolean;
}

export type LoadableFlexProps<
  C extends React.ElementType = DefaultComponentType
> = React.PropsWithChildren<
  FlexAllProps<C, true> &
    LoadableStyleProps & {
      spinner?: boolean | React.ReactElement;
      spinnerClassName?: string;
    }
>;

const useStyles = makeStyles((theme: Theme) => {
  const loadingZIndex = 1000;
  const loadableFlexTheme = theme.rc?.LoadableFlex ?? {};

  return {
    root: ({ disableOnLoading, backdrop, blur, loading }: LoadableStyleProps) => ({
      position: 'relative',
      pointerEvents: loading && disableOnLoading ? 'none' : undefined,
      ...loadableFlexTheme.root,

      // Backdrop background
      ...(backdrop
        ? {
            '&::before': {
              content: loading ? '""' : 'unset', // Show backdrop
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              borderRadius: 'inherit',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              zIndex: loadingZIndex,
              ...(loadableFlexTheme.root?.['&::before'] as CSSProperties),
              ...loadableFlexTheme.backdrop,
            },
          }
        : undefined),

      ...(blur
        ? {
            '& > *:not($spinner)': {
              filter: 'blur(2px)',
              ...(loadableFlexTheme.root?.['& > *:not($spinner)'] as CSSProperties),
            },
          }
        : undefined),
    }),

    spinner: ({ spinnerSize, spinnerPosition }: LoadableStyleProps) => {
      return {
        position: 'absolute',
        zIndex: loadingZIndex,
        ...loadableFlexTheme.spinner,

        // stretch spinner by size
        '& > *': {
          width: '100%',
        },

        // Size
        ...(() => {
          if (spinnerSize === 'auto') {
            return {
              width: 'var(--rc--spinner-size-auto, 5%)',
              minWidth: '1em',
              maxWidth: 'var(--rc--spinner-size-auto-maxwidth, calc(50px + (20 * (1vw / 20))))', // flexible size by view port
              ...loadableFlexTheme.spinnerSizeAuto,
            };
          }
          if (spinnerSize === 'xs') {
            return {
              width: 'var(--rc--spinner-size-xs, 1em)',
              ...loadableFlexTheme.spinnerSizeXS,
            };
          }
          if (spinnerSize === 's') {
            return {
              width: 'var(--rc--spinner-size-s, 2em)',
              ...loadableFlexTheme.spinnerSizeS,
            };
          }
          if (spinnerSize === 'm') {
            return {
              width: 'var(--rc--spinner-size-m, 3em)',
              ...loadableFlexTheme.spinnerSizeM,
            };
          }
          if (spinnerSize === 'l') {
            return {
              width: 'var(--rc--spinner-size-l, 4em)',
              ...loadableFlexTheme.spinnerSizeL,
            };
          }
          if (spinnerSize === 'xl') {
            return {
              width: 'var(--rc--spinner-size-xl, 5em)',
              ...loadableFlexTheme.spinnerSizeXL,
            };
          }
          return {};
        })(),

        // Position
        ...(() => {
          if (spinnerPosition === 'center') {
            return {
              left: '50%',
              top: '50%',
              translate: '-50% -50%',
              ...loadableFlexTheme.spinnerPositionCenter,
            };
          }
          if (spinnerPosition === 'top') {
            return {
              left: '50%',
              top: '5%',
              translate: '-50% 0',
              ...loadableFlexTheme.spinnerPositionTop,
            };
          }
          if (spinnerPosition === 'left') {
            return {
              left: '5%',
              top: '50%',
              translate: '0 -50%',
              ...loadableFlexTheme.spinnerPositionLeft,
            };
          }
          if (spinnerPosition === 'right') {
            return {
              right: '5%',
              top: '50%',
              translate: '0 -50%',
              ...loadableFlexTheme.spinnerPositionRight,
            };
          }
          if (spinnerPosition === 'bottom') {
            return {
              left: '50%',
              bottom: '5%',
              translate: '-50% 0',
              ...loadableFlexTheme.spinnerPositionBottom,
            };
          }
          return {};
        })(),
      };
    },

    ring: loadableFlexTheme.ring ?? {},
  };
});

export default function LoadableFlex<C extends React.ElementType = DefaultComponentType>({
  loading,
  disableOnLoading,
  spinner = true,
  spinnerPosition = 'center',
  spinnerSize = 'auto',
  spinnerClassName,
  backdrop = true,
  blur,
  className,
  children,
  ...rest
}: LoadableFlexProps<C>): JSX.Element {
  const css = useStyles({
    classes: { root: className, spinner: spinnerClassName },
    loading,
    disableOnLoading,
    backdrop,
    blur,
    spinnerSize,
    spinnerPosition,
  });

  const spinnerElement =
    spinner && (typeof spinner === 'object' ? spinner : <Ring className={css.ring} />);

  return (
    <Flex className={css.root} data-loading={loading || undefined} {...rest}>
      {spinnerElement && loading && (
        <Flex center className={css.spinner}>
          {spinnerElement}
        </Flex>
      )}
      {children}
    </Flex>
  );
}
