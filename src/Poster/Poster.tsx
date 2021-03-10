import React, { useEffect, useMemo, useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import type { FlexComponentProps } from 'reflexy';
import loadImage from '@js-toolkit/web-utils/loadImage';
import takePicture from '@js-toolkit/web-utils/takePicture';
// import blobToDataUrl from '@js-toolkit/web-utils/blobToDataUrl';
import noop from '@js-toolkit/ts-utils/noop';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import HideableFlex, { HideableFlexProps } from '../HideableFlex';

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
    Pick<HideableFlexProps, 'hidden' | 'disposable'> {
  url: string;
  crossOrigin?: 'anonymous' | 'use-credentials' | null;
  showAfterLoad?: boolean;
  onLoaded?: VoidFunction;
  onShow?: VoidFunction;
  onHide?: VoidFunction;
  onError?: (error: unknown) => void;
}

export default function Poster({
  hidden,
  url: urlProp,
  crossOrigin,
  showAfterLoad = true,
  onLoaded,
  onShow,
  onHide,
  onError,
  className,
  style,
  ...rest
}: PosterProps): JSX.Element {
  const css = useStyles({ classes: { root: className } });
  const [url, setUrl] = useState(showAfterLoad ? '' : urlProp);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadImagePromise = useMemo(() => loadImage(urlProp, crossOrigin), [urlProp]);
  // const loadImagePromise = useMemo(
  //   () =>
  //     // With `mode: 'no-cors'` can't access to response body so blob length will 0.
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
    if (!showAfterLoad) return noop;
    let unmount = false;

    void loadImagePromise
      .then((img) => {
        if (unmount) return;
        const dataUrl = takePicture(img, { quality: 1 });
        setUrl(dataUrl);
      })
      .catch(onError ?? ((ex) => console.error(ex)))
      .finally(() => !unmount && onLoaded && onLoaded());

    return () => {
      unmount = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadImagePromise]);

  const transitionEndHandler = useRefCallback<React.TransitionEventHandler>((event) => {
    if (event.propertyName !== 'visibility') return;
    if (hidden) onHide && onHide();
    else onShow && onShow();
  });

  return (
    <HideableFlex
      hidden={hidden || !url}
      transitionTimingFunction={hidden ? 'ease-out' : 'ease-in'}
      transitionDuration="0.25s"
      onTransitionEnd={transitionEndHandler}
      className={css.root}
      style={url ? { ...style, backgroundImage: `url('${url}')` } : style}
      {...rest}
    />
  );
}
