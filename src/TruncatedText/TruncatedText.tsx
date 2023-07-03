import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { Flex, type FlexAllProps } from 'reflexy/styled/jss';
import type { Theme } from '../theme';

export type TruncatedTextProps<C extends React.ElementType = 'span'> = FlexAllProps<C> & {
  readonly lines?: number | undefined;
};

type MakeStylesProps = Pick<TruncatedTextProps, 'lines'>;

const useStyles = makeStyles(({ rc }: Theme) => ({
  root: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    ...rc?.TruncatedText?.root,
  },

  multiline: {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    // hyphens: 'auto',
    display: '-webkit-box',
    boxOrient: 'vertical',
    lineClamp: ({ lines }: MakeStylesProps) => lines,
    ...rc?.TruncatedText?.multiline,
  },
}));

export default function TruncatedText<C extends React.ElementType = 'span'>({
  component = 'span' as C,
  lines,
  className,
  ...rest
}: TruncatedTextProps<C>): JSX.Element {
  const css = useStyles({
    classes: { root: className },
    lines: lines && lines > 0 ? lines : undefined,
  });
  return (
    <Flex
      flex={false}
      component={component}
      className={clsx(css.root, lines && lines > 0 && css.multiline)}
      {...(rest as any)}
    />
  );
}
