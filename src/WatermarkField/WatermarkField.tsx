import React from 'react';

export interface WatermarkFieldProps extends React.SVGAttributes<SVGSVGElement> {
  text: string;
  textWidth: number;
  textHeight: number;
}

export default React.forwardRef(function WatermarkField(
  {
    text,
    textWidth,
    textHeight,
    patternUnits = 'userSpaceOnUse',
    patternContentUnits,
    patternTransform = 'rotate(-45)',
    ...rest
  }: WatermarkFieldProps,
  ref: React.Ref<SVGSVGElement>
): JSX.Element {
  return (
    <svg ref={ref} width="100%" height="100%" fill="currentColor" {...rest}>
      <defs>
        <pattern
          id="textstripe"
          width={textWidth * 2}
          height={textHeight * 2}
          patternUnits={patternUnits}
          patternContentUnits={patternContentUnits}
          patternTransform={patternTransform}
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
});
