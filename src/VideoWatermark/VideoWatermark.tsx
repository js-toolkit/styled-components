import React, { useEffect, useRef, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import useTheme from '@mui/styles/useTheme';
import Fade from '@mui/material/Fade';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { Flex, FlexComponentProps } from 'reflexy';
import getRandom from '@js-toolkit/utils/getRandom';
import toInt from '@js-toolkit/utils/toInt';
import noop from '@js-toolkit/utils/noop';
import useRefState from '@js-toolkit/react-hooks/useRefState';
import useUpdate from '@js-toolkit/react-hooks/useUpdate';
import useRefs from '@js-toolkit/react-hooks/useRefs';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import WatermarkField from '../WatermarkField';
import type { Size } from '../ResizeListener';
import type { Theme } from '../theme';

export type VideoWatermarkProps = FlexComponentProps &
  Partial<Point> &
  Partial<Size> & {
    text: string;
    baseFontSize?: number;
    scaleBySize?: number;
  } & (
    | { mode: 'random'; videoRef: React.RefObject<HTMLVideoElement> }
    | { mode?: 'stripes'; videoRef?: React.RefObject<HTMLVideoElement> }
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

    textDefault: {
      ...rc?.VideoWatermark?.default,
      ...textStyles,
    },

    textRandom: {
      ...rc?.VideoWatermark?.default,
      ...rc?.VideoWatermark?.random,
      transitionDuration: undefined,
      ...textStyles,
    },

    field: {
      ...rc?.VideoWatermark?.default,
    },

    random: {
      // transition: 'left 0.2s linear, top 0.2s linear',
      ...rc?.VideoWatermark?.default,
      ...rc?.VideoWatermark?.random,
      transitionDuration: undefined,
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
  baseFontSize,
  scaleBySize,
  x,
  y,
  width: widthProp,
  height: heightProp,
  className,
  ...rest
}: VideoWatermarkProps): JSX.Element {
  const css = useStyles({ classes: { root: className } });
  const rootRef = useRef<HTMLDivElement>(null);
  const forceUpdate = useUpdate();
  const setRootRef = useRefs(rootRef, forceUpdate);
  const textRef = useRef<HTMLDivElement>(null);
  const [getTextSize, setTextSize] = useRefState({ textWidth: 0, textHeight: 0 });
  const [coord, setCoord] = useState<Point | undefined>(undefined);

  const width = widthProp && toInt(widthProp);
  const height = heightProp && toInt(heightProp);

  const actualWidth = width ?? rootRef.current?.offsetWidth;
  const actualHeight = height ?? rootRef.current?.offsetHeight;

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

  const updateRandom = useRefCallback(() => {
    if (!actualWidth || !actualHeight) return;
    const { textWidth, textHeight } = getTextSize();
    const maxX = actualWidth - textWidth;
    const maxY = actualHeight - textHeight;
    setCoord({
      x: getRandom(0, maxX),
      y: getRandom(0, maxY),
    });
  });

  useEffect(() => {
    const { current: textEl } = textRef;
    if (!textEl) return;
    if (baseFontSize && !fontSize) return;
    const { width: textWidth, height: textHeight } = textEl.getBoundingClientRect();
    setTextSize({ textWidth, textHeight });
    // console.log(textWidth, textHeight, textEl.clientWidth, textEl.clientHeight);
  }, [setTextSize, baseFontSize, fontSize, text]);

  useEffect(() => {
    if (!videoRef || mode !== 'random') return noop;
    if (baseFontSize && !fontSize) return noop;
    const { current: video } = videoRef;
    if (!video) return noop;

    let timer = 0;

    const loop = (): void => {
      timer = window.setTimeout(() => {
        updateRandom();
        loop();
      }, toInt(getRandom(5, 20) * 1000));
    };

    const stop = (): void => {
      window.clearTimeout(timer);
    };

    video.addEventListener('play', loop);
    video.addEventListener('pause', stop);

    updateRandom();

    if (!video.paused) loop();

    return () => {
      video.removeEventListener('play', loop);
      video.removeEventListener('pause', stop);
      stop();
    };
  }, [mode, updateRandom, videoRef, baseFontSize, fontSize, text, width, height]);

  const { rc } = useTheme<Theme>();
  const { textWidth, textHeight } = getTextSize();

  return (
    <Flex
      componentRef={setRootRef}
      fill
      className={css.root}
      {...rest}
      style={{
        ...rest.style,
        fontSize: fontSize ?? baseFontSize,
        left: x ?? 0,
        top: y ?? 0,
        width: width ?? '100%',
        height: height ?? '100%',
      }}
    >
      <span ref={textRef} className={mode === 'random' ? css.textRandom : css.textDefault}>
        {text}
      </span>

      {mode === 'stripes' && textWidth > 0 && textHeight > 0 && (
        <WatermarkField
          text={text}
          textWidth={textWidth}
          textHeight={textHeight}
          className={css.field}
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
              key={`${coord.x}${coord.y}`}
              timeout={rc?.VideoWatermark?.random?.transitionDuration}
            >
              <WatermarkField
                text={text}
                textWidth={textWidth}
                textHeight={textHeight}
                width={textWidth}
                height={textHeight}
                patternTransform=""
                className={css.random}
                style={{ left: coord.x, top: coord.y }}
              />
            </Fade>
          </TransitionGroup>
        )}
    </Flex>
  );
});
