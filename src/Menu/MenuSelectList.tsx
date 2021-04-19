import React from 'react';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import type { SvgSpriteIconProps } from '../SvgSpriteIcon';
import MenuList, { MenuItem, MenuListProps } from './MenuList';

export interface MenuSelectListProps<
  V extends React.Key | null,
  I extends string | SvgSpriteIconProps<any>,
  HI extends string | SvgSpriteIconProps<any>
> extends Omit<MenuListProps<V, I, HI>, 'onItemClick'> {
  selectedValue: MenuItem<V, I>['value'];
  onSelectValue: NonNullable<MenuListProps<V, I, HI>['onItemClick']>;
}

export default function MenuSelectList<
  V extends React.Key | null,
  I extends string | SvgSpriteIconProps<any>,
  HI extends string | SvgSpriteIconProps<any>
>({
  selectedValue,
  onSelectValue,
  onItemProps,
  ...rest
}: MenuSelectListProps<V, I, HI>): JSX.Element {
  const itemPropsHandler = useRefCallback<NonNullable<MenuListProps<V, I, HI>['onItemProps']>>(
    (itemProps) => {
      return {
        ...(onItemProps ? onItemProps(itemProps) : itemProps),
        checked: selectedValue === itemProps.value,
      };
    }
  );

  return <MenuList onItemProps={itemPropsHandler} onItemClick={onSelectValue} {...rest} />;
}
