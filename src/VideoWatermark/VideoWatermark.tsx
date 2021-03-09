import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Flex, FlexComponentProps } from 'reflexy';
import useGetSetState from 'react-use/esm/useGetSetState';
import getRandom from '@js-toolkit/ts-utils/getRandom';
import toInt from '@js-toolkit/ts-utils/toInt';
import noop from '@js-toolkit/ts-utils/noop';
import WatermarkField from '../WatermarkField';
import type { Size } from '../ResizeListener';
import type Theme from '../Theme';

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
    },

    textDefault: {
      ...rc?.VideoWatermark?.default,
      ...textStyles,
    },

    textRandom: {
      ...rc?.VideoWatermark?.default,
      ...rc?.VideoWatermark?.random,
      ...textStyles,
    },

    field: {
      ...rc?.VideoWatermark?.default,
    },

    random: {
      ...rc?.VideoWatermark?.default,
      ...rc?.VideoWatermark?.random,
      position: 'absolute',
      transition: 'left 0.2s linear, top 0.2s linear',
    },
  };
});

export type VideoWatermarkProps = FlexComponentProps &
  Partial<WebKitPoint> &
  Partial<Size> & {
    text: string;
    baseFontSize?: number;
  } & (
    | { mode: 'random'; videoRef: React.RefObject<HTMLVideoElement> }
    | { mode?: 'stripes'; videoRef?: React.RefObject<HTMLVideoElement> }
  );

export default React.memo(function VideoWatermark({
  videoRef,
  text,
  mode = 'stripes',
  baseFontSize,
  x,
  y,
  width: widthProp,
  height: heightProp,
  className,
  ...rest
}: VideoWatermarkProps): JSX.Element {
  const css = useStyles({ classes: { root: className } });
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [getTextSize, setTextSize] = useGetSetState({ textWidth: 0, textHeight: 0 });
  const [coord, setCoord] = useState<WebKitPoint | undefined>(undefined);

  const width = useMemo(() => widthProp && toInt(widthProp), [widthProp]);
  const height = useMemo(() => heightProp && toInt(heightProp), [heightProp]);

  // const watermarkImg = useMemo(() => {
  //   const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${textWidth}" height="${textHeight}">
  // 		<text y="${textHeight}" fill="red">${text}</text>
  // 	</svg>`;
  //   return `url("${base64ToDataUrl(toBase64(svg), 'image/svg+xml')}")`;
  // }, [text, textHeight, textWidth]);

  const updateRandom = useCallback(() => {
    const { current: root } = rootRef;
    if (!root) return;
    const { textWidth, textHeight } = getTextSize();
    const [minX, maxX] = [0, root.clientWidth - textWidth];
    const [minY, maxY] = [0, root.clientHeight - textHeight];
    setCoord({
      x: getRandom(minX, maxX),
      y: getRandom(minY, maxY),
    });
  }, [getTextSize]);

  useEffect(() => {
    const { current: textEl } = textRef;
    if (!textEl) return;
    const { width: textWidth, height: textHeight } = textEl.getBoundingClientRect();
    setTextSize({ textWidth, textHeight });
    // console.log(textWidth, textHeight, textEl.clientWidth, textEl.clientHeight);
  }, [text, baseFontSize, setTextSize, updateRandom]);

  useEffect(() => {
    if (mode === 'random') {
      updateRandom();
    }
  }, [width, height, text, updateRandom, mode]);

  useEffect(() => {
    const { current: root } = rootRef;
    if (!root || !videoRef || mode !== 'random') return noop;
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

    return () => {
      video.removeEventListener('play', loop);
      video.removeEventListener('pause', stop);
      stop();
    };
  }, [mode, updateRandom, videoRef]);

  const { textWidth, textHeight } = getTextSize();

  return (
    <Flex
      componentRef={rootRef}
      fill
      className={css.root}
      {...rest}
      style={{
        ...rest.style,
        fontSize: baseFontSize,
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

      {mode === 'random' && textWidth > 0 && textHeight > 0 && coord && (
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
      )}
    </Flex>
  );
});
