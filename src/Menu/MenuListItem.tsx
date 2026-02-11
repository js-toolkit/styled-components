/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import styled from '@mui/system/styled';
import useTheme from '@mui/system/useTheme';
import { Flex, type FlexComponentProps } from 'reflexy/styled';
import { noop } from '@js-toolkit/utils/noop';
import { preventDefault } from '@js-toolkit/web-utils/preventDefault';
import { stopPropagation } from '@js-toolkit/web-utils/stopPropagation';
import { useRefCallback } from '@js-toolkit/react-hooks/useRefCallback';
import { useRefs } from '@js-toolkit/react-hooks/useRefs';
import TruncatedText from '../TruncatedText';
import { excludeProp } from '../utils';
import type { IconComponentProps } from '../theme';

export interface MenuListItemProps<
  V,
  I extends IconComponentProps<IC>,
  IC extends React.ElementType = any,
> extends FlexComponentProps<'div'> {
  itemIcon?: I | undefined;
  itemTitle: React.ReactNode;
  itemSubtitle?: React.ReactNode | undefined;
  itemShrinkTitle?: boolean | undefined;
  itemValue: V;
  itemSubmenu?: boolean | undefined;
  itemChecked?: boolean | undefined;
  itemAutoFocus?: boolean | number | undefined;
  onItemSelect?:
    | ((value: this['itemValue'], event: React.UIEvent<HTMLDivElement>) => void)
    | undefined;
}

type RootProps = React.PropsWithChildren<FlexComponentProps<'div'> & { clickable: boolean }>;

const Root = styled(
  (props: RootProps) => <Flex role="menuitem" alignItems="center" shrink={0} {...props} />,
  { shouldForwardProp: excludeProp<keyof RootProps>(['clickable']) }
)(({ theme: { rc }, clickable }) => ({
  ...(clickable ? { cursor: 'pointer' } : { pointerEvents: 'none' }),
  ...rc?.MenuListItem?.root,
}));

const Icon = styled(Flex<'div'>)(({ theme: { rc } }) => ({
  flexShrink: 0,
  ...rc?.MenuListItem?.icon,
}));

const Title = styled(TruncatedText<'span'>)(({ theme: { rc } }) => ({
  ...rc?.MenuListItem?.title?.root,
}));

const Subtitle = styled(TruncatedText<'span'>)(({ theme: { rc } }) => ({
  ...rc?.MenuListItem?.subtitle?.root,
}));

export default function MenuListItem<
  V,
  I extends IconComponentProps<IC>,
  IC extends React.ElementType = any,
>({
  itemIcon,
  itemTitle,
  itemSubtitle,
  itemValue,
  itemSubmenu = false,
  itemChecked = false,
  itemAutoFocus,
  itemShrinkTitle = (!itemSubtitle && !!(itemChecked || itemSubmenu)) ||
    (!itemSubtitle && !itemChecked && !itemSubmenu),
  onItemSelect,
  onClick,
  onKeyDown,
  ref,
  ...rest
}: MenuListItemProps<V, I, IC>): React.JSX.Element {
  const { rc } = useTheme();

  const clickHandler = useRefCallback<React.MouseEventHandler<HTMLDivElement>>((event) => {
    onClick?.(event);
    if (onItemSelect) {
      stopPropagation(event);
      onItemSelect(itemValue, event);
    }
  });

  const keyDownHandler = useRefCallback<React.KeyboardEventHandler<HTMLDivElement>>((event) => {
    onKeyDown?.(event);
    if (
      onItemSelect &&
      (event.code === 'Enter' || event.code === 'Space' || event.code === 'ArrowRight')
    ) {
      preventDefault(event); // For enter
      stopPropagation(event);
      if (event.code !== 'ArrowRight' || itemSubmenu) {
        onItemSelect(itemValue, event);
      }
    }
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const rootRefs = useRefs(rootRef, ref);

  useEffect(() => {
    const { current: root } = rootRef;
    if (!root || !itemAutoFocus) return noop;

    const focus = (): number => {
      return requestAnimationFrame(() => {
        root.focus({ preventScroll: !!root.scrollIntoView });
        root.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
      });
    };

    let raf: number;

    if (itemAutoFocus === true) {
      raf = focus();
      return () => cancelAnimationFrame(raf);
    }

    const timer = setTimeout(() => {
      raf = focus();
    }, itemAutoFocus);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [itemAutoFocus]);

  const theme = rc?.MenuListItem;

  const iconProps: IconComponentProps | undefined = itemIcon
    ? { size: '1.5em', ...itemIcon }
    : undefined;

  const hasIcon = !!iconProps;

  const rootFlex =
    typeof theme?.flex === 'function'
      ? theme.flex({ hasIcon, submenu: itemSubmenu, checked: itemChecked })
      : theme?.flex;

  const titleFlex =
    typeof theme?.title?.flex === 'function'
      ? theme.title.flex({
          hasIcon,
          itemShrinkTitle,
          submenu: itemSubmenu,
          checked: itemChecked,
        })
      : theme?.title?.flex;
  const subtitleFlex =
    typeof theme?.subtitle?.flex === 'function'
      ? theme.subtitle.flex({
          hasIcon,
          itemShrinkTitle,
          submenu: itemSubmenu,
          checked: itemChecked,
        })
      : theme?.subtitle?.flex;

  const checkIconProps = itemChecked ? theme?.checkIcon : undefined;
  const submenuIconProps = itemSubmenu ? theme?.submenuIcon : undefined;

  return (
    <Root
      clickable={!!onItemSelect}
      aria-haspopup={itemSubmenu || undefined}
      ref={rootRefs}
      px
      py={hasIcon ? 0.375 : 0.625}
      {...rootFlex}
      onClick={clickHandler}
      onKeyDown={keyDownHandler}
      {...rest}
    >
      {!!iconProps && <Icon flex={false} {...iconProps} />}

      {itemTitle && typeof itemTitle !== 'object' ? (
        <Title ml={hasIcon ? 'xs' : undefined} grow shrink={itemShrinkTitle} {...titleFlex}>
          {itemTitle}
        </Title>
      ) : (
        itemTitle
      )}

      {!!itemSubtitle && (
        <Subtitle ml={!!itemTitle || undefined} shrink={!itemShrinkTitle} {...subtitleFlex}>
          {itemSubtitle}
        </Subtitle>
      )}

      {!!checkIconProps && (
        <Flex<React.ComponentType<IconComponentProps>>
          flex={false}
          ml
          shrink={0}
          size="0.75em"
          {...checkIconProps}
        />
      )}

      {!!submenuIconProps && (
        <Flex<React.ComponentType<IconComponentProps>>
          flex={false}
          ml
          shrink={0}
          size="0.6em"
          {...submenuIconProps}
        />
      )}
    </Root>
  );
}
