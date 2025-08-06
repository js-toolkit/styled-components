import React, { useMemo } from 'react';
import styled from '@mui/system/styled';
import useTheme from '@mui/system/useTheme';
import { Flex, type FlexAllProps, type FlexComponentProps } from 'reflexy/styled';
import { stopPropagation } from '@js-toolkit/web-utils/stopPropagation';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import Button, { type ButtonProps } from '../Button';
import type { IconComponentProps } from '../theme';
import MenuListItem, { type MenuListItemProps } from './MenuListItem';

export type MenuItem<V, I extends IconComponentProps> = Omit<MenuListItemProps<V, I>, 'onClick'> &
  React.Attributes;

export interface MenuListProps<V, I extends IconComponentProps, HI extends IconComponentProps>
  extends FlexComponentProps<'div'> {
  header?: React.ReactNode | undefined;
  headerIcon?: HI | undefined;
  headerAction?: string | React.ReactElement | undefined;
  itemComponent?: React.FC<MenuListItemProps<V, I>>;
  items?: MenuItem<V, I>[] | undefined;
  headerProps?:
    | FlexAllProps<
        React.ComponentType<
          React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
        >
      >
    | undefined;
  headerGroupProps?: FlexAllProps<'div'> | undefined;
  listProps?:
    | FlexAllProps<
        React.ComponentType<
          React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
        >
      >
    | undefined;
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

const HeaderGroup = styled(Flex<'div'>)(({ theme: { rc }, onClick }) => ({
  cursor: onClick ? 'pointer' : undefined,
  ...rc?.MenuList?.header?.group?.root,
}));

const HeaderTitle = styled(Flex<'div'>)(({ theme: { rc } }) => ({
  fontWeight: 500,
  ...rc?.MenuList?.header?.title?.root,
}));

export default function MenuList<V, I extends IconComponentProps, HI extends IconComponentProps>({
  header,
  headerIcon,
  onBack,
  onClose,
  itemComponent: ItemComponent = MenuListItem,
  items,
  headerProps,
  headerGroupProps,
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
}: MenuListProps<V, I, HI>): React.JSX.Element {
  const { rc } = useTheme();

  const backHandler = useRefCallback<React.MouseEventHandler>((event) => {
    if (onBack) {
      stopPropagation(event);
      onBack();
    }
  });

  const closeHandler = useRefCallback<React.MouseEventHandler>((event) => {
    if (onClose) {
      stopPropagation(event);
      onClose();
    }
  });

  const headerActionHandler = useRefCallback<React.MouseEventHandler>((event) => {
    if (onHeaderAction) {
      stopPropagation(event);
      onHeaderAction();
    }
  });

  const theme = rc?.MenuList;
  const backIconProps = onBack ? theme?.header?.backIcon : undefined;
  const closeIconProps = onClose ? theme?.header?.closeIcon : undefined;
  // const hasCloseIcon = !!(closeIconProps?.svgSprite || closeIconProps?.svg);

  const headerIconProps = headerIcon;

  const hasHeader = !!(header || headerIconProps || onBack || headerAction || onClose);

  const hasHeaderIcon = !!(backIconProps || headerIconProps);

  const headerGroupFlex =
    typeof theme?.header?.group?.flex === 'function'
      ? theme.header.group.flex({ hasIcon: hasHeaderIcon })
      : theme?.header?.group?.flex;

  const headerTitleFlex =
    typeof theme?.header?.title?.flex === 'function'
      ? theme.header.title.flex({ hasIcon: hasHeaderIcon })
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
        <ItemComponent
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
    ItemComponent,
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
          <HeaderGroup
            grow
            alignItems="center"
            onClick={onBack ? backHandler : undefined}
            {...headerGroupFlex}
            {...headerGroupProps}
          >
            {!!backIconProps && (
              <Flex<React.FC<IconComponentProps>> flex={false} size="1.5em" {...backIconProps} />
            )}

            {!!headerIconProps && (
              <Flex<React.FC<IconComponentProps>> flex={false} {...headerIconProps} />
            )}

            <HeaderTitle
              ml={!backIconProps && !headerIconProps ? 's' : 'xs'}
              py="xs"
              grow
              {...headerTitleFlex}
            >
              {header}
            </HeaderTitle>
          </HeaderGroup>

          {headerActionElement}

          {!!closeIconProps && (
            <Button shrink={0} size="contain" color="none" onClick={closeHandler}>
              <Flex<React.FC<IconComponentProps>> flex={false} size="0.875em" {...closeIconProps} />
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
