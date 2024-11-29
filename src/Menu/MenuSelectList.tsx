import React from 'react';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import MenuList, { type MenuItem, type MenuListProps } from './MenuList';
import type { IconProps } from './MenuListItem';

export interface MenuSelectListProps<
  V extends React.Key | null,
  I extends string | IconProps,
  HI extends string | IconProps,
> extends MenuListProps<V, I, HI> {
  selectedValue: MenuItem<V, I>['value'];
}

export default function MenuSelectList<
  V extends React.Key | null,
  I extends string | IconProps,
  HI extends string | IconProps,
>({ selectedValue, onItemProps, ...rest }: MenuSelectListProps<V, I, HI>): JSX.Element {
  const itemPropsHandler = useRefCallback<NonNullable<MenuListProps<V, I, HI>['onItemProps']>>(
    (itemProps) => {
      return {
        ...(onItemProps ? onItemProps(itemProps) : itemProps),
        checked: selectedValue === itemProps.value,
      };
    }
  );

  return <MenuList onItemProps={itemPropsHandler} {...rest} />;
}
