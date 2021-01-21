import React from 'react';

export interface WatermarkFieldProps extends React.SVGAttributes<SVGSVGElement> {
  text: string;
  textWidth: number;
  textHeight: number;
}

export default function WatermarkField({
  text,
  textWidth,
  textHeight,
  patternUnits,
  patternContentUnits,
  patternTransform,
  ...rest
}: WatermarkFieldProps): JSX.Element {
  return (
    <svg width="100%" height="100%" fill="currentColor" {...rest}>
      <defs>
        <pattern
          id="textstripe"
          width={textWidth * 2}
          height={textHeight * 2}
          patternUnits={patternUnits ?? 'userSpaceOnUse'}
          patternContentUnits={patternContentUnits}
          patternTransform={patternTransform ?? 'rotate(-45)'}
        >
          <text
            x={0}
            y={0}
            dy={textHeight}
            lengthAdjust="spacingAndGlyphs"
            dominantBaseline="text-after-edge"
          >
            {text}
          </text>
          <text
            x={textWidth}
            y={textHeight}
            dy={textHeight}
            lengthAdjust="spacingAndGlyphs"
            dominantBaseline="text-after-edge"
          >
            {text}
          </text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#textstripe)" />
    </svg>
  );
}
