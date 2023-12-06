import React, { useMemo } from 'react';
import styled from '@mui/system/styled';
import useTheme from '@mui/system/useTheme';
import { Flex, type FlexAllProps, type FlexComponentProps } from 'reflexy/styled';
import { stopPropagation } from '@js-toolkit/web-utils/stopPropagation';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import SvgSpriteIcon, { type SvgSpriteIconProps } from '../svg/SvgSpriteIcon';
import Button, { type ButtonProps } from '../Button';
import MenuListItem, { type MenuListItemProps } from './MenuListItem';

export type MenuItem<V, I extends string | SvgSpriteIconProps<string>> = Omit<
  MenuListItemProps<V, I>,
  'onClick'
> &
  React.Attributes;

export interface MenuListProps<
  V,
  I extends string | SvgSpriteIconProps<string>,
  HI extends string | SvgSpriteIconProps<string>,
> extends FlexComponentProps<'div'> {
  header?: React.ReactChild | undefined;
  headerIcon?: HI | undefined;
  headerAction?: string | React.ReactElement | undefined;
  items?: MenuItem<V, I>[] | undefined;
  headerProps?: FlexAllProps<'div'> | undefined;
  listProps?: FlexAllProps<'div'> | undefined;
  onItemSelect?: MenuListItemProps<V, I>['onSelect'] | undefined;
  onItemMouseEnter?:
    | ((value: MenuListItemProps<V, I>['value'], event: React.MouseEvent<HTMLDivElement>) => void)
    | undefined;
  onItemMouseLeave?:
    | ((value: MenuListItemProps<V, I>['value'], event: React.MouseEvent<HTMLDivElement>) => void)
    | undefined;
  onItemFocus?:
    | ((value: MenuListItemProps<V, I>['value'], event: React.FocusEvent<HTMLDivElement>) => void)
    | undefined;
  onItemBlur?:
    | ((value: MenuListItemProps<V, I>['value'], event: React.FocusEvent<HTMLDivElement>) => void)
    | undefined;
  onItemProps?: ((itemProps: MenuItem<V, I>) => MenuItem<V, I>) | undefined;
  onClose?: VoidFunction | undefined;
  onBack?: VoidFunction | undefined;
  onHeaderAction?: VoidFunction | undefined;
}

export const DefaultHeaderAction = styled((props: ButtonProps) => {
  const { rc } = useTheme();
  return (
    <Button
      ml
      shrink={0}
      size="contain"
      color="none"
      {...rc?.MenuList?.header?.action?.flex}
      {...props}
    />
  );
})(({ theme: { rc } }) => ({
  ...rc?.MenuList?.header?.action?.root,
}));

const Root = styled((props: React.PropsWithChildren<FlexComponentProps<'div'>>) => (
  <Flex column role="menu" {...props} />
))(({ theme: { rc } }) => ({
  ...rc?.MenuList?.root,
}));

const HeaderRoot = styled((props: React.PropsWithChildren<FlexComponentProps>) => {
  return <Flex alignItems="center" shrink={0} {...props} />;
})(({ theme: { rc } }) => ({
  ...rc?.MenuList?.header?.root,
}));

const HeaderTitleContainer = styled((props: React.PropsWithChildren<FlexComponentProps<'div'>>) => {
  return <Flex grow alignItems="center" {...props} />;
})(({ theme: { rc }, onClick }) => ({
  cursor: onClick ? 'pointer' : undefined,
  ...rc?.MenuList?.header?.root,
}));

const HeaderTitle = styled((props: React.PropsWithChildren<FlexComponentProps>) => {
  return <Flex {...props} />;
})(({ theme: { rc } }) => ({
  fontWeight: 500,
  ...rc?.MenuList?.header?.title?.root,
}));

export default function MenuList<
  V,
  I extends string | SvgSpriteIconProps<string>,
  HI extends string | SvgSpriteIconProps<string>,
