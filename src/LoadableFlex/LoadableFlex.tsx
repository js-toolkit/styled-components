/* eslint-disable no-use-before-define */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { styled, keyframes } from '@mui/system';
import {
  Flex,
  type FlexAllProps,
  type DefaultComponentType,
  type FlexComponentProps,
} from 'reflexy/styled';
import type { CSSProperties } from '../theme';
import Ring from './Ring';

export type SpinnerPosition = 'top' | 'right' | 'left' | 'bottom' | 'center';
export type SpinnerSize = 'auto' | 'xs' | 's' | 'm' | 'l' | 'xl';

interface LoadableStyleProps {
  readonly loading?: boolean | undefined;
  readonly disableOnLoading?: boolean | undefined;
  readonly backdrop?: boolean | undefined;
  readonly blur?: boolean | number | undefined;
  readonly spinnerSize?: SpinnerSize | undefined;
  readonly spinnerPosition?: SpinnerPosition | undefined;
  readonly animation?: boolean | undefined;
}

export type LoadableFlexProps<C extends React.ElementType = DefaultComponentType> =
  FlexAllProps<C> &
    LoadableStyleProps & {
      readonly spinner?: boolean | React.ReactElement | undefined;
      readonly spinnerClassName?: string | undefined;
    };

const show = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const hide = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

const StyledRing = styled(Ring)(({ theme }) => ({
  // Stretch spinner by size
  width: '100%',
  ...theme.rc?.LoadableFlex?.ring,
}));

type RootProps = LoadableFlexProps & { keepShowing: boolean };

