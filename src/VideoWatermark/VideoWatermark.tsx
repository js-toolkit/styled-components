import React, { useLayoutEffect, useRef } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import useTheme from '@mui/styles/useTheme';
import Fade from '@mui/material/Fade';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import type { FlexComponentProps } from 'reflexy';
import type { Size } from '@jstoolkit/utils/types/utils';
import toInt from '@jstoolkit/utils/toInt';
import noop from '@jstoolkit/utils/noop';
import useRefState from '@jstoolkit/react-hooks/useRefState';
import useUpdate from '@jstoolkit/react-hooks/useUpdate';
import useRefs from '@jstoolkit/react-hooks/useRefs';
import useHideableState from '@jstoolkit/react-hooks/useHideableState';
import useUpdatedRef from '@jstoolkit/react-hooks/useUpdatedRef';
import TransitionFlex from '../TransitionFlex';
import WatermarkField from '../WatermarkField';
import type { Theme } from '../theme';
import { getShowController } from './getShowController';
import { getRandomShowController } from './getRandomShowController';

export type VideoWatermarkProps = FlexComponentProps &
  Partial<Point> &
  Partial<Size> & {
    text: string;
    baseFontSize?: number | undefined;
    scaleBySize?: number | undefined;
    visibleTimeout?: number | undefined;
    hiddenTimeout?: number | undefined;
    /** Used with random mode. */
    updateTimeout?: number | undefined;
  } & (
    | { mode: 'random'; videoRef: React.RefObject<HTMLVideoElement> }
    | { mode?: 'stripes' | undefined; videoRef?: React.RefObject<HTMLVideoElement> | undefined }
  );

const useStyles = makeStyles(({ rc }: Theme) => {
  const textStyles: React.CSSProperties = {
    position: 'absolute',
    visibility: 'hidden',
    opacity: 0,
    zIndex: -1,
    whiteSpace: 'nowrap',
    display: 'inline-block',
  };

  return {
    root: {
      // '&::before': {
      //   ...Watermark,
      //   position: 'absolute',
      //   top: '50%',
      //   left: '50%',
      //   width: ({ width, height }: MakeStylesProps) => getHipotenuza(width, height),
      //   height: ({ width, height }: MakeStylesProps) => getTriangleHeight(width, height) * 2,
      //   transform: ({ width, height }: MakeStylesProps) =>
      //     `translate(-50%, -50%) rotate(-${getAngleA(width, height)}deg)`,
      //   backgroundImage: ({ image }: MakeStylesProps) => image,
      //   content: '""',
      // },
      position: 'absolute',
      fontSize: 'inherit',
    },

    textStripes: {
      ...rc?.VideoWatermark?.default,
      ...rc?.VideoWatermark?.stripes,
      ...textStyles,
    },

    textRandom: {
      ...rc?.VideoWatermark?.default,
      ...rc?.VideoWatermark?.random,
      ...textStyles,
    },

    stripes: {
      ...rc?.VideoWatermark?.default,
      ...rc?.VideoWatermark?.stripes,
    },

    random: {
      // transition: 'left 0.2s linear, top 0.2s linear',
      ...rc?.VideoWatermark?.default,
      ...rc?.VideoWatermark?.random,
      position: 'absolute',
    },
  };
});

function scaleFontSize(baseFontSize: number, scale: number, width: number, height: number): number {
  const minSize = Math.min(width, height);
  return Math.floor(baseFontSize * ((minSize / 100) * scale));
}

