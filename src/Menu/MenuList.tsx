import React, { useMemo } from 'react';
import styled from '@mui/system/styled';
import useTheme from '@mui/system/useTheme';
import { Flex, type FlexAllProps, type FlexComponentProps } from 'reflexy/styled';
import { stopPropagation } from '@js-toolkit/web-utils/stopPropagation';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import SvgSpriteIcon from '../svg/SvgSpriteIcon';
import Button, { type ButtonProps } from '../Button';
import MenuListItem, { type IconProps, type MenuListItemProps } from './MenuListItem';

export type MenuItem<V, I extends string | IconProps> = Omit<MenuListItemProps<V, I>, 'onClick'> &
  React.Attributes;

export interface MenuListProps<V, I extends string | IconProps, HI extends string | IconProps>
  extends FlexComponentProps<'div'> {
  header?: React.ReactChild | undefined;
  headerIcon?: HI | undefined;
  headerAction?: string | React.ReactElement | undefined;
  items?: MenuItem<V, I>[] | undefined;
  headerProps?:
    | FlexAllProps<
        React.ComponentType<
          React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
        >
      >
    | undefined;
  headerGroupProps?:
    | FlexAllProps<
        React.ComponentType<
          React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
        >
      >
    | undefined;
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

const HeaderGroup = styled(Flex)(({ theme: { rc }, onClick }) => ({
  cursor: onClick ? 'pointer' : undefined,
  ...rc?.MenuList?.header?.group?.root,
}));

const HeaderTitle = styled(Flex)(({ theme: { rc } }) => ({
  fontWeight: 500,
  ...rc?.MenuList?.header?.title?.root,
}));

export default function MenuList<V, I extends string | IconProps, HI extends string | IconProps>({
  header,
  headerIcon,
  onBack,
  onClose,
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
}: MenuListProps<V, I, HI>): JSX.Element {
  const { rc } = useTheme();

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
  const hasCloseIcon = !!(closeIconProps?.svgSprite || closeIconProps?.svg);

  const headerIconProps: IconProps | undefined =
    typeof headerIcon === 'string' ? { svgSprite: { name: headerIcon } } : headerIcon;

  const hasHeader = !!(
    header ||
    headerIconProps?.svgSprite ||
    headerIconProps?.svg ||
    onBack ||
    headerAction ||
    onClose
  );

  const hasHeaderIcon =
    !!backIconProps?.svgSprite ||
    !!backIconProps?.svg ||
    !!headerIconProps?.svgSprite ||
    !!headerIconProps?.svg;

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
          <HeaderGroup
            grow
            alignItems="center"
            onClick={onBack ? backHandler : undefined}
            {...headerGroupFlex}
            {...headerGroupProps}
          >
            {!!backIconProps?.svgSprite && (
              <Flex
                flex={false}
                component={SvgSpriteIcon}
                size="1.5em"
                {...backIconProps.svgSprite}
              />
            )}
            {!!backIconProps?.svg && <Flex flex={false} {...backIconProps.svg} />}

            {!!headerIconProps?.svgSprite && (
              <Flex flex={false} component={SvgSpriteIcon} {...headerIconProps.svgSprite} />
            )}
            {!!headerIconProps?.svg && <Flex flex={false} {...headerIconProps.svg} />}

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

          {hasCloseIcon && (
            <Button shrink={0} size="contain" color="none" onClick={closeHandler}>
              {!!closeIconProps?.svgSprite && (
                <Flex
                  flex={false}
                  component={SvgSpriteIcon}
                  size="0.875em"
                  {...closeIconProps.svgSprite}
                />
              )}
              {!!closeIconProps?.svg && <Flex flex={false} {...closeIconProps.svg} />}
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
