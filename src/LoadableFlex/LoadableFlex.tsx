import React, { useState, useEffect, useCallback } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Flex, FlexAllProps, DefaultComponentType } from 'reflexy/styled';
import Theme, { CSSProperties } from '../Theme';
import Ring from './Ring';

export type SpinnerPosition = 'top' | 'right' | 'left' | 'bottom' | 'center';
export type SpinnerSize = 'auto' | 'xs' | 's' | 'm' | 'l' | 'xl';

interface LoadableStyleProps {
  loading?: boolean;
  disableOnLoading?: boolean;
  backdrop?: boolean;
  blur?: boolean;
  spinnerSize?: SpinnerSize;
  spinnerPosition?: SpinnerPosition;
  transition?: boolean;
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

type MakeStylesProps = LoadableStyleProps & { showLoading?: boolean };

const useStyles = makeStyles((theme: Theme) => {
  const loadingZIndex = 1000;
  const loadableFlexTheme = theme.rc?.LoadableFlex ?? {};
  const loadingTransition = 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0ms';

  return {
    root: {
      position: 'relative',
      pointerEvents: ({ loading, disableOnLoading }: MakeStylesProps) =>
        loading && disableOnLoading ? 'none' : undefined,
      ...loadableFlexTheme.root,

      // Backdrop background
      '&::before': {
        content: ({ loading, showLoading, backdrop }: MakeStylesProps) =>
          backdrop && (loading || showLoading) ? '""' : 'unset', // Show/hide backdrop
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        zIndex: loadingZIndex,
        transition: ({ transition }: MakeStylesProps) =>
          transition ? loadingTransition : undefined,
        opacity: ({ loading, transition }: MakeStylesProps) =>
          transition ? (loading ? 1 : 0) : undefined,
        ...(loadableFlexTheme.root?.['&::before'] as CSSProperties),
        ...loadableFlexTheme.backdrop,
      },

      '& > *:not($spinner)': {
        filter: ({ blur }: MakeStylesProps) => (blur ? 'blur(2px)' : undefined),
        ...(loadableFlexTheme.root?.['& > *:not($spinner)'] as CSSProperties),
      },
    },

    spinner: ({ loading, transition, spinnerSize, spinnerPosition }: MakeStylesProps) => ({
      position: 'absolute',
      zIndex: loadingZIndex,
      transition: transition ? loadingTransition : undefined,
      opacity: transition ? (loading ? 1 : 0) : undefined,
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
  className,
  children,
  ...rest
}: LoadableFlexProps<C>): JSX.Element {
  const [showLoading, setShowLoading] = useState(false);

  const css = useStyles({
    classes: { root: className, spinner: spinnerClassName },
    loading,
    showLoading,
    transition,
    disableOnLoading,
    backdrop,
    blur,
    spinnerSize,
    spinnerPosition,
  });

  const stopShowLoading = useCallback<React.TransitionEventHandler>(
    (event) => {
      if (event.propertyName !== 'opacity') return;
      !loading && showLoading && setShowLoading(false);
    },
    [loading, showLoading]
  );

  useEffect(() => {
    transition && loading && setShowLoading(loading);
  }, [loading, transition]);

  const spinnerElement =
    spinner && (typeof spinner === 'object' ? spinner : <Ring className={css.ring} />);

  return (
    <Flex className={css.root} data-loading={loading || showLoading || undefined} {...rest}>
      {spinnerElement && (loading || showLoading) && (
        <Flex
          center
          className={css.spinner}
          onTransitionEnd={transition ? stopShowLoading : undefined}
        >
          {spinnerElement}
        </Flex>
      )}
      {children}
    </Flex>
  );
}
