import React from 'react';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import useHideableState from '@js-toolkit/react-hooks/useHideableState';
import Picture, { type PictureProps } from '../Picture';

export interface PosterProps extends PictureProps {
  /** Low quality img source which will be used while normal img is loading. Eg. data url. */
  readonly src0?: string;
}

export default function Poster({
  src,
  src0,
  hidden,
  onLoadCompleted,
  onLoadTimeout,
  onShown,
  onHidden,
  ...rest
}: PosterProps): React.JSX.Element {
  const state = useHideableState(() => {
    return { enabled: !!src0, visible: !!src0 };
  }, [src0]);

  const shownHandler = useRefCallback(() => {
    state.hide();
    onShown && onShown();
  });

  const hasLevel0 = !!(src0 && state.enabled);

  return (
    <>
      {hasLevel0 && (
        <Picture
          src={src0}
          hidden={hidden || state.hidden}
          onHidden={state.disable}
          onLoadCompleted={onLoadCompleted}
          {...rest}
        />
      )}
      <Picture
        hidden={hidden || (hasLevel0 ? undefined : hidden)}
        src={src}
        onLoadCompleted={onLoadCompleted}
        onLoadTimeout={onLoadTimeout}
        onShown={hasLevel0 ? shownHandler : onShown}
        onHidden={onHidden}
        {...rest}
      />
    </>
  );
}
