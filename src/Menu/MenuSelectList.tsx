import React from 'react';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import type { IconComponentProps } from '../theme';
import MenuList, { type MenuItem, type MenuListProps } from './MenuList';

export interface MenuSelectListProps<
  V extends React.Key | null,
  I extends IconComponentProps,
  HI extends IconComponentProps,
> extends MenuListProps<V, I, HI> {
  selectedValue: MenuItem<V, I>['value'];
}

export default function MenuSelectList<
  V extends React.Key | null,
  I extends IconComponentProps,
  HI extends IconComponentProps,
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