>({
  header,
  headerIcon,
  onBack,
  onClose,
  items,
  headerProps,
  listProps,
  onItemSelect,
  onItemMouseEnter,
  onItemMouseLeave,
  onItemFocus,
  onItemBlur,
  onItemProps,
  headerAction,
  onHeaderAction,
  children,
  onKeyDown,
  ...rest
}: MenuListProps<V, I, HI>): JSX.Element {
  const { rc } = useTheme();
  // const css = useStyles({ classes: { root: className, header: headerProps?.className } });

  const backHandler = useRefCallback<React.MouseEventHandler>((event) => {
    onBack && stopPropagation(event);
    onBack && onBack();
  });

  const closeHandler = useRefCallback<React.MouseEventHandler>((event) => {
    onClose && stopPropagation(event);
    onClose && onClose();
  });

  const headerActionHandler = useRefCallback<React.MouseEventHandler>((event) => {
    onHeaderAction && stopPropagation(event);
    onHeaderAction && onHeaderAction();
  });

  const theme = rc?.MenuList;
  const backIconProps = onBack ? theme?.header?.backIcon : undefined;
  const closeIconProps = onClose ? theme?.header?.closeIcon : undefined;

  const headerIconProps =
    typeof headerIcon === 'string'
      ? { name: headerIcon }
      : (headerIcon as SvgSpriteIconProps<string>);

  const hasHeader = !!(header || headerIconProps || onBack || headerAction || onClose);

  const headerTitleFlex =
    typeof theme?.header?.title?.flex === 'function'
      ? theme.header.title.flex({ hasIcon: !!backIconProps || !!headerIconProps })
      : theme?.header?.title?.flex;

  const listContainerFlex =
    typeof theme?.list?.flex === 'function' ? theme.list.flex({ hasHeader }) : theme?.list?.flex;

  const itemsElements = useMemo(() => {
    if (!items || items.length === 0) return undefined;
    return items.map((itemProps, i) => {
      const {
        value,
        key = value == null || typeof value === 'string' || typeof value === 'number'
          ? (value as unknown as React.Key)
          : `key${i}`,
        ...restItemProps
      } = onItemProps ? onItemProps(itemProps) : itemProps;
      return (
        <MenuListItem
          key={key}
          value={value}
          onSelect={onItemSelect}
          onMouseEnter={onItemMouseEnter && ((event) => onItemMouseEnter(value, event))}
          onMouseLeave={onItemMouseLeave && ((event) => onItemMouseLeave(value, event))}
          onFocus={onItemFocus && ((event) => onItemFocus(value, event))}
          onBlur={onItemBlur && ((event) => onItemBlur(value, event))}
          {...restItemProps}
        />
      );
    });
  }, [
    items,
    onItemBlur,
    onItemFocus,
    onItemMouseEnter,
    onItemMouseLeave,
    onItemProps,
    onItemSelect,
  ]);

  const keyDownHandler = useRefCallback<React.KeyboardEventHandler<HTMLDivElement>>((event) => {
    onKeyDown && onKeyDown(event);
    (event.code === 'ArrowLeft' || event.code === 'ArrowRight') && stopPropagation(event);
    event.code === 'ArrowLeft' && onBack && onBack();
  });

  const headerActionElement =
    !!headerAction &&
    (React.isValidElement(headerAction) ? (
      headerAction
    ) : (
      <DefaultHeaderAction onClick={headerActionHandler}>{headerAction}</DefaultHeaderAction>
    ));

  return (
    <Root onKeyDown={keyDownHandler} {...rest}>
      {hasHeader && (
        <HeaderRoot py="xs" pl="s" pr {...theme?.header?.flex} {...headerProps}>
          <HeaderTitleContainer grow alignItems="center" onClick={onBack ? backHandler : undefined}>
            {!!backIconProps && <SvgSpriteIcon size="1.5em" {...backIconProps} />}
            {!!headerIconProps && <SvgSpriteIcon {...headerIconProps} />}

            <HeaderTitle
              ml={!backIconProps && !headerIconProps ? 's' : 'xs'}
              py="xs"
              grow
              {...headerTitleFlex}
            >
              {header}
            </HeaderTitle>
          </HeaderTitleContainer>

          {headerActionElement}

          {!!closeIconProps && (
            <Button shrink={0} size="contain" color="none" onClick={closeHandler}>
              <SvgSpriteIcon size="0.875em" {...closeIconProps} />
            </Button>
          )}
        </HeaderRoot>
      )}

      <Flex
        mt={hasHeader ? 'xs' : undefined}
        column
        overflowY="auto"
        {...listContainerFlex}
        {...listProps}
      >
        <Flex
          column
          shrink={0}
          // If parent's overflowY is disabled to allow custom children to be able to be scrollable.
          vfill
        >
          {itemsElements}
          {children}
        </Flex>
      </Flex>
    </Root>
  );
}
