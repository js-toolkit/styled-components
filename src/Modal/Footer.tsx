import React from 'react';
import styled from '@mui/system/styled';
import { Flex, type FlexComponentProps } from 'reflexy/styled';

export type FooterProps = FlexComponentProps<'div'>;

export default styled(({ p = 'l', ...rest }: React.PropsWithChildren<FooterProps>) => (
  <Flex p={p} column {...rest} />
))(({ theme: { rc } }) => ({
  boxSizing: 'border-box',
  backgroundColor: '#fff',
  borderTop: '1px solid var(--rc--divider-color, rgba(0, 0, 0, 0.1))',
  color: 'var(--rc--modal-footer-color, #2c7caf)',

  '&:first-of-type': {
    borderTopLeftRadius: 'inherit',
    borderTopRightRadius: 'inherit',
  },

  '&:last-of-type': {
    borderBottomLeftRadius: 'inherit',
    borderBottomRightRadius: 'inherit',
  },

  ...rc?.Modal?.Footer,
}));
