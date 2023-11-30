import React from 'react';
import styled from '@mui/system/styled';
import type { DropDownContextValue } from '../DropDownContext';

export interface ExpandIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<DropDownContextValue, 'expanded'> {}

export default styled('div', {
  name: 'ExpandIcon',
  shouldForwardProp: (key) => key !== 'expanded',
})(({ expanded }: ExpandIconProps) => ({
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
