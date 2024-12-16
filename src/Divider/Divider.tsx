import React from 'react';
import styled from '@mui/system/styled';
import { Flex, type FlexAllProps, type DefaultComponentType } from 'reflexy/styled';

export type DividerProps<C extends React.ElementType = DefaultComponentType> = {
  readonly light?: boolean | undefined;
} & FlexAllProps<C>;

const Root = styled(Flex, {
  shouldForwardProp: (key) => {
    const prop = key as keyof Pick<DividerProps, 'light'>;
    return prop !== 'light';
  },
})<DividerProps>(({ theme: { rc }, light }) => ({
  "&[data-orientation='horizontal']": {
    height: '1px',
  },

  "&[data-orientation='vertical']": {
    width: '1px',
  },

  backgroundColor: light
    ? 'var(--rc--divider-color-light, rgba(255, 255, 255, 0.1))'
    : 'var(--rc--divider-color, rgba(0, 0, 0, 0.1))',

  ...(light ? rc?.Divider?.light : rc?.Divider?.default),
})) as typeof Flex;

export default function Divider<C extends React.ElementType = DefaultComponentType>({
  light,
  column,
  ...rest
}: DividerProps<C>): React.JSX.Element {
  return (
    <Root
      column={column}
      shrink={0}
      light={light}
      data-orientation={column ? 'vertical' : 'horizontal'}
      {...rest}
    />
  );
}
