import React from 'react';
import type { Size } from '@js-toolkit/utils/types/utils';
import useRefState from '@js-toolkit/react-hooks/useRefState';
import useUpdateEffect from '@js-toolkit/react-hooks/useUpdateEffect';
import SvgMultilineText from './SvgMultilineText';

export interface WatermarkFieldProps
  extends React.SVGAttributes<SVGSVGElement>,
    React.RefAttributes<SVGSVGElement> {
  readonly updateKey: React.Key | undefined;
  readonly text: string;
  readonly mode: 'lines' | 'single';
  /** Space between lines based on the line height. */
  readonly lineSpaceScale?: number | undefined;
  /** Scaled text block height. Used when mode='lines'. */
  readonly textHeightScale?: number | undefined;
  /** Rows between text blocks in repeat pattern. Used when mode='lines'. */
  readonly textSpacing?: number | undefined;
  /** When size of the text block is changed. */
  readonly onSizeChanged: (size: Size) => void;
}

export default function WatermarkField({
  ref,
  updateKey,
  id,
  text,
  mode,
  lineSpaceScale = 0,
  textHeightScale = 1.5,
  textSpacing = 0,
  patternUnits = 'userSpaceOnUse',
  patternContentUnits,
  patternTransform,
  onSizeChanged,
  width: rootWidth = '100%',
  height: rootHeight = '100%',
  ...rest
}: WatermarkFieldProps): React.JSX.Element {
  const textRef = React.useRef<SVGTextElement>(null);

  const [lines, longestLine] = React.useMemo(() => {
    const ar = text.split('\n');
    const max = ar.reduce((acc, s) => {
      if (s.length > acc.length) return s;
      return acc;
    }, '');
    return [ar, max];
  }, [text]);

  const [getSize, setSize] = useRefState<{
    textWidth: number;
    lineHeight: number;
    realLineHeight: number;
  }>(() => ({ textWidth: 0, lineHeight: 0, realLineHeight: 0 }));

  React.useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const bb = el.getBBox();
    // console.log(text, updateKey, el.getComputedTextLength(), bb, Math.abs(bb.y + bb.height));
    setSize({ textWidth: bb.width, lineHeight: bb.height, realLineHeight: Math.abs(bb.y) });
  }, [setSize, text, updateKey]);

  const { textWidth, lineHeight, realLineHeight } = getSize();
  const lineDY = lineHeight + lineHeight * lineSpaceScale;
  const textHeight = lineDY * (lines.length - 1) + lineHeight; // (lineHeight + lineDY / 2)
  const textSpacingValue = lineDY * textSpacing;

  // console.log(
  //   getSize(),
  //   `lineSpaceScale: ${lineSpaceScale}`,
  //   `textHeightScale: ${textHeightScale}`,
  //   `textSpacing: ${textSpacing}`,
  //   `lineDY: ${lineDY}`,
  //   `textHeight: ${textHeight}`,
  //   `textSpacingValue: ${textSpacingValue}`
  // );

  useUpdateEffect(() => {
    onSizeChanged({ width: textWidth, height: textHeight });
  }, [onSizeChanged, textHeight, textWidth]);

  const patternCommonProps = {
    id: `textstripe${id ?? ''}`,
    patternUnits,
    patternContentUnits,
    patternTransform,
  } satisfies React.SVGProps<SVGPatternElement>;

  return (
    <svg id={id} ref={ref} fill="currentColor" width={rootWidth} height={rootHeight} {...rest}>
      <text
        ref={textRef}
        // x & y must by 0 to correctly calc realLineHeight.
        x="0"
        y="0"
        xmlSpace="preserve"
        lengthAdjust="spacingAndGlyphs"
        visibility="hidden"
      >
        {longestLine}
      </text>

      <defs>
        {mode === 'lines' ? (
          <pattern
            {...patternCommonProps}
            width={textWidth * 2}
            height={textHeight + textHeight * textHeightScale + textSpacingValue * 2}
          >
            <SvgMultilineText
              x={0}
              // + half of text space on the top
              y={realLineHeight + textSpacingValue / 2}
              lineDY={lineDY}
            >
              {lines}
            </SvgMultilineText>
            <SvgMultilineText
              x={textWidth}
              // Prev text block indent + height + textSpacingValue
              y={realLineHeight + textSpacingValue / 2 + textHeight + textSpacingValue}
              lineDY={lineDY}
            >
              {lines}
            </SvgMultilineText>
          </pattern>
        ) : (
          <pattern {...patternCommonProps} width={textWidth} height={textHeight}>
            <SvgMultilineText x={0} y={realLineHeight} lineDY={lineDY}>
              {lines}
            </SvgMultilineText>
          </pattern>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternCommonProps.id})`} />
    </svg>
  );
}
