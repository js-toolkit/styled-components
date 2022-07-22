import React, { useEffect, useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import type { FlexComponentProps } from 'reflexy';
import loadImage from '@jstoolkit/web-utils/loadImage';
import { takeSnapshot } from '@jstoolkit/web-utils/takeSnapshot';
import { isImageTypeSupported } from '@jstoolkit/web-utils/isImageTypeSupported';
import noop from '@jstoolkit/utils/noop';
import useUpdatedRefState from '@jstoolkit/react-hooks/useUpdatedRefState';
import TransitionFlex, { HideableProps } from '../TransitionFlex';

const useStyles = makeStyles({
  root: {
    pointerEvents: 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
  },
});

export interface PosterProps
  extends FlexComponentProps,
    Pick<
      HideableProps,
      'hidden' | 'disposable' | 'onShown' | 'onHidden' | 'transitionDuration' | 'transitionProps'
    > {
  src:
    | string
    | PartialSome<
        Pick<HTMLSourceElement, 'type' | 'src' | 'srcset' | 'sizes'>,
        'srcset' | 'sizes'
      >[];
  crossOrigin?: 'anonymous' | 'use-credentials' | null;
  useRegularUrl?: boolean;
  timeout?: number;
  onLoadTimeout?: VoidFunction;
  onLoadCompleted?: VoidFunction;
  onError?: (error: unknown) => void;
}

export default function Poster({
  hidden,
  src: srcProp,
  crossOrigin,
  useRegularUrl,
  timeout,
  transitionProps,
  onLoadTimeout,
  onLoadCompleted,
  onError,
  className,
  style,
  ...rest
}: PosterProps): JSX.Element {
  const css = useStyles({ classes: { root: className } });

  const selectedSrc = useMemo(() => {
    if (typeof srcProp === 'string') return { src: srcProp };
    const img = srcProp.find(({ type }) => isImageTypeSupported(type));
    if (!img) return undefined;
    const { type, ...src } = img;
    return src;
  }, [srcProp]);

  const [getUrl, setUrl] = useUpdatedRefState(useRegularUrl ? selectedSrc?.src : '', [
    selectedSrc,
    useRegularUrl,
  ]);

  const loadImagePromise = useMemo(() => {
    return useRegularUrl
      ? undefined
      : (selectedSrc && loadImage({ ...selectedSrc, crossOrigin })) ||
          Promise.reject(new Error('Unsupported type of image.'));
  }, [useRegularUrl, selectedSrc, crossOrigin]);
  // const loadImagePromise = useMemo(
  //   () =>
  //     // With `mode: 'no-cors'` unable to access to the response body so the blob length will 0.
  //     window
  //       .fetch(urlProp, {
  //         method: 'GET',
  //         mode: 'cors',
  //         credentials:
  //           (crossOrigin === 'anonymous' && 'omit') ||
  //           (crossOrigin === 'use-credentials' && 'include') ||
  //           undefined,
  //         cache: 'default',
  //       })
  //       .then((res) => res.blob())
  //       .then((blob) => (blob.size > 0 ? blobToDataUrl(blob) : '')),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [urlProp]
  // );

  useEffect(() => {
    if (!loadImagePromise) return noop;
    let unmounted = false;

    const timer =
      timeout != null && timeout > 0 && onLoadTimeout ? setTimeout(onLoadTimeout, timeout) : 0;

    void loadImagePromise
      .then((img) => {
        clearTimeout(timer);
        if (unmounted) return;
        const dataUrl = takeSnapshot(img, { quality: 1 });
        setUrl(dataUrl);
      })
      .catch((ex) => !unmounted && (onError ? onError(ex) : console.error(ex)))
      .finally(() => !unmounted && onLoadCompleted && onLoadCompleted());

    return () => {
      unmounted = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadImagePromise]);

  const url = getUrl();

  return (
    <TransitionFlex
      hidden={hidden ?? !url}
      transitionDuration={250}
      transitionProps={{ easing: { enter: 'ease-in', exit: 'ease-out' }, ...transitionProps }}
      className={css.root}
      style={url ? { ...style, backgroundImage: `url('${url}')` } : style}
      {...rest}
    />
  );
}
