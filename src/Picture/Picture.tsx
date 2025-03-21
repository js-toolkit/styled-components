import React, { useLayoutEffect, useRef, useState } from 'react';
import styled from '@mui/system/styled';
import type { FlexComponentProps } from 'reflexy/styled';
import { TimeoutError } from '@js-toolkit/utils/TimeoutError';
import useMemoDestructor from '@js-toolkit/react-hooks/useMemoDestructor';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import TransitionFlex, { type HideableProps } from '../TransitionFlex';

export interface PictureSources {
  /** Fallback or default src. */
  readonly src: string;
  readonly srcset?:
    | {
        readonly src: string;
        readonly type?: string | undefined;
        readonly media?: string | undefined;
      }[]
    | undefined;
}

export interface PictureProps
  extends FlexComponentProps,
    Pick<
      HideableProps,
      | 'hidden'
      | 'appear'
      | 'disposable'
      | 'onShown'
      | 'onHidden'
      | 'transitionDuration'
      | 'transitionProps'
    >,
    Pick<
      React.ImgHTMLAttributes<unknown>,
      'crossOrigin' | 'decoding' | 'fetchPriority' | 'loading' | 'referrerPolicy'
    > {
  readonly src: string | PictureSources;
  readonly timeout?: number | undefined;
  /** `error` is instance of `@js-toolkit/utils/TimeoutError` if timeout exceeded. */
  readonly onLoadCompleted?: ((src: string, error?: unknown) => void) | undefined;
}

export default styled(
  ({
    hidden,
    src: srcProp,
    crossOrigin,
    decoding,
    fetchPriority = 'auto',
    loading,
    referrerPolicy,
    timeout,
    transitionProps,
    onLoadCompleted,
    ...rest
  }: PictureProps) => {
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const timerRef = useRef(0);

    const [sources, variants] = useMemoDestructor(() => {
      const normalizedSrc = typeof srcProp === 'string' ? { src: srcProp } : srcProp;

      timerRef.current =
        (timeout ?? 0) > 0 && onLoadCompleted
          ? window.setTimeout(() => {
              onLoadCompleted(
                imgRef.current?.currentSrc ?? '',
                new TimeoutError(`Timeout of ${timeout}ms exceeded.`)
              );
            }, timeout)
          : 0;

      return [
        [
          normalizedSrc,
          <>
            {normalizedSrc.srcset?.map(({ src, ...srcRest }) => (
              <source key={src} {...srcRest} srcSet={src} />
            ))}
            <img
              ref={imgRef}
              crossOrigin={crossOrigin}
              decoding={decoding}
              fetchPriority={fetchPriority}
              loading={loading}
              referrerPolicy={referrerPolicy}
              alt=""
            />
          </>,
        ],

        () => {
          clearTimeout(timerRef.current);
        },
      ];
    }, [
      crossOrigin,
      decoding,
      fetchPriority,
      loading,
      onLoadCompleted,
      referrerPolicy,
      srcProp,
      timeout,
    ]);

    // The trick to workaround the WebKit bug (https://bugs.webkit.org/show_bug.cgi?id=190031)
    // to do not load img together with selected source.
    // Se also https://habr.com/ru/post/682014/
    useLayoutEffect(() => {
      const { current: img } = imgRef;
      if (!img) return;
      img.src = sources.src;
    }, [sources]);

    const loadHandler = useRefCallback<React.ReactEventHandler<HTMLImageElement>>(() => {
      clearTimeout(timerRef.current);
      setLoaded(true);
      onLoadCompleted && onLoadCompleted(imgRef.current?.currentSrc ?? '');
    });

    const errorHandler = useRefCallback<React.ReactEventHandler>((ev) => {
      clearTimeout(timerRef.current);
      const error = ev.nativeEvent;
      if (onLoadCompleted) onLoadCompleted(imgRef.current?.currentSrc ?? '', error);
      else console.error(error);
    });

    return (
      <TransitionFlex
        hidden={hidden ?? !loaded}
        transitionDuration={250}
        transitionProps={{ easing: { enter: 'ease-in', exit: 'ease-out' }, ...transitionProps }}
        component="picture"
        flex={false}
        onLoad={loadHandler}
        onError={errorHandler}
        {...rest}
      >
        {variants}
      </TransitionFlex>
    );
  },
  { name: 'Picture' }
)({
  '&, & img': {
    pointerEvents: 'none',
    touchAction: 'none',
    userSelect: 'none',
  },

  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    overflow: 'clip', // https://github.com/WICG/view-transitions/blob/main/debugging_overflow_on_images.md
    borderRadius: 'inherit',
  },
});
