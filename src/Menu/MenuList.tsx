import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import useTheme from '@mui/system/useTheme';
import { Flex, type FlexComponentProps } from 'reflexy/styled/jss';
import stopPropagation from '@jstoolkit/web-utils/stopPropagation';
import useRefCallback from '@jstoolkit/react-hooks/useRefCallback';
import SvgSpriteIcon, { type SvgSpriteIconProps } from '../SvgSpriteIcon';
import type { Theme } from '../theme';
import Button, { type ButtonProps } from '../Button';
import MenuListItem, { type MenuListItemProps } from './MenuListItem';

const useStyles = makeStyles(({ rc }: Theme) => ({
  root: { ...rc?.MenuList?.root },

  clickable: {
    cursor: 'pointer',
  },

  header: { ...rc?.MenuList?.header?.root },

  headerTitle: {
    fontWeight: 500,
    ...rc?.MenuList?.header?.title?.root,
  },

  headerAction: {
    ...rc?.MenuList?.header?.action?.root,
  },
}));

export type MenuItem<V, I extends string | SvgSpriteIconProps<string>> = Omit<
  MenuListItemProps<V, I>,
  'onClick'
> &
  React.Attributes;

export interface MenuListProps<
  V,
  I extends string | SvgSpriteIconProps<string>,
  HI extends string | SvgSpriteIconProps<string>
> extends FlexComponentProps<'div'> {
  header?: React.ReactChild | undefined;
  headerIcon?: HI | undefined;
  headerAction?: string | React.ReactElement<any, any> | undefined;
  items?: MenuItem<V, I>[] | undefined;
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

export function DefaultHeaderAction({ className, ...rest }: ButtonProps): JSX.Element {
  const { rc } = useTheme<Theme>();
  const css = useStyles({ classes: { headerAction: className } });
  return (
    <Button
      ml
      shrink={0}
      size="contain"
      color="none"
      {...rc?.MenuList?.header?.action?.flex}
      className={css.headerAction}
      {...rest}
    />
  );
}

export default function MenuList<
  V,
  I extends string | SvgSpriteIconProps<string>,
  HI extends string | SvgSpriteIconProps<string>
>({
  header,
  headerIcon,
  onBack,
  onClose,
  items,
  onItemSelect,
  onItemMouseEnter,
  onItemMouseLeave,
  onItemFocus,
  onItemBlur,
  onItemProps,
  headerAction,
  onHeaderAction,
  children,
  className,
  onKeyDown,
  ...rest
}: MenuListProps<V, I, HI>): JSX.Element {
  const { rc } = useTheme<Theme>();
  const css = useStyles({ classes: { root: className } });

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

  const listFlex =
    typeof theme?.list?.flex === 'function' ? theme.list.flex({ hasHeader }) : theme?.list?.flex;

  const itemsElements = useMemo(() => {
    if (!items || items.length === 0) return [];
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
    <Flex column className={css.root} role="menu" onKeyDown={keyDownHandler} {...rest}>
      {hasHeader && (
        <Flex
          py="xs"
          pl="s"
          pr
          alignItems="center"
          shrink={0}
          {...theme?.header?.flex}
          className={css.header}
        >
          <Flex
            grow
            alignItems="center"
            className={onBack ? css.clickable : undefined}
            onClick={onBack ? backHandler : undefined}
          >
            {!!backIconProps && <SvgSpriteIcon size="1.5em" {...backIconProps} />}
            {!!headerIconProps && <SvgSpriteIcon {...headerIconProps} />}

            <Flex
              ml={!backIconProps && !headerIconProps ? 's' : 'xs'}
              py="xs"
              grow
              {...headerTitleFlex}
              className={css.headerTitle}
            >
              {header}
            </Flex>
          </Flex>

          {headerActionElement}

          {/* {!!headerAction && (
            <Button
              ml
              shrink={0}
              size="contain"
              color="none"
              {...headerActionFlex}
              className={css.headerAction}
              onClick={headerActionHandler}
            >
              {headerAction}
            </Button>
          )} */}

          {!!closeIconProps && (
            <Button shrink={0} size="contain" color="none" onClick={closeHandler}>
              <SvgSpriteIcon size="0.875em" {...closeIconProps} />
            </Button>
          )}
        </Flex>
      )}

      <Flex mt={hasHeader ? 'xs' : undefined} column overflowY="auto" {...listFlex}>
        <Flex column shrink={0}>
          {itemsElements}
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
}
