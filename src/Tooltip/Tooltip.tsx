import React, { useLayoutEffect, useRef } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import useTheme from '@material-ui/styles/useTheme';
import { Flex, FlexSimpleProps, SpaceProps } from 'reflexy';
import useUpdatedRefState from '@js-toolkit/react-hooks/useUpdatedRefState';
import TransitionFlex, { TransitionFlexProps } from '../TransitionFlex';
import TruncatedText from '../TruncatedText';
import type { Theme } from '../theme';
import { calcXInside, calcX, calcY, calcArrowCss } from './utils';

export const useStyles = makeStyles(({ rc }: Theme) => ({
  root: {
    position: 'absolute',
    userSelect: 'none',
    pointerEvents: 'none',
    transformOrigin: '0 0',
    left: 0,
    top: 0,
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

  titleContainer: {
    position: 'relative',
    maxWidth: 'inherit',

    '&::before': {
      content: '" "',
      fontSize: rc?.Tooltip?.title?.fontSize || rc?.Tooltip?.style?.fontSize,
      whiteSpace: 'pre',
    },
  },

  title: {
    composes: '$style',
    position: 'absolute',
    transformOrigin: '0 0',
    top: 0,
    left: 0,
    height: '100%',
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

  readonly title?: React.ReactNode;
  readonly text?: React.ReactNode;
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
  readonly fastUpdate?: boolean;
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
  const titleRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  // Set hidden on new tooltip in order to wait until render content and correct positioning.
  const [isHidden, setHidden] = useUpdatedRefState<boolean>(
    (prev) => {
      if (prev == null) return true;
      if (tooltip?.fastUpdate) return prev;
      return true;
    },
    [tooltip]
  );

  useLayoutEffect(() => {
    const { current: root } = rootRef;
    const { current: container } = containerRef;
    // if (!(tooltip && (tooltip.title || tooltip.text))) return;
    if (!root || !container) return;

    if (!(tooltip && (tooltip.title || tooltip.text))) {
      if (!isHidden()) setHidden(true);
      return;
    }

    const { x, y, alignX, alignY, minX, maxX, minY, maxY } = tooltip;

    // root
    const rootLeft = x == null ? 0 : calcX(x, alignX, container.offsetWidth, minX, maxX);
    const rootTop = y == null ? 0 : calcY(y, alignY, container.offsetHeight, minY, maxY);
    root.style.transform = `translate(${rootLeft}px, ${rootTop}px)`;

    // title
    const { current: title } = titleRef;
    if (title) {
      const titleLeft = calcXInside(title.offsetWidth, container.offsetWidth, rootLeft, minX, maxX);
      title.style.transform = `translateX(${titleLeft}px)`;
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

  // const hidden = !(tooltip && (tooltip.title || tooltip.text));
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
      {tooltip && (
        <Flex
          componentRef={containerRef}
          center
          column
          {...rest}
          {...tooltip.space}
          style={tooltip.maxWidth != null ? { maxWidth: tooltip.maxWidth } : undefined}
        >
          {tooltip.title && (
            <Flex
              p="xs"
              {...tooltip.innerSpace}
              alignItems="flex-start"
              hfill
              className={css.titleContainer}
            >
              <TruncatedText
                p="xs"
                {...tooltip.innerSpace}
                componentRef={titleRef}
                className={css.title}
              >
                {tooltip.title}
              </TruncatedText>
            </Flex>
          )}
          {tooltip.text && (
            <TruncatedText
              mt={tooltip.title ? 'xs' : undefined}
              p="xs"
              {...tooltip.innerSpace}
              className={css.text}
            >
              {tooltip.text}
            </TruncatedText>
          )}

          {tooltip.arrow && (!tooltip.title || !tooltip.text) && (
            <div ref={arrowRef} className={css.arrow} />
          )}
        </Flex>
      )}
    </TransitionFlex>
  );
}
