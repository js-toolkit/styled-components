import React from 'react';
import styled from '@mui/styles/styled';
import { Flex, type FlexComponentProps } from 'reflexy/styled/jss';
import type { Theme } from '../../theme';

export interface BadgeIconProps extends FlexComponentProps, Required<React.PropsWithChildren<{}>> {}

const BadgeIcon = styled((props: BadgeIconProps) => <Flex shrink={0} center {...props} />)<Theme>(
  ({ theme }) => ({
    fontSize: '0.75em',
    fontWeight: 600,
    minWidth: '1.5em',
    minHeight: '1.5em',
    height: '1.5em',
    lineHeight: 1.5,
    padding: '0 0.45em',
    boxSizing: 'border-box',
    whiteSpace: 'pre',
    borderRadius: 'calc(1.5em / 2)',
    backgroundColor: 'var(--rc--badge-icon-bg-color, #ff5e5e)',
    color: 'var(--rc--badge-icon-color, #fff)',
    boxShadow: 'var(--rc--badge-icon-shadow, 0 0 0 1px #fff)',
    ...theme.rc?.Badge?.BadgeIcon,
  })
);

export default BadgeIcon;
