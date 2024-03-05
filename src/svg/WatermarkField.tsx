import React from 'react';
import type { Size } from '@js-toolkit/utils/types/utils';
import useRefState from '@js-toolkit/react-hooks/useRefState';
import SvgMultilineText from './SvgMultilineText';

export interface WatermarkFieldProps extends React.SVGAttributes<SVGSVGElement> {
  readonly updateKey: React.Key | undefined;
  readonly text: string;
  readonly mode: 'lines' | 'single';
  /** Scaled line height. */
  readonly lineHeightScale?: number | undefined;
  /** Scaled text height. */
  readonly textHeightScale?: number | undefined;
  /** Rows between text. */
  readonly textSpacing?: number | undefined;
  readonly onSizeChanged: (size: Size) => void;
}

export default React.forwardRef(function WatermarkField(
  {
    updateKey,
    id,
    text,
    mode,
    lineHeightScale = 1,
    textHeightScale = 1.5,
    textSpacing = 0,
    patternUnits = 'userSpaceOnUse',
    patternContentUnits,
    patternTransform,
    onSizeChanged,
    ...rest
  }: WatermarkFieldProps,
  ref: React.Ref<SVGSVGElement>
): JSX.Element {
  const patternId = `textstripe${id ?? ''}`;

  const [lines, longLine] = React.useMemo(() => {
    const ar = text.split('\n');
    const max = ar.reduce((acc, s) => {
      if (s.length > acc.length) return s;
      return acc;
    }, '');
    return [ar, max];
  }, [text]);

  const [getSize, setSize] = useRefState<Size>(() => ({ width: 0, height: 0 }));
  const textRef = React.useRef<SVGTextElement>(null);

  React.useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    // console.log(el.getBoundingClientRect(), el.getBBox());
    const bb = el.getBBox();
    const size: Size = { width: bb.width, height: bb.height };
    setSize(size);
  }, [setSize, text, updateKey]);

  const { width: textWidth, height: lineHeight } = getSize();
  const lineDY = lineHeight * lineHeightScale;
  const textHeight = lineDY * (lines.length - 1) + lineHeight; // (lineHeight + lineDY / 2)
  const textSpacingValue = lineDY * textSpacing;

  React.useEffect(() => {
    onSizeChanged({ width: textWidth, height: textHeight });
  }, [onSizeChanged, textHeight, textWidth]);

  return (
    <svg id={id} ref={ref} width="100%" height="100%" fill="currentColor" {...rest}>
      <text ref={textRef} visibility="hidden" x="100%" y="-100%">
        {longLine}
      </text>

      <defs>
        <pattern
          id={patternId}
          width={textWidth * (mode === 'lines' ? 2 : 1.5)}
          height={
            mode === 'lines'
              ? textHeight + textHeight * textHeightScale + textSpacingValue * 2
              : textHeight
          }
          patternUnits={patternUnits}
          patternContentUnits={patternContentUnits}
          patternTransform={patternTransform}
        >
          <SvgMultilineText
            x={textWidth * 0.5} // because of textAnchor="middle"
            y={mode === 'lines' ? lineDY / 2 + textSpacingValue / 2 : lineDY / 2}
            lineDY={lineDY}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {lines}
          </SvgMultilineText>
          {mode === 'lines' && (
            <SvgMultilineText
              x={textWidth * 1.5}
              y={textHeight * textHeightScale + lineDY / 2 + textSpacingValue * 1.5}
              lineDY={lineDY}
              dominantBaseline="middle"
              textAnchor="middle"
            >
              {lines}
            </SvgMultilineText>
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
});
