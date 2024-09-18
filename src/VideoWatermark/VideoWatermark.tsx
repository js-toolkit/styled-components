import React, { useLayoutEffect, useRef } from 'react';
import styled from '@mui/system/styled';
import useTheme from '@mui/system/useTheme';
import Fade from '@mui/material/Fade';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import type { FlexComponentProps } from 'reflexy/styled';
import type { Size } from '@js-toolkit/utils/types/utils';
import { toInt } from '@js-toolkit/utils/toInt';
import useRefState from '@js-toolkit/react-hooks/useRefState';
import useRefs from '@js-toolkit/react-hooks/useRefs';
import useHideableState from '@js-toolkit/react-hooks/useHideableState';
import useUpdatedRefValue from '@js-toolkit/react-hooks/useUpdatedRefValue';
import useMemoDestructor from '@js-toolkit/react-hooks/useMemoDestructor';
import useIncrementalState from '@js-toolkit/react-hooks/useIncrementalState';
import TransitionFlex from '../TransitionFlex';
import WatermarkField, { type WatermarkFieldProps } from '../svg/WatermarkField';
import type { Theme } from '../theme';
import { getShowController } from './getShowController';
import { getRandomShowController } from './getRandomShowController';
import { getModificationDetector } from './modificationDetector';

export type VideoWatermarkProps = FlexComponentProps &
  Partial<Point> &
  Partial<Size> &
  Pick<WatermarkFieldProps, 'lineSpaceScale' | 'textHeightScale' | 'textSpacing'> & {
    htmlRef?: React.Ref<HTMLDivElement>;
    text: string;
    baseFontSize?: number | undefined;
    scaleBySize?: number | undefined;
    visibleTimeout?: number | undefined;
    hiddenTimeout?: number | undefined;
    updateTimeout?: number | undefined;
    redraw?: boolean | undefined;
    modificationDetectionInterval?: number;
    onModificationDetected?: VoidFunction;
  } & (
    | { mode: 'random'; videoRef: React.RefObject<HTMLVideoElement> }
    | { mode?: 'stripes' | undefined; videoRef?: React.RefObject<HTMLVideoElement> | undefined }
  );

function scaleFontSize(baseFontSize: number, scale: number, width: number, height: number): number {
  const minSize = Math.min(width, height);
  return Math.floor(baseFontSize * ((minSize / 100) * scale));
}

const Root = styled(TransitionFlex)({
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
});

const StyledWatermarkField = styled(WatermarkField)(({ theme: { rc }, mode }) => ({
  ...rc?.VideoWatermark?.default,
  ...(mode === 'lines' && rc?.VideoWatermark?.stripes),
  ...(mode === 'single' && { ...rc?.VideoWatermark?.random, position: 'absolute' }),
}));

