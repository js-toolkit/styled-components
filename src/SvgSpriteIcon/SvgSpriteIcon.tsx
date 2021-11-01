import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import useTheme from '@mui/styles/useTheme';
import clsx from 'clsx';
import type { Theme } from '../theme';
import useSvgSpriteIconHref from './useSvgSpriteIconHref';

/** Uses in '*.svg' imports which processed by svg-sprite-loader. */
export interface SvgSymbolInfo {
  id: string;
  viewBox: string;
  content: string;
}

type MakeStylesProps = ExcludeTypes<
  Required<Pick<SvgSpriteIconProps<string>, 'scaleOnHover'>>,
  false
>;

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    verticalAlign: 'middle',
  },

  scalable: {
    transition: 'transform 0.1s',
    cursor: 'pointer',

    '&:hover': {
      transform: ({ scaleOnHover }: MakeStylesProps) => {
        return typeof scaleOnHover === 'number' ? `scale(${scaleOnHover})` : `scale(1.2)`;
      },
    },
  },
});

export interface SvgSpriteIconProps<N extends string> extends React.SVGAttributes<SVGSVGElement> {
  name: N;
  size?: number | string;
  scaleOnHover?: boolean | number;
  useProps?: Omit<React.SVGAttributes<SVGUseElement>, 'xlinkHref'>;
  htmlRef?: React.Ref<SVGSVGElement>;
}

/** Uses with svg-sprite-loader */
function SvgSpriteIcon<N extends string>({
  name,
  size,
  width,
  height,
  scaleOnHover,
  useProps,
  htmlRef,
  className,
  children,
  ...rest
}: SvgSpriteIconProps<N>): JSX.Element | null {
  const css = useStyles({ scaleOnHover: scaleOnHover || 1 });
  const { rc } = useTheme<Theme>();

  const href = useSvgSpriteIconHref(name);
  if (!href) return null;

  const w = width ?? size ?? rc?.SvgSpriteIcon?.defaultSize ?? 18;
  const h = height ?? size ?? w;

  return (
    <svg
      ref={htmlRef}
      width={w}
      height={h}
      className={clsx(css.root, scaleOnHover && css.scalable, className)}
      {...rest}
    >
      <use xlinkHref={href} fill="currentColor" {...useProps} />
      {children}
    </svg>
  );
}

SvgSpriteIcon.spriteId = 'svgsprite';

export default SvgSpriteIcon;
