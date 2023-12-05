/* eslint-disable no-await-in-loop */
import React, { useEffect, useState } from 'react';
import styled from '@mui/system/styled';
import type { FlexComponentProps } from 'reflexy/styled';
import { loadImage } from '@js-toolkit/web-utils/loadImage';
import { takeSnapshot } from '@js-toolkit/web-utils/takeSnapshot';
import { isWebPSupported } from '@js-toolkit/web-utils/isWebPSupported';
import TransitionFlex, { type HideableProps } from '../TransitionFlex';
import type { PictureProps } from '../Picture';

export interface PosterProps
  extends FlexComponentProps,
    Pick<
      HideableProps,
      'hidden' | 'disposable' | 'onShown' | 'onHidden' | 'transitionDuration' | 'transitionProps'
    >,
    Pick<
      PictureProps,
      'src' | 'crossOrigin' | 'timeout' | 'onLoadTimeout' | 'onLoadCompleted' | 'onError'
    > {}

export default styled(function Poster({
  hidden,
  src: srcProp,
  crossOrigin,
  timeout,
  transitionProps,
  onLoadTimeout,
  onLoadCompleted,
  onError,
  style,
  ...rest
}: PosterProps): JSX.Element {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const tryLoad = async (): Promise<HTMLImageElement> => {
      if (typeof srcProp === 'string') {
        return loadImage({ src: srcProp, crossOrigin });
      }

      let img: HTMLImageElement | undefined;
      let webpSupported: boolean | undefined;

      for (const { type, media, ...srcsetRest } of srcProp.srcset ?? []) {
        try {
          let load = true;
          if (type === 'image/webp') {
            load = webpSupported ?? (webpSupported = await isWebPSupported());
          }
          if (load) {
            load = !media || window.matchMedia(media).matches;
          }
          img = load ? await loadImage({ ...srcsetRest, crossOrigin }) : undefined;
          if (img) break;
        } catch {
          //
        }
      }

      if (!img) {
        return loadImage({ src: srcProp.src, crossOrigin });
      }

      return img;
    };

    let unmounted = false;

    const timer = (timeout ?? 0) > 0 && onLoadTimeout ? setTimeout(onLoadTimeout, timeout) : 0;

    tryLoad()
      .then((img) => {
        clearTimeout(timer);
        if (unmounted) return;
        const dataUrl = takeSnapshot(img, { quality: 1 });
        setUrl(dataUrl);
      })
      .catch((ex) => {
        clearTimeout(timer);
        if (!unmounted) {
          if (onError) onError(ex);
          else console.error(ex);
        }
      })
      .finally(() => !unmounted && onLoadCompleted && onLoadCompleted());

    return () => {
      unmounted = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crossOrigin, srcProp, timeout]);

  return (
    <TransitionFlex
      hidden={hidden ?? !url}
      transitionDuration={250}
      transitionProps={{ easing: { enter: 'ease-in', exit: 'ease-out' }, ...transitionProps }}
      style={url ? { ...style, backgroundImage: `url('${url}')` } : style}
      {...rest}
    />
  );
})({
  pointerEvents: 'none',
  touchAction: 'none',
  userSelect: 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
});
