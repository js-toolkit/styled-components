/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type AriaAttributes, useEffect, useRef } from 'react';
import styled from '@mui/system/styled';
import useTheme from '@mui/system/useTheme';
import { Flex, type FlexComponentProps } from 'reflexy/styled';
import { noop } from '@js-toolkit/utils/noop';
import { preventDefault } from '@js-toolkit/web-utils/preventDefault';
import { stopPropagation } from '@js-toolkit/web-utils/stopPropagation';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import useRefs from '@js-toolkit/react-hooks/useRefs';
import TruncatedText from '../TruncatedText';
import { excludeProp } from '../utils';
import type { IconComponentProps } from '../theme';

export interface MenuListItemProps<
  V,
  I extends IconComponentProps<IC>,
  IC extends React.ElementType = any,
> extends FlexComponentProps<'div', { omitProps: true }>,
    Pick<
      React.HTMLAttributes<HTMLDivElement>,
      | keyof React.AriaAttributes
      | 'tabIndex'
      | 'role'
      | Exclude<
          KeysOfType<React.HTMLAttributes<HTMLDivElement>, AnyFunction>,
          'onSelect' | 'onSelectCapture'
        >
    >,
    AriaAttributes {
  icon?: I | undefined;
  title: React.ReactNode;
  subtitle?: React.ReactNode | undefined;
  shrinkTitle?: boolean | undefined;
  value: V;
  submenu?: boolean | undefined;
  checked?: boolean | undefined;
  autoFocus?: boolean | number | undefined;
  onSelect?: ((value: this['value'], event: React.UIEvent<HTMLDivElement>) => void) | undefined;
}

type RootProps = React.PropsWithChildren<FlexComponentProps<'div'> & { clickable: boolean }>;

const Root = styled(
  (props: RootProps) => <Flex role="menuitem" alignItems="center" shrink={0} {...props} />,
  { shouldForwardProp: excludeProp<keyof RootProps>(['clickable']) }
)(({ theme: { rc }, clickable }) => ({
  cursor: clickable ? 'pointer' : undefined,
  ...rc?.MenuListItem?.root,
}));

const Icon = styled(Flex<'div'>)(({ theme: { rc } }) => ({
  flexShrink: 0,
  ...rc?.MenuListItem?.icon,
}));

const Title = styled(TruncatedText)(({ theme: { rc } }) => ({
  ...rc?.MenuListItem?.title?.root,
}));

const Subtitle = styled(TruncatedText)(({ theme: { rc } }) => ({
  ...rc?.MenuListItem?.subtitle?.root,
}));

export default function MenuListItem<
  V,
  I extends IconComponentProps<IC>,
  IC extends React.ElementType = any,
>({
  icon,
  title,
  subtitle,
  value,
  submenu = false,
  checked = false,
  autoFocus,
  shrinkTitle = (!subtitle && !!(checked || submenu)) || (!subtitle && !checked && !submenu),
  onSelect,
  onClick,
  onKeyDown,
  componentRef,
  ...rest
}: MenuListItemProps<V, I, IC>): JSX.Element {
  const { rc } = useTheme();

  const clickHandler = useRefCallback<React.MouseEventHandler<HTMLDivElement>>((event) => {
    onClick && onClick(event);
    if (onSelect) {
      stopPropagation(event);
      onSelect(value, event);
    }
  });

  const keyDownHandler = useRefCallback<React.KeyboardEventHandler<HTMLDivElement>>((event) => {
    onKeyDown && onKeyDown(event);
    if (
      onSelect &&
      (event.code === 'Enter' || event.code === 'Space' || event.code === 'ArrowRight')
    ) {
      preventDefault(event); // For enter
      stopPropagation(event);
      if (event.code !== 'ArrowRight' || submenu) {
        onSelect(value, event);
      }
    }
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const rootRefs = useRefs(rootRef, componentRef);

  useEffect(() => {
    const { current: root } = rootRef;
    if (!root || !autoFocus) return noop;

    const focus = (): number => {
      return requestAnimationFrame(() => {
        root.focus({ preventScroll: !!root.scrollIntoView });
        root.scrollIntoView && root.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    };

    let raf: number;

    if (autoFocus === true) {
      raf = focus();
      return () => cancelAnimationFrame(raf);
    }

    const timer = setTimeout(() => {
      raf = focus();
    }, autoFocus);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [autoFocus]);

  const theme = rc?.MenuListItem;

  const iconProps: IconComponentProps | undefined = icon ? { size: '1.5em', ...icon } : undefined;

  const hasIcon = !!iconProps;

  const rootFlex =
    typeof theme?.flex === 'function' ? theme.flex({ hasIcon, submenu, checked }) : theme?.flex;

  const titleFlex =
    typeof theme?.title?.flex === 'function'
      ? theme.title.flex({ hasIcon, shrinkTitle, submenu, checked })
      : theme?.title?.flex;
  const subtitleFlex =
    typeof theme?.subtitle?.flex === 'function'
      ? theme.subtitle.flex({ hasIcon, shrinkTitle, submenu, checked })
      : theme?.subtitle?.flex;

  const checkIconProps = checked ? theme?.checkIcon : undefined;
  const submenuIconProps = submenu ? theme?.submenuIcon : undefined;

  return (
    <Root
      clickable={!!onSelect}
      aria-haspopup={submenu || undefined}
      componentRef={rootRefs}
      px
      py={hasIcon ? 0.375 : 0.625}
      {...rootFlex}
      onClick={clickHandler}
      onKeyDown={keyDownHandler}
      {...rest}
    >
      {!!iconProps && <Icon flex={false} {...iconProps} />}

      {title && typeof title !== 'object' ? (
        <Title ml={hasIcon ? 'xs' : undefined} grow shrink={shrinkTitle} {...titleFlex}>
          {title}
        </Title>
      ) : (
        title
      )}

      {!!subtitle && (
        <Subtitle ml shrink={!shrinkTitle} {...subtitleFlex}>
          {subtitle}
        </Subtitle>
      )}

      {!!checkIconProps && (
        <Flex<React.FC<IconComponentProps>>
          flex={false}
          ml
          shrink={0}
          size="0.75em"
          {...checkIconProps}
        />
      )}

      {!!submenuIconProps && (
        <Flex<React.FC<IconComponentProps>>
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
