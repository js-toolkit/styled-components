import React, { useCallback, useEffect, useRef, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, type FlexAllProps, type DefaultComponentType } from 'reflexy/styled';
import type { Theme, CSSProperties } from '../theme';
import Ring from './Ring';

export type SpinnerPosition = 'top' | 'right' | 'left' | 'bottom' | 'center';
export type SpinnerSize = 'auto' | 'xs' | 's' | 'm' | 'l' | 'xl';

interface LoadableStyleProps {
  readonly loading?: boolean | undefined;
  readonly disableOnLoading?: boolean | undefined;
  readonly backdrop?: boolean | undefined;
  readonly blur?: boolean | undefined;
  readonly spinnerSize?: SpinnerSize | undefined;
  readonly spinnerPosition?: SpinnerPosition | undefined;
  /** @deprecated Use `animation` */
  readonly transition?: boolean | undefined;
  readonly animation?: boolean | undefined;
}

export type LoadableFlexProps<C extends React.ElementType = DefaultComponentType> =
  React.PropsWithChildren<
    FlexAllProps<C> &
      LoadableStyleProps & {
        spinner?: boolean | React.ReactElement | undefined;
        spinnerClassName?: string | undefined;
      }
  >;

type MakeStylesProps = LoadableStyleProps & { keepShowing: boolean };

const useStyles = makeStyles((theme: Theme) => {
  const loadingZIndex = 1000;
  const loadableFlexTheme = theme.rc?.LoadableFlex ?? {};

  return {
    '@keyframes show': {
      '0%': { opacity: 0 },
      '100%': { opacity: 1 },
    },
    '@keyframes hide': {
      '0%': { opacity: 1 },
      '100%': { opacity: 0 },
    },

    root: {
      position: 'relative',
      pointerEvents: ({ loading, disableOnLoading }: MakeStylesProps) =>
        loading && disableOnLoading ? 'none' : undefined,
      ...loadableFlexTheme.root,

      // Backdrop background
      '&::before': {
        content: ({ loading, keepShowing, backdrop }: MakeStylesProps) =>
          backdrop && (loading || keepShowing) ? '""' : 'unset', // Show/hide backdrop
        // content: ({ backdrop }: MakeStylesProps) => (backdrop ? '""' : 'unset'), // Enable/disable backdrop
        opacity: ({ loading, animation }: MakeStylesProps) => (animation ? +!!loading : undefined),
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

      '& > *:not($spinner)': {
        filter: ({ blur }: MakeStylesProps) => (blur ? 'blur(2px)' : undefined),
        ...(loadableFlexTheme.root?.['& > *:not($spinner)'] as CSSProperties),
      },
    },

    showBackdrop: {
      '&::before': {
        animation: `$show 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
      },
    },
    hideBackdrop: {
      '&::before': {
        animation: `$hide 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
      },
    },
    showSpinner: {
      animation: `$show 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
    },
    hideSpinner: {
      animation: `$hide 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
    },

    spinner: ({ animation, loading, spinnerSize, spinnerPosition }: MakeStylesProps) => ({
      position: 'absolute',
      zIndex: loadingZIndex,
      opacity: animation ? +!!loading : undefined,
      ...loadableFlexTheme.spinner,

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
            transform: 'translate(-50%, -50%)',
            ...loadableFlexTheme.spinnerPositionCenter,
          };
        }
        if (spinnerPosition === 'top') {
          return {
            left: '50%',
            top: '5%',
            transform: 'translate(-50%, 0)',
            ...loadableFlexTheme.spinnerPositionTop,
          };
        }
        if (spinnerPosition === 'left') {
          return {
            left: '5%',
            top: '50%',
            transform: 'translate(0, -50%)',
            ...loadableFlexTheme.spinnerPositionLeft,
          };
        }
        if (spinnerPosition === 'right') {
          return {
            right: '5%',
            top: '50%',
            transform: 'translate(0, -50%)',
            ...loadableFlexTheme.spinnerPositionRight,
          };
        }
        if (spinnerPosition === 'bottom') {
          return {
            left: '50%',
            bottom: '5%',
            transform: 'translate(-50%, 0)',
            ...loadableFlexTheme.spinnerPositionBottom,
          };
        }
        return {};
      })(),
    }),

    ring: {
      // Stretch spinner by size
      width: '100%',
      ...loadableFlexTheme.ring,
    },
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
  transition = true,
  animation = transition ?? true,
  className,
  children,
  ...rest
}: LoadableFlexProps<C>): JSX.Element {
  const [keepShowing, setKeepShowing] = useState(false);
  const loadingRef = useRef(false);
  loadingRef.current = !!loading;

  const css = useStyles({
    classes: { root: className, spinner: spinnerClassName },
    animation,
    loading,
    keepShowing,
    disableOnLoading,
    backdrop,
    blur,
    spinnerSize,
    spinnerPosition,
  });

  const animationEndHandler = useCallback<React.AnimationEventHandler>(() => {
    // console.log('animationEnd', event.animationName);
    // animationName will changed in prod so we can't use it to detect what animation is ended
    if (!loadingRef.current) {
      setKeepShowing(false);
    }
  }, []);

  useEffect(() => {
    // console.log('update loading', loading);
    if (animation && loading) setKeepShowing(true);
    else if (!animation && !loading) setKeepShowing(false);
  }, [animation, loading]);

  const spinnerElement =
    spinner && (typeof spinner === 'object' ? spinner : <Ring className={css.ring} />);

  const backdropAnimation = animation ? ` ${loading ? css.showBackdrop : css.hideBackdrop}` : '';
  const spinnerAnimation = animation ? ` ${loading ? css.showSpinner : css.hideSpinner}` : '';

  return (
    <Flex
      className={`${css.root}${backdropAnimation}`}
      data-loading={!!loading || keepShowing || undefined}
      {...rest}
    >
      {spinnerElement && (!!loading || keepShowing) && (
        <Flex
          center
          className={`${css.spinner}${spinnerAnimation}`}
          onAnimationEnd={animationEndHandler}
        >
          {spinnerElement}
        </Flex>
      )}
      {children}
    </Flex>
  );
}
