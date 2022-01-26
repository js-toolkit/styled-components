import React from 'react';
import styled from '@mui/styles/styled';
import type { DropDownContextValue } from '../DropDownContext';

const ExpandIcon = styled(
  ({
    expanded,
    ...rest
  }: React.HTMLAttributes<HTMLDivElement> & Pick<DropDownContextValue, 'expanded'>) => (
    <div {...rest} />
  )
)(({ expanded }) => ({
  display: 'inline-block',
  width: 0,
  height: 0,
  marginLeft: '1ex',
  borderTopColor: 'currentColor',
  borderBottomColor: 'currentColor',
  border: '0.3em solid transparent',
  borderBottomWidth: 0,
  transition: '0.15s transform',
  transform: expanded ? 'rotate(180deg)' : undefined,
}));

export default ExpandIcon;
