/* eslint-disable no-await-in-loop */
import React, { useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import type { FlexComponentProps } from 'reflexy';
import loadImage from '@jstoolkit/web-utils/loadImage';
import { takeSnapshot } from '@jstoolkit/web-utils/takeSnapshot';
import { isWebPSupported } from '@jstoolkit/web-utils/isWebPSupported';
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
  timeout?: number;
  onLoadTimeout?: VoidFunction;
  onLoadCompleted?: VoidFunction;
  onError?: (error: unknown) => void;
}

export default function Poster({
  hidden,
  src: srcProp,
  crossOrigin,
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
  const [url, setUrl] = useState('');

  useEffect(() => {
    const tryLoad = async (): Promise<HTMLImageElement> => {
      const list = typeof srcProp === 'string' ? [{ src: srcProp, type: '' }] : srcProp;
      let img: HTMLImageElement | undefined;

      for (const { type, ...imgSrc } of list) {
        try {
          let load = true;
          if (type.toLowerCase() === 'image/webp') {
            load = await isWebPSupported();
          }
          img = load ? await loadImage({ ...imgSrc, crossOrigin }) : undefined;
          if (img) break;
        } catch {
          //
        }
      }

      if (!img) throw new Error('Unsupported type of image.');
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
      .catch((ex) => !unmounted && (onError ? onError(ex) : console.error(ex)))
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
      className={css.root}
      style={url ? { ...style, backgroundImage: `url('${url}')` } : style}
      {...rest}
    />
  );
}
