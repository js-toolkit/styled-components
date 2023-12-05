import React from 'react';
import styled from '@mui/system/styled';
import { Flex, type FlexComponentProps } from 'reflexy/styled';
import CloseIcon from './CloseIcon';

export interface HeaderProps extends FlexComponentProps<'div'> {
  readonly closeIcon?: React.ReactNode;
  readonly onCloseClick?: React.MouseEventHandler<SVGSVGElement> | undefined;
}

const StyledCloseIcon = styled(CloseIcon)(({ theme: { rc } }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '1.35em',
  height: '1.35em',
  boxSizing: 'content-box',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'scale 0.1s',

  '&:hover:not(:active)': {
    scale: 1.2,
  },

  ...rc?.Modal?.Header?.closeIcon,
}));

export default styled(
  ({
    p = 'l',
    closeIcon,
    onCloseClick,
    children,
    ...rest
  }: React.PropsWithChildren<HeaderProps>) => {
    return (
      <Flex p={p} {...rest}>
        {children}
        {closeIcon === true && <Flex p="s" component={StyledCloseIcon} onClick={onCloseClick} />}
        {closeIcon && closeIcon !== true && closeIcon}
      </Flex>
    );
  }
)(({ theme: { rc } }) => ({
  position: 'relative',
  boxSizing: 'border-box',
  fontSize: '1.125em',
  borderTopLeftRadius: 'inherit',
  borderTopRightRadius: 'inherit',
  borderBottom: '1px solid var(--rc--modal-footer-color, #2c7caf)',
  backgroundColor: 'var(--rc--modal-header-bg-color, #3488c3)',
  color: '#fff',

  ...rc?.Modal?.Header,
}));
