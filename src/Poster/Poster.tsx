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
  timeout,
  onShown,
  onHidden,
  ...rest
}: PosterProps): React.JSX.Element {
  const state0 = useHideableState(() => ({ enabled: !!src0, visible: !!src0 }), [src0]);

  const shownHandler = useRefCallback(() => {
    state0.hide();
    onShown && onShown();
  });

  const hasLevel0 = !!(src0 && state0.enabled);

  // Order has matter in order to avoid a blink on hide l0 img.
  return (
    <>
      <Picture
        hidden={hidden || (hasLevel0 ? undefined : hidden)}
        src={src}
        timeout={src0 ? undefined : timeout}
        onShown={src0 ? shownHandler : onShown}
        onHidden={onHidden}
        {...rest}
      />
      {hasLevel0 && (
        <Picture
          src={src0}
          hidden={hidden || state0.hidden}
          timeout={timeout}
          transitionProps={{ easing: { enter: 'ease-in', exit: 'linear' } }}
          onHidden={state0.disable}
          {...rest}
        />
      )}
    </>
  );
}
