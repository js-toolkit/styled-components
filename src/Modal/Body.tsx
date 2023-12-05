import React from 'react';
import styled from '@mui/system/styled';
import { Flex, type FlexComponentProps } from 'reflexy/styled';

export type BodyProps = FlexComponentProps<'div'>;

export default styled(({ p = 'l', ...rest }: React.PropsWithChildren<BodyProps>) => (
  <Flex p={p} column {...rest} />
))(({ theme: { rc } }) => ({
  boxSizing: 'border-box',
  backgroundColor: '#fff',

  '&:first-of-type': {
    borderTopLeftRadius: 'inherit',
    borderTopRightRadius: 'inherit',
  },

  '&:last-of-type': {
    borderBottomLeftRadius: 'inherit',
    borderBottomRightRadius: 'inherit',
  },

  ...rc?.Modal?.Body,
}));
