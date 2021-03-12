import React from 'react';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import MenuList, { MenuItem, MenuListProps } from './MenuList';

export interface MenuSelectListProps<V extends React.Key | null, I extends string>
  extends Omit<MenuListProps<V, I>, 'onItemClick'> {
  selectedValue: MenuItem<V, I>['value'];
  onSelectValue: NonNullable<MenuListProps<V, I>['onItemClick']>;
}

export default function MenuSelectList<V extends React.Key | null, I extends string>({
  selectedValue,
  onSelectValue,
  onItemProps,
  ...rest
}: MenuSelectListProps<V, I>): JSX.Element {
  const itemPropsHandler = useRefCallback<NonNullable<MenuListProps<V, I>['onItemProps']>>(
    (itemProps) => {
      return {
        ...(onItemProps ? onItemProps(itemProps) : itemProps),
        checked: selectedValue === itemProps.value,
      };
    }
  );

  return <MenuList onItemProps={itemPropsHandler} onItemClick={onSelectValue} {...rest} />;
}