export default React.memo(function VideoWatermark({
  htmlRef,
  videoRef,
  text,
  mode = 'stripes',
  updateTimeout,
  baseFontSize,
  scaleBySize,
  lineSpaceScale,
  textHeightScale,
  textSpacing,
  visibleTimeout,
  hiddenTimeout,
  x,
  y,
  width: widthProp,
  height: heightProp,
  redraw = true,
  modificationDetectionInterval = 5_000,
  onModificationDetected,
  ...rest
}: VideoWatermarkProps): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const keyState = useIncrementalState();
  const rootState = useHideableState({ enabled: true, visible: true });
  const [getTextSize, setTextSize] = useRefState<Size>({ width: 0, height: 0 });
  const [getCoord, setCoord] = useRefState<Point>({ x: 0, y: 0 });

  const rootSizeRef = useUpdatedRefValue<OptionalToUndefined<Partial<Size>>>(
    () => ({ width: widthProp && toInt(widthProp), height: heightProp && toInt(heightProp) }),
    [widthProp, heightProp]
  );

  const actualRootSizeRef = useUpdatedRefValue<OptionalToUndefined<Partial<Size>>>(
    () => ({
      get width() {
        return rootSizeRef.current.width ?? rootRef.current?.offsetWidth;
      },
      get height() {
        return rootSizeRef.current.height ?? rootRef.current?.offsetHeight;
      },
    }),
    [rootSizeRef]
  );

  const fontSize = (() => {
    if (baseFontSize && scaleBySize) {
      const actual = actualRootSizeRef.current;
      if (!actual.width || !actual.height) return undefined;
      return scaleFontSize(baseFontSize, scaleBySize, actual.width, actual.height);
    }
    return baseFontSize;
  })();

  const textSizeInitialized = getTextSize().height > 0;

  // const watermarkImg = useMemo(() => {
  //   const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${textWidth}" height="${textHeight}">
  // 		<text y="${textHeight}" fill="red">${text}</text>
  // 	</svg>`;
  //   return `url("${base64ToDataUrl(toBase64(svg), 'image/svg+xml')}")`;
  // }, [text, textHeight, textWidth]);

  const modificationDetector = useMemoDestructor(
    () => [
      modificationDetectionInterval > 0
        ? getModificationDetector({
            mode,
            checkInterval: modificationDetectionInterval,
            onModified: (type) => {
              if (type === 'children') {
                keyState.inc();
              } else if (onModificationDetected) {
                onModificationDetected();
              }
            },
          })
        : undefined,
      (d) => d?.destroy(),
    ],
    [keyState, mode, modificationDetectionInterval, onModificationDetected]
  );

  const setRootRef = useRefs(rootRef, htmlRef, modificationDetector?.setNode);

  // Stripes
  useLayoutEffect(() => {
    if (!videoRef?.current || mode === 'random' || !visibleTimeout || !hiddenTimeout) {
      return undefined;
    }
    const { current: video } = videoRef;

    const showController = getShowController({
      visibleTimeout,
      hiddenTimeout,
      isVisible: () => rootState.visible,
      onShow: () => {
        if (redraw) keyState.inc();
        rootState.show();
      },
      onHide: rootState.hide,
    });

    video.addEventListener('play', showController.start);
    video.addEventListener('pause', showController.stop);

    if (!video.paused) showController.start();

    return () => {
      video.removeEventListener('play', showController.start);
      video.removeEventListener('pause', showController.stop);
      showController.reset();
    };
  }, [hiddenTimeout, keyState, mode, redraw, rootState, videoRef, visibleTimeout]);

  // Random
  useLayoutEffect(() => {
    if (
      !videoRef?.current ||
      mode !== 'random' ||
      (baseFontSize && !fontSize) ||
      !text ||
      !textSizeInitialized
    ) {
      return undefined;
    }
    const { current: video } = videoRef;

    const randomController = getRandomShowController({
      updateTimeout,
      getBounds: () => {
        const { width = 0, height = 0 } = actualRootSizeRef.current;
        const { width: textWidth, height: textHeight } = getTextSize();
        const maxX = width - textWidth;
        const maxY = height - textHeight;
        return { x: maxX, y: maxY };
      },
      onUpdate: (coord) => {
        if (redraw) keyState.inc();
        setCoord(coord);
      },
      showOptions:
        visibleTimeout && hiddenTimeout
          ? {
              visibleTimeout,
              hiddenTimeout,
              isVisible: () => rootState.visible,
              onShow: rootState.show,
              onHide: rootState.hide,
            }
          : undefined,
    });

    video.addEventListener('play', randomController.start);
    video.addEventListener('pause', randomController.stop);

    if (!video.paused) randomController.start();
    else if (rootState.visible) randomController.update();

    return () => {
      video.removeEventListener('play', randomController.start);
      video.removeEventListener('pause', randomController.stop);
      randomController.reset();
    };
  }, [
    actualRootSizeRef,
    baseFontSize,
    fontSize,
    getTextSize,
    hiddenTimeout,
    keyState,
    mode,
    redraw,
    rootState,
    setCoord,
    text,
    textSizeInitialized,
    videoRef,
    visibleTimeout,
    updateTimeout,
  ]);

  if (rootState.hidden && modificationDetector) {
    modificationDetector.setHidden();
  }

  const theme = useTheme<Theme | undefined>()?.rc?.VideoWatermark;
  const coord = getCoord();
  const rootFontSize = fontSize ?? baseFontSize;
  const rootSize = rootSizeRef.current;
  const actualRootSize = actualRootSizeRef.current;

  return (
    <Root
      key={keyState.value}
      fill
      {...rest}
      componentRef={setRootRef}
      hidden={rootState.hidden}
      style={{
        ...rest.style,
        fontSize: rootFontSize,
        left: x ?? 0,
        top: y ?? 0,
        width: rootSize.width ?? '100%',
        height: rootSize.height ?? '100%',
      }}
      onShown={modificationDetector?.setVisible}
    >
      {mode === 'stripes' && (
        <StyledWatermarkField
          patternTransform={theme?.stripes?.field?.patternTransform ?? 'rotate(-45)'}
          lineSpaceScale={lineSpaceScale ?? theme?.stripes?.field?.lineSpaceScale}
          textHeightScale={textHeightScale ?? theme?.stripes?.field?.textHeightScale}
          textSpacing={textSpacing ?? theme?.stripes?.field?.textSpacing}
          updateKey={rootFontSize}
          text={text}
          mode="lines"
          onSizeChanged={setTextSize}
        />
      )}

      {mode === 'random' && !!actualRootSize.width && !!actualRootSize.height && (
        <TransitionGroup key={`${actualRootSize.width}${actualRootSize.height}`} component={null}>
          <Fade
            key={visibleTimeout && hiddenTimeout ? undefined : `${coord.x}-${coord.y}`}
            timeout={theme?.random?.field?.transitionDuration}
          >
            <StyledWatermarkField
              id={visibleTimeout && hiddenTimeout ? undefined : `${coord.x}-${coord.y}`}
              lineSpaceScale={lineSpaceScale ?? theme?.random?.field?.lineSpaceScale}
              updateKey={rootFontSize}
              text={text}
              mode="single"
              {...getTextSize()}
              onSizeChanged={setTextSize}
              style={{ left: coord.x, top: coord.y, background: 'yellow' }}
            />
          </Fade>
        </TransitionGroup>
      )}
    </Root>
  );
});
