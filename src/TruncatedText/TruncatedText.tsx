import React from 'react';
import styled from '@mui/system/styled';
import { Flex, type FlexAllProps } from 'reflexy/styled';
import { excludeProp } from '../utils';

export type TruncatedTextProps<C extends React.ElementType = 'span'> = FlexAllProps<C> & {
  readonly lines?: number | undefined;
};

const Root = styled(Flex, {
  shouldForwardProp: excludeProp<TruncatedTextProps>(['lines']),
})<TruncatedTextProps>(({ theme: { rc }, lines }) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  ...rc?.TruncatedText?.root,
  ...(lines &&
    lines > 0 && {
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      // hyphens: 'auto',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: lines,
      boxOrient: 'vertical',
      lineClamp: lines,
      ...rc?.TruncatedText?.multiline,
    }),
})) as typeof Flex;

export default function TruncatedText<C extends React.ElementType = 'span'>({
  component = 'span' as C,
  ...rest
}: TruncatedTextProps<C>): React.JSX.Element {
  return <Root<React.ElementType> flex={false} component={component} {...rest} />;
}
