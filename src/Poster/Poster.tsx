import React, { useCallback, useEffect, useMemo, useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import type { FlexComponentProps } from 'reflexy';
import loadImage from '@vlazh/web-utils/loadImage';
import takePicture from '@vlazh/web-utils/takePicture';
import noop from '@vzh/ts-utils/noop';
import HideableFlex, { HideableFlexProps } from '../HideableFlex';

// type MakeStylesProps = Pick<PosterProps, 'url'>;

const useStyles = makeStyles({
  root: {
    pointerEvents: 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    // backgroundImage: ({ url }: MakeStylesProps) => (url ? `url('${url}')` : ''),
  },
});

export interface PosterProps
  extends FlexComponentProps,
    Pick<HideableFlexProps, 'hidden' | 'disposable'> {
  url: string;
  crossOrigin?: HTMLImageElement['crossOrigin'];
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

  useEffect(() => {
    if (!showAfterLoad) return noop;
    let unmount = false;

    void loadImagePromise
      // void loadImage(urlProp, crossOrigin)
      .then((img) => {
        if (unmount) return;
        const dataUrl = takePicture(img, { width: img.width, height: img.height, quality: 1 });
        setUrl(dataUrl);
      })
      .catch(onError ?? ((ex) => console.error(ex)))
      .finally(() => !unmount && onLoaded && onLoaded());

    return () => {
      unmount = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadImagePromise, urlProp]);

  const transitionEndHandler = useCallback<React.TransitionEventHandler>(
    (event) => {
      if (event.propertyName !== 'visibility') return;
      if (hidden) onHide && onHide();
      else onShow && onShow();
    },
    [hidden, onHide, onShow]
  );

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
