import React from 'react';
import useTheme from '@mui/system/useTheme';
import styled from '@mui/system/styled';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { excludeProp } from '../utils';
import type { Theme } from '../theme';
// eslint-disable-next-line import/no-cycle
import useSvgSpriteIconHref from './useSvgSpriteIconHref';

/** Uses in '*.svg' imports which processed by svg-sprite-loader. */
export interface SvgSymbolInfo {
  id: string;
  viewBox: string;
  content: string;
}

export interface SvgSpriteIconProps<N extends string>
  extends React.SVGAttributes<SVGSVGElement>,
    React.RefAttributes<SVGSVGElement> {
  name: N;
  size?: number | string | undefined;
  scaleOnHover?: boolean | number | undefined;
  useProps?: Omit<React.SVGAttributes<SVGUseElement>, 'xlinkHref'> | undefined;
}

/** Uses with svg-sprite-loader */
function SvgSpriteIcon<N extends string>({
  name,
  size,
  width,
  height,
  useProps,
  children,
  ...rest
}: SvgSpriteIconProps<N>): React.JSX.Element | null {
  const { rc } = useTheme<Theme>();

  const href = useSvgSpriteIconHref(name);
  if (!href) return null;

  const w = width ?? size ?? rc?.SvgSpriteIcon?.defaultSize ?? 18;
  const h = height ?? size ?? w;

  return (
    <svg width={w} height={h} {...rest}>
      <use xlinkHref={href} fill="currentColor" {...useProps} />
      {children}
    </svg>
  );
}

SvgSpriteIcon.spriteId = 'svgsprite';

export default hoistNonReactStatics(
  styled(SvgSpriteIcon, {
    shouldForwardProp: excludeProp<SvgSpriteIconProps<string>>(['scaleOnHover']),
    name: SvgSpriteIcon.name,
  })(({ scaleOnHover }) => ({
    display: 'inline-block',
    verticalAlign: 'middle',

    ...(scaleOnHover && {
      transition: 'transform 0.1s',
      cursor: 'pointer',

      '&:hover': {
        transform: typeof scaleOnHover === 'number' ? `scale(${scaleOnHover})` : `scale(1.2)`,
      },
    }),
  })),
  SvgSpriteIcon
) as typeof SvgSpriteIcon;
