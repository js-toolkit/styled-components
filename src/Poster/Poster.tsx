import React from 'react';
import useHideableState from '@js-toolkit/react-hooks/useHideableState';
import useMemoDestructor from '@js-toolkit/react-hooks/useMemoDestructor';
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
  const state0 = useHideableState(
    () => ({ enabled: !!(src && src0), visible: !!(src && src0) }),
    [src, src0]
  );

  const shownHandler = useMemoDestructor(() => {
    let timer = 0;
    return [
      () => {
        // Use src0 just for deps correct linting.
        if (src && src0) {
          // In order to avoid a blink on hide level0 img.
          timer = setTimeout(state0.hide, 100);
        }
        onShown && onShown();
      },
      () => clearTimeout(timer),
    ];
  }, [onShown, src, src0, state0.hide]);

  const hasLevel0 = !!(src0 && state0.enabled);

  return (
    <>
      {hasLevel0 && (
        <Picture
          src={src0}
          hidden={hidden || state0.hidden}
          timeout={timeout}
          onHidden={state0.disable}
          {...rest}
        />
      )}
      <Picture
        hidden={hidden || (hasLevel0 ? undefined : hidden)}
        src={src}
        timeout={src0 ? undefined : timeout}
        onShown={src0 ? shownHandler : onShown}
        onHidden={onHidden}
        {...rest}
      />
    </>
  );
}
