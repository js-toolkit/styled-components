import React from 'react';
import type { Size } from '@js-toolkit/utils/types/utils';
import { useRefState } from '@js-toolkit/react-hooks/useRefState';

export interface SvgForeignTextProps extends React.SVGProps<SVGForeignObjectElement> {
  readonly children: string;
}

export default function SvgForeignText({
  children: text,
  ...rest
}: SvgForeignTextProps): React.JSX.Element {
  const [getSize, setSize] = useRefState<Size>(() => ({ width: 0, height: 0 }));
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    setSize({ width: content.scrollWidth, height: content.scrollHeight });
  }, [setSize]);

  const { width, height } = getSize();

  return (
    <foreignObject x={0} y={0} width={width} height={height} {...rest}>
      <div ref={contentRef}>{text}</div>
    </foreignObject>
  );
}
