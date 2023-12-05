import React from 'react';
import styled from '@mui/system/styled';
import { Flex, type FlexAllProps } from 'reflexy/styled';

export type TruncatedTextProps<C extends React.ElementType = 'span'> = FlexAllProps<C> & {
  readonly lines?: number | undefined;
};

export default styled(
  function TruncatedText<C extends React.ElementType = 'span'>({
    component = 'span' as C,
    ...rest
  }: TruncatedTextProps<C>): JSX.Element {
    return <Flex flex={false} component={component} {...(rest as any)} />;
  },
  {
    shouldForwardProp: (key) => {
      const prop = key as keyof TruncatedTextProps;
      return prop !== 'lines';
    },
  }
)(({ theme: { rc }, lines }) => ({
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
      boxOrient: 'vertical',
      lineClamp: lines,
      ...rc?.TruncatedText?.multiline,
    }),
}));
