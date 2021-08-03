import React from 'react';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import type { SvgSpriteIconProps } from '../SvgSpriteIcon';
import MenuList, { MenuItem, MenuListProps } from './MenuList';

export interface MenuSelectListProps<
  V extends React.Key | null,
  I extends string | SvgSpriteIconProps<string>,
  HI extends string | SvgSpriteIconProps<string>
> extends OmitStrict<MenuListProps<V, I, HI>, 'onItemSelect'> {
  selectedValue: MenuItem<V, I>['value'];
  onSelectValue: NonNullable<MenuListProps<V, I, HI>['onItemSelect']>;
}

export default function MenuSelectList<
  V extends React.Key | null,
  I extends string | SvgSpriteIconProps<string>,
  HI extends string | SvgSpriteIconProps<string>
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

  return <MenuList onItemProps={itemPropsHandler} onItemSelect={onSelectValue} {...rest} />;
}
