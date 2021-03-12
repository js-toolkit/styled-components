import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import useTheme from '@material-ui/styles/useTheme';
import Theme from '../Theme';

type MakeStylesProps = Pick<SvgSpriteIconProps<string>, 'scaleOnHover'>;

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    verticalAlign: 'middle',
    transition: ({ scaleOnHover }: MakeStylesProps) => (scaleOnHover ? 'scale 0.1s' : ''),
    cursor: ({ scaleOnHover }: MakeStylesProps) => (scaleOnHover ? 'pointer' : ''),

    '&:hover': {
      scale: ({ scaleOnHover }: MakeStylesProps) =>
        typeof scaleOnHover === 'number' ? scaleOnHover : (scaleOnHover && 1.2) || '',
    },
  },
});

export interface SvgSpriteIconProps<N extends string> extends React.SVGAttributes<SVGSVGElement> {
  name: N;
  size?: number | string;
  scaleOnHover?: boolean | number;
  useProps?: Omit<React.SVGAttributes<SVGUseElement>, 'xlinkHref'>;
}

export default function SvgSpriteIcon<N extends string>({
  name,
  size,
  width,
  height,
  scaleOnHover,
  useProps,
  className,
  children,
  ...rest
}: SvgSpriteIconProps<N>): JSX.Element | null {
  const css = useStyles({ classes: { root: className }, scaleOnHover });
  const { rc } = useTheme<Theme>();

  if (!name || !rc?.SvgSpriteIcon?.spriteId) return null;

  const w = width ?? size ?? rc.SvgSpriteIcon.defaultSize ?? 18;
  const h = height ?? size ?? width;

  return (
    <svg width={w} height={h} className={css.root} {...rest}>
      <use xlinkHref={`#${rc.SvgSpriteIcon.spriteId}_${name}`} fill="currentColor" {...useProps} />
      {children}
    </svg>
  );
}
