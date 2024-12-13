import React, { useLayoutEffect, useRef } from 'react';
import { styled, css } from '@mui/system';
import useTheme from '@mui/system/useTheme';
import { Flex, type FlexComponentProps, type SpaceProps } from 'reflexy/styled';
import useUpdatedRefState from '@js-toolkit/react-hooks/useUpdatedRefState';
import TransitionFlex, { type TransitionFlexProps } from '../TransitionFlex';
import TruncatedText from '../TruncatedText';
import { calcX, calcY, calcArrowCss, calcXInside } from './utils';

type TooltipAlignX = 'left' | 'middle' | 'right';
type TooltipAlignY = 'top' | 'middle' | 'bottom';

export interface TooltipData {
  readonly target: HTMLElement;

  readonly preview?: React.ReactElement | React.CSSProperties | undefined;
  readonly title?: React.ReactNode | undefined;
  readonly text: React.ReactNode;
  readonly arrow?: boolean | undefined;

  readonly x: number;
  readonly y: number;
  readonly alignX: TooltipAlignX;
  readonly alignY: TooltipAlignY;
  readonly minX?: number | undefined;
  readonly maxX?: number | undefined;
  readonly minY?: number | undefined;
  readonly maxY?: number | undefined;

  readonly maxWidth?: number | undefined;
  readonly space?: SpaceProps | undefined;
  readonly innerSpace?: SpaceProps | undefined;

  readonly sequence?: boolean | undefined;
}

export interface TooltipProps
  extends FlexComponentProps<'div'>,
    Pick<TransitionFlexProps, 'onShown' | 'onHidden'> {
  readonly tooltip: TooltipData | undefined;
}

const Root = styled(TransitionFlex<'div'>)({
  position: 'absolute',
  userSelect: 'none',
  pointerEvents: 'none',
  transformOrigin: '0 0',
  left: 0,
  top: 0,
});

const Container = styled(Flex<'div'>)({
  position: 'relative',
});

const RowContainer = styled(Flex<'div'>)({
  maxWidth: 'inherit',
});

const textStyle = css({
  color: '#ffffff',
  backgroundColor: 'rgba(50, 50, 50, 0.8)',
  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.16)',
  borderRadius: '4px',
  maxWidth: 'inherit',
});

const Title = styled(TruncatedText)(textStyle, ({ theme: { rc } }) => ({
  ...rc?.Tooltip?.style,
  ...rc?.Tooltip?.title,
}));

const Text = styled(TruncatedText)(textStyle, ({ theme: { rc } }) => ({
  ...rc?.Tooltip?.style,
  ...rc?.Tooltip?.text,
}));

const Arrow = styled('div')({
  position: 'absolute',
});

export default function Tooltip({
  tooltip,
  className,
  onShown,
  onHidden,
  ...rest
}: TooltipProps): React.JSX.Element {
  const { rc } = useTheme();
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
          rc?.Tooltip?.arrowColor || 'rgba(50, 50, 50, 0.8)',
          `${container.clientHeight / 4}px`
        )
      );
    }

    if (isHidden()) setHidden(false);
  }, [isHidden, rc?.Tooltip?.arrowColor, rc?.Tooltip?.style?.backgroundColor, setHidden, tooltip]);

  const hidden = isHidden();

  return (
    <Root
      ref={rootRef}
      hidden={hidden}
      keepChildren
      className={className}
      onShown={onShown}
      onHidden={onHidden}
    >
      {tooltip && !!(tooltip.title || tooltip.text) && (
        <Container
          ref={containerRef}
          column
          alignItems="flex-start"
          {...rest}
          {...rc?.Tooltip?.space}
          {...tooltip.space}
          style={tooltip.maxWidth != null ? { maxWidth: tooltip.maxWidth } : undefined}
        >
          {tooltip.preview && (
            <RowContainer ref={previewRef}>
              {React.isValidElement(tooltip.preview) ? (
                tooltip.preview
              ) : (
                <div style={tooltip.preview} />
              )}
            </RowContainer>
          )}

          {tooltip.title && (
            <RowContainer ref={titleRef}>
              {React.isValidElement(tooltip.title) ? (
                tooltip.title
              ) : (
                <Title mb="xs" p="xs" {...rc?.Tooltip?.innerSpace} {...tooltip.innerSpace}>
                  {tooltip.title}
                </Title>
              )}
            </RowContainer>
          )}

          <RowContainer ref={textRef}>
            {tooltip.text && React.isValidElement(tooltip.text) ? (
              tooltip.text
            ) : (
              <Text p="xs" {...rc?.Tooltip?.innerSpace} {...tooltip.innerSpace}>
                {tooltip.text}
              </Text>
            )}
          </RowContainer>

          {tooltip.arrow && (!tooltip.title || !tooltip.text) && <Arrow ref={arrowRef} />}
        </Container>
      )}
    </Root>
  );
}
