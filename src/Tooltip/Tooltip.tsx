import React, { useLayoutEffect, useRef } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import useTheme from '@mui/styles/useTheme';
import { Flex, FlexSimpleProps, SpaceProps } from 'reflexy';
import useUpdatedRefState from '@jstoolkit/react-hooks/useUpdatedRefState';
import TransitionFlex, { TransitionFlexProps } from '../TransitionFlex';
import TruncatedText from '../TruncatedText';
import type { Theme } from '../theme';
import { calcX, calcY, calcArrowCss, calcXInside } from './utils';

export const useStyles = makeStyles(({ rc }: Theme) => ({
  root: {
    position: 'absolute',
    userSelect: 'none',
    pointerEvents: 'none',
    transformOrigin: '0 0',
    left: 0,
    top: 0,
  },

  container: {
    position: 'relative',
  },

  rowContainer: {
    maxWidth: 'inherit',
  },

  arrow: {
    position: 'absolute',
  },

  style: {
    color: '#ffffff',
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.16)',
    borderRadius: '4px',
    ...rc?.Tooltip?.style,
  },

  title: {
    composes: '$style',
    maxWidth: 'inherit',
    ...rc?.Tooltip?.title,
  },

  text: {
    composes: '$style',
    maxWidth: 'inherit',
    ...rc?.Tooltip?.text,
  },
}));

type TooltipAlignX = 'left' | 'middle' | 'right';
type TooltipAlignY = 'top' | 'middle' | 'bottom';

export interface TooltipData {
  readonly target: HTMLElement;

  readonly preview?: React.ReactElement | React.CSSProperties;
  readonly title?: React.ReactNode;
  readonly text: React.ReactNode;
  readonly arrow?: boolean;

  readonly x: number;
  readonly y: number;
  readonly alignX: TooltipAlignX;
  readonly alignY: TooltipAlignY;
  readonly minX?: number;
  readonly maxX?: number;
  readonly minY?: number;
  readonly maxY?: number;

  readonly maxWidth?: number;
  readonly space?: SpaceProps;
  readonly innerSpace?: SpaceProps;

  readonly sequence?: boolean;
}

export interface TooltipProps
  extends FlexSimpleProps,
    Pick<TransitionFlexProps, 'onShown' | 'onHidden'> {
  readonly tooltip: TooltipData | undefined;
}

export default function Tooltip({
  tooltip,
  className,
  onShown,
  onHidden,
  ...rest
}: TooltipProps): JSX.Element {
  const css = useStyles({ classes: { root: className } });
  const { rc } = useTheme<Theme>();
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  // Set hidden on new tooltip in order to wait until render content and correct positioning.
  const [isHidden, setHidden] = useUpdatedRefState<boolean>(
    (prev) => {
      if (prev == null) return true;
      if (tooltip?.sequence) return prev;
      return true;
    },
    [tooltip]
  );

  useLayoutEffect(() => {
    if (!(tooltip && (tooltip.title || tooltip.text || tooltip.preview))) {
      if (!isHidden()) setHidden(true);
      return;
    }

    const { current: root } = rootRef;
    const { current: container } = containerRef;
    if (!root || !container) return;

    const { x, y, alignX, alignY, minX, maxX, minY, maxY } = tooltip;

    // root
    const rootLeft = calcX(x, alignX, container.offsetWidth, minX, maxX);
    const rootTop = calcY(y, alignY, container.offsetHeight, minY, maxY);
    root.style.transform = `translate(${rootLeft}px, ${rootTop}px)`;

    // preview
    const { current: preview } = previewRef;
    if (preview) {
      const previewLeft = calcXInside(x - rootLeft, preview.offsetWidth, 0, container.offsetWidth);
      preview.style.transform = `translateX(${previewLeft}px)`;
    }

    // title
    const { current: title } = titleRef;
    if (title) {
      const titleLeft = calcXInside(x - rootLeft, title.offsetWidth, 0, container.offsetWidth);
      title.style.transform = `translateX(${titleLeft}px)`;
    }

    // text
    const { current: text } = textRef;
    if (text) {
      const textLeft = calcXInside(x - rootLeft, text.offsetWidth, 0, container.offsetWidth);
      text.style.transform = `translateX(${textLeft}px)`;
    }

    // arrow
    const { current: arrow } = arrowRef;
    if (arrow) {
      Object.assign(
        arrow.style,
        calcArrowCss(
          tooltip.alignX,
          tooltip.alignY,
          rc?.Tooltip?.arrowColor || rc?.Tooltip?.style?.backgroundColor || 'rgba(50, 50, 50, 0.8)',
          `${container.clientHeight / 4}px`
        )
      );
    }

    if (isHidden()) setHidden(false);
  }, [isHidden, rc?.Tooltip?.arrowColor, rc?.Tooltip?.style?.backgroundColor, setHidden, tooltip]);

  const hidden = isHidden();

  return (
    <TransitionFlex
      hidden={hidden}
      keepChildren
      componentRef={rootRef}
      className={css.root}
      onShown={onShown}
      onHidden={onHidden}
    >
      {tooltip && !!(tooltip.title || tooltip.text) && (
        <Flex
          componentRef={containerRef}
          column
          alignItems="flex-start"
          {...rest}
          {...tooltip.space}
          className={css.container}
          style={tooltip.maxWidth != null ? { maxWidth: tooltip.maxWidth } : undefined}
        >
          {tooltip.preview && (
            <Flex componentRef={previewRef} className={css.rowContainer}>
              {React.isValidElement(tooltip.preview) ? (
                tooltip.preview
              ) : (
                <div style={tooltip.preview} />
              )}
            </Flex>
          )}

          {tooltip.title && (
            <Flex componentRef={titleRef} className={css.rowContainer}>
              {React.isValidElement(tooltip.title) ? (
                tooltip.title
              ) : (
                <TruncatedText mb="xs" p="xs" {...tooltip.innerSpace} className={css.title}>
                  {tooltip.title}
                </TruncatedText>
              )}
            </Flex>
          )}

          <Flex componentRef={textRef} className={css.rowContainer}>
            {tooltip.text && React.isValidElement(tooltip.text) ? (
              tooltip.text
            ) : (
              <TruncatedText p="xs" {...tooltip.innerSpace} className={css.text}>
                {tooltip.text}
              </TruncatedText>
            )}
          </Flex>

          {tooltip.arrow && (!tooltip.title || !tooltip.text) && (
            <div ref={arrowRef} className={css.arrow} />
          )}
        </Flex>
      )}
    </TransitionFlex>
  );
}
