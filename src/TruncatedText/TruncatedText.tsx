import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, FlexAllProps } from 'reflexy';

const useStyles = makeStyles({
  root: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

export type TruncatedTextProps<C extends React.ElementType = 'span'> = FlexAllProps<C>;

export default function TruncatedText<C extends React.ElementType = 'span'>({
  component = 'span' as C,
  className,
  ...rest
}: TruncatedTextProps<C>): JSX.Element {
  const css = useStyles({ classes: { root: className } });
  return <Flex flex={false} component={component} className={css.root} {...(rest as any)} />;
}
