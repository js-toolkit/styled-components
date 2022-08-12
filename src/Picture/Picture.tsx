import React, { useCallback, useRef, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import type { FlexComponentProps } from 'reflexy';
import useMemoDestructor from '@jstoolkit/react-hooks/useMemoDestructor';
import TransitionFlex, { HideableProps } from '../TransitionFlex';

const useStyles = makeStyles({
  root: {
    pointerEvents: 'none',

    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
});

export interface PictureProps
  extends FlexComponentProps,
    Pick<
      HideableProps,
      'hidden' | 'disposable' | 'onShown' | 'onHidden' | 'transitionDuration' | 'transitionProps'
    > {
  src:
    | string
    | {
        /** Fallback or default src */
        src: string;
        srcset?: { src: string; type?: string; media?: string }[];
      };
  crossOrigin?: React.ImgHTMLAttributes<unknown>['crossOrigin'];
  timeout?: number;
  onLoadTimeout?: VoidFunction;
  onLoadCompleted?: VoidFunction;
  onError?: (error: unknown) => void;
}

export default function Picture({
  hidden,
  src: srcProp,
  crossOrigin,
  timeout,
  transitionProps,
  onLoadTimeout,
  onLoadCompleted,
  onError,
  className,
  ...rest
}: PictureProps): JSX.Element {
  const css = useStyles({ classes: { root: className } });
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef(0);

  const picture = useMemoDestructor(() => {
    const normalizedSrc = typeof srcProp === 'string' ? { src: srcProp } : srcProp;

    timerRef.current = (timeout ?? 0) > 0 && onLoadTimeout ? setTimeout(onLoadTimeout, timeout) : 0;

    return [
      <>
        {normalizedSrc.srcset?.map(({ src, ...srcRest }) => (
          <source key={src} srcSet={src} {...srcRest} />
        ))}
        <img src={normalizedSrc.src} alt="" crossOrigin={crossOrigin} />
      </>,

      () => {
        clearTimeout(timerRef.current);
      },
    ];
  }, [crossOrigin, srcProp]);

  const loadHandler = useCallback(() => {
    clearTimeout(timerRef.current);
    setLoaded(true);
    onLoadCompleted && onLoadCompleted();
  }, [onLoadCompleted]);

  const errorHandler = useCallback(
    (err: unknown) => {
      clearTimeout(timerRef.current);
      onError && onError(err);
    },
    [onError]
  );

  return (
    <TransitionFlex
      hidden={hidden ?? !loaded}
      transitionDuration={250}
      transitionProps={{ easing: { enter: 'ease-in', exit: 'ease-out' }, ...transitionProps }}
      component="picture"
      flex={false}
      onLoad={loadHandler}
      onError={errorHandler}
      className={css.root}
      {...rest}
    >
      {picture}
    </TransitionFlex>
  );
}
