import React from 'react';

export interface SvgMultilineTextProps extends React.SVGProps<SVGTextElement> {
  readonly children: string | readonly string[];
  readonly lineDY: number;
}

export default function SvgMultilineText({
  children: text,
  lineDY,
  x,
  ...rest
}: SvgMultilineTextProps): JSX.Element | null {
  const lines = React.useMemo(() => (typeof text === 'string' ? text.split('\n') : text), [text]);

  return (
    <text xmlSpace="preserve" lengthAdjust="spacingAndGlyphs" x={x} {...rest}>
      {lines.map((line, i) => (
        <tspan key={`${line}${i}`} x={x} dy={i > 0 ? lineDY : 0}>
          {line}
        </tspan>
      ))}
    </text>
  );
}