export default React.memo(function VideoWatermark({
  videoRef,
  text,
  mode = 'stripes',
  updateTimeout,
  baseFontSize,
  scaleBySize,
  visibleTimeout,
  hiddenTimeout,
  x,
  y,
  width: _width,
  height: _height,
  className,
  ...rest
}: VideoWatermarkProps): JSX.Element {
  const css = useStyles({ classes: { root: className } });
  const rootRef = useRef<HTMLDivElement>(null);
  const forceUpdate = useUpdate();
  const setRootRef = useRefs(rootRef, forceUpdate);
  const textRef = useRef<HTMLDivElement>(null);
  const [getTextSize, setTextSize] = useRefState({ textWidth: 0, textHeight: 0 });
  const [getCoord, setCoord] = useRefState<Point | undefined>(undefined);

  const hideable = useHideableState({ enabled: true, visible: true });

  const widthProp = _width && toInt(_width);
  const heightProp = _height && toInt(_height);

  const actualWidth = widthProp ?? rootRef.current?.offsetWidth;
  const actualHeight = heightProp ?? rootRef.current?.offsetHeight;

  const fontSize = (() => {
    if (baseFontSize && scaleBySize) {
      if (!actualWidth || !actualHeight) return undefined;
      return scaleFontSize(baseFontSize, scaleBySize, actualWidth, actualHeight);
    }
    return baseFontSize;
  })();

  // const watermarkImg = useMemo(() => {
  //   const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${textWidth}" height="${textHeight}">
  // 		<text y="${textHeight}" fill="red">${text}</text>
  // 	</svg>`;
  //   return `url("${base64ToDataUrl(toBase64(svg), 'image/svg+xml')}")`;
  // }, [text, textHeight, textWidth]);

  const sizeRef = useUpdatedRef<Size | undefined>(
    actualWidth && actualHeight ? { width: actualWidth, height: actualHeight } : undefined
  );

  useLayoutEffect(() => {
    const { current: textEl } = textRef;
    if (!textEl) return;
    if (baseFontSize && !fontSize) return;
    const { width: textWidth, height: textHeight } = textEl.getBoundingClientRect();
    setTextSize({ textWidth, textHeight });
    // console.log(textWidth, textHeight, textEl.clientWidth, textEl.clientHeight);
  }, [setTextSize, baseFontSize, fontSize, text]);

  useLayoutEffect(() => {
    if (!videoRef || mode === 'random' || !visibleTimeout || !hiddenTimeout) return noop;
    const { current: video } = videoRef;
    if (!video) return noop;

    const showController = getShowController({
      visibleTimeout,
      hiddenTimeout,
      isVisible: () => hideable.visible,
      onShow: hideable.show,
      onHide: hideable.hide,
    });

    video.addEventListener('play', showController.start);
    video.addEventListener('pause', showController.stop);

    if (!video.paused) showController.start();

    return () => {
      video.removeEventListener('play', showController.start);
      video.removeEventListener('pause', showController.stop);
      showController.reset();
    };
  }, [hiddenTimeout, hideable, mode, videoRef, visibleTimeout]);

  useLayoutEffect(() => {
    if (!videoRef || mode !== 'random' || (baseFontSize && !fontSize) || !text) return noop;
    const { current: video } = videoRef;
    if (!video) return noop;

    const randomController = getRandomShowController({
      updateTimeout,
      getBounds: () => {
        const { textWidth, textHeight } = getTextSize();
        const { width = 0, height = 0 } = sizeRef.current ?? {};
        const maxX = width - textWidth;
        const maxY = height - textHeight;
        return { x: maxX, y: maxY };
      },
      onUpdate: setCoord,
      showOptions:
        visibleTimeout && hiddenTimeout
          ? {
              visibleTimeout,
              hiddenTimeout,
              isVisible: () => hideable.visible,
              onShow: hideable.show,
              onHide: hideable.hide,
            }
          : undefined,
    });

    video.addEventListener('play', randomController.start);
    video.addEventListener('pause', randomController.stop);

    if (!video.paused) randomController.start();
    else if (hideable.visible) randomController.update();

    return () => {
      video.removeEventListener('play', randomController.start);
      video.removeEventListener('pause', randomController.stop);
      randomController.reset();
    };
  }, [
    baseFontSize,
    fontSize,
    getTextSize,
    hiddenTimeout,
    hideable,
    mode,
    setCoord,
    sizeRef,
    text,
    updateTimeout,
    videoRef,
    visibleTimeout,
  ]);

  const { rc } = useTheme<Theme>();
  const { textWidth, textHeight } = getTextSize();
  const coord = getCoord();

  return (
    <TransitionFlex
      hidden={hideable.hidden}
      componentRef={setRootRef}
      fill
      className={css.root}
      {...rest}
      style={{
        ...rest.style,
        fontSize: fontSize ?? baseFontSize,
        left: x ?? 0,
        top: y ?? 0,
        width: widthProp ?? '100%',
        height: heightProp ?? '100%',
      }}
    >
      <span ref={textRef} className={mode === 'random' ? css.textRandom : css.textStripes}>
        {text}
      </span>

      {mode === 'stripes' && textWidth > 0 && textHeight > 0 && (
        <WatermarkField
          {...rc?.VideoWatermark?.stripes?.field}
          text={text}
          textWidth={textWidth}
          textHeight={textHeight}
          className={css.stripes}
        />
      )}

      {mode === 'random' &&
        textWidth > 0 &&
        textHeight > 0 &&
        coord &&
        !!actualWidth &&
        !!actualHeight && (
          <TransitionGroup key={`${actualWidth}${actualHeight}`} component={null}>
            <Fade
              key={visibleTimeout && hiddenTimeout ? undefined : `${coord.x}-${coord.y}`}
              timeout={rc?.VideoWatermark?.random?.field?.transitionDuration}
            >
              <WatermarkField
                id={visibleTimeout && hiddenTimeout ? undefined : `${coord.x}-${coord.y}`}
                text={text}
                textWidth={textWidth}
                textHeight={textHeight}
                width={textWidth}
                height={textHeight}
                patternTransform={null as unknown as undefined}
                className={css.random}
                style={{ left: coord.x, top: coord.y }}
              />
            </Fade>
          </TransitionGroup>
        )}
    </TransitionFlex>
  );
});