const Root = styled(
  ({ loading, keepShowing, ...rest }: RootProps) => (
    <Flex data-loading={!!loading || keepShowing || undefined} {...rest} />
  ),
  {
    shouldForwardProp: (key) => {
      const prop = key as keyof RootProps;
      return (
        prop !== 'disableOnLoading' &&
        prop !== 'keepShowing' &&
        prop !== 'backdrop' &&
        prop !== 'animation' &&
        prop !== 'blur'
      );
    },
  }
)(({ theme: { rc }, loading, disableOnLoading, keepShowing, backdrop, animation, blur }) => ({
  position: 'relative',
  pointerEvents: loading && disableOnLoading ? 'none' : undefined,
  ...rc?.LoadableFlex?.root,

  // Backdrop background
  '&::before': {
    content: backdrop && (loading || keepShowing) ? '""' : 'unset', // Show/hide backdrop
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    borderRadius: 'inherit',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    zIndex: 1000,
    ...(rc?.LoadableFlex?.root?.['&::before'] as CSSProperties),
    ...rc?.LoadableFlex?.backdrop,

    ...(animation && {
      opacity: +!!loading,
      animation: loading
        ? `${show} 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0ms`
        : `${hide} 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
    }),
  },

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  [`& > *:not(${SpinnerContainer})`]: {
    filter: blur ? `blur(${typeof blur === 'number' ? blur : 2}px)` : undefined,
  },
}));

type SpinnerContainerProps = FlexComponentProps<'div'> &
  Required<Pick<RootProps, 'animation' | 'loading' | 'spinnerSize' | 'spinnerPosition'>>;

const SpinnerContainer = styled(Flex, {
  shouldForwardProp: (key) => {
    const prop = key as keyof SpinnerContainerProps;
    return (
      prop !== 'animation' &&
      prop !== 'loading' &&
      prop !== 'spinnerSize' &&
      prop !== 'spinnerPosition'
    );
  },
  name: LoadableFlex.name,
  slot: 'spinner',
})<SpinnerContainerProps>(
  ({ theme: { rc }, loading, animation, spinnerSize, spinnerPosition }) => ({
    position: 'absolute',
    zIndex: 1000,
    opacity: animation ? +!!loading : undefined,
    pointerEvents: 'none',
    ...rc?.LoadableFlex?.spinner,

    // Size
    ...(() => {
      if (spinnerSize === 'auto') {
        return {
          width: 'var(--rc--spinner-size-auto, 5%)',
          minWidth: '1em',
          maxWidth: 'var(--rc--spinner-size-auto-maxwidth, calc(50px + (20 * (1vw / 20))))', // flexible size by view port
          ...rc?.LoadableFlex?.spinnerSizeAuto,
        };
      }
      if (spinnerSize === 'xs') {
        return {
          width: 'var(--rc--spinner-size-xs, 1em)',
          ...rc?.LoadableFlex?.spinnerSizeXS,
        };
      }
      if (spinnerSize === 's') {
        return {
          width: 'var(--rc--spinner-size-s, 2em)',
          ...rc?.LoadableFlex?.spinnerSizeS,
        };
      }
      if (spinnerSize === 'm') {
        return {
          width: 'var(--rc--spinner-size-m, 3em)',
          ...rc?.LoadableFlex?.spinnerSizeM,
        };
      }
      if (spinnerSize === 'l') {
        return {
          width: 'var(--rc--spinner-size-l, 4em)',
          ...rc?.LoadableFlex?.spinnerSizeL,
        };
      }
      if (spinnerSize === 'xl') {
        return {
          width: 'var(--rc--spinner-size-xl, 5em)',
          ...rc?.LoadableFlex?.spinnerSizeXL,
        };
      }
      return undefined;
    })(),

    // Position
    ...(() => {
      if (spinnerPosition === 'center') {
        return {
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          ...rc?.LoadableFlex?.spinnerPositionCenter,
        };
      }
      if (spinnerPosition === 'top') {
        return {
          left: '50%',
          top: '5%',
          transform: 'translate(-50%, 0)',
          ...rc?.LoadableFlex?.spinnerPositionTop,
        };
      }
      if (spinnerPosition === 'left') {
        return {
          left: '5%',
          top: '50%',
          transform: 'translate(0, -50%)',
          ...rc?.LoadableFlex?.spinnerPositionLeft,
        };
      }
      if (spinnerPosition === 'right') {
        return {
          right: '5%',
          top: '50%',
          transform: 'translate(0, -50%)',
          ...rc?.LoadableFlex?.spinnerPositionRight,
        };
      }
      if (spinnerPosition === 'bottom') {
        return {
          left: '50%',
          bottom: '5%',
          transform: 'translate(-50%, 0)',
          ...rc?.LoadableFlex?.spinnerPositionBottom,
        };
      }
      return undefined;
    })(),

    ...(animation && {
      animation: loading
        ? `${show} 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0ms`
        : `${hide} 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
    }),
  })
);

export default function LoadableFlex<C extends React.ElementType = DefaultComponentType>({
  loading = false,
  disableOnLoading,
  spinner = true,
  spinnerPosition = 'center',
  spinnerSize = 'auto',
  spinnerClassName,
  backdrop = true,
  blur,
  animation = true,
  children,
  ...rest
}: React.PropsWithChildren<LoadableFlexProps<C>>): JSX.Element {
  const [keepShowing, setKeepShowing] = useState(false);
  const loadingRef = useRef(false);
  loadingRef.current = loading;

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

  const spinnerElement = spinner && (typeof spinner === 'object' ? spinner : <StyledRing />);

  return (
    <Root
      loading={loading}
      disableOnLoading={disableOnLoading}
      keepShowing={keepShowing}
      backdrop={backdrop}
      animation={animation}
      blur={blur}
      {...rest}
    >
      {spinnerElement && (!!loading || keepShowing) && (
        <SpinnerContainer
          center
          loading={loading}
          animation={animation}
          spinnerSize={spinnerSize}
          spinnerPosition={spinnerPosition}
          onAnimationEnd={animationEndHandler}
          className={spinnerClassName}
        >
          {spinnerElement}
        </SpinnerContainer>
      )}
      {children}
    </Root>
  );
}
