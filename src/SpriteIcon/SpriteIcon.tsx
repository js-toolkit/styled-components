import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

type MakeStylesProps = Pick<SpriteIconProps<string>, 'scaleOnHover'>;

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    verticalAlign: 'middle',
    transition: ({ scaleOnHover }: MakeStylesProps) => (scaleOnHover ? 'scale 0.1s' : ''),
    cursor: ({ scaleOnHover }: MakeStylesProps) => (scaleOnHover ? 'pointer' : ''),

    '&:hover': {
      transform: ({ scaleOnHover }: MakeStylesProps) => {
        if (scaleOnHover == null || scaleOnHover === false) return '';
        return typeof scaleOnHover === 'number'
          ? `scale(${scaleOnHover})`
          : `scale(${scaleOnHover && 1.2})`;
      },
    },
  },
});

export interface SpriteIconProps<N extends string> extends React.SVGAttributes<SVGSVGElement> {
  name: N;
  size?: number | string;
  scaleOnHover?: boolean | number;
  useProps?: Omit<React.SVGAttributes<SVGUseElement>, 'xlinkHref'>;
}

/** Uses with svg-sprite-loader */
function SpriteIcon<N extends string>({
  name,
  size = 18,
  width = size,
  height = width,
  scaleOnHover,
  useProps,
  className,
  children,
  ...rest
}: SpriteIconProps<N>): JSX.Element | null {
  const css = useStyles({ classes: { root: className }, scaleOnHover });

  if (!name) return null;

  return (
    <svg width={width} height={height} className={css.root} {...rest}>
      <use xlinkHref={`#${SpriteIcon.spriteId}_${name}`} fill="currentColor" {...useProps} />
      {children}
    </svg>
  );
}

SpriteIcon.spriteId = 'svgsprite';

export default SpriteIcon;
