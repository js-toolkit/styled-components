import React, { type AriaAttributes, useEffect, useRef } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import useTheme from '@mui/styles/useTheme';
import { Flex, type FlexComponentProps } from 'reflexy/styled';
import noop from '@jstoolkit/utils/noop';
import preventDefault from '@jstoolkit/web-utils/preventDefault';
import stopPropagation from '@jstoolkit/web-utils/stopPropagation';
import useRefCallback from '@jstoolkit/react-hooks/useRefCallback';
import useRefs from '@jstoolkit/react-hooks/useRefs';
import type { Theme } from '../theme';
import TruncatedText from '../TruncatedText';
import SvgSpriteIcon, { type SvgSpriteIconProps } from '../SvgSpriteIcon';

type MakeStylesProps = { clickable: boolean };

const useStyles = makeStyles(({ rc }: Theme) => ({
  root: {
    cursor: ({ clickable }: MakeStylesProps) => (clickable ? 'pointer' : ''),
    ...rc?.MenuListItem?.root,
  },

  title: {
    ...rc?.MenuListItem?.title?.root,
  },

  subtitle: {
    ...rc?.MenuListItem?.subtitle?.root,
  },
}));

export interface MenuListItemProps<V, I extends string | SvgSpriteIconProps<string>>
  extends FlexComponentProps<'div', { omitProps: true }>,
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

export default function MenuListItem<V, I extends string | SvgSpriteIconProps<string>>({
  icon,
  title,
  subtitle,
  value,
  submenu = false,
  checked = false,
  autoFocus,
  shrinkTitle = (!subtitle && !!(checked || submenu)) || (!subtitle && !checked && !submenu),
  className,
  onSelect,
  onClick,
  onKeyDown,
  componentRef,
  ...rest
}: MenuListItemProps<V, I>): JSX.Element {
  const css = useStyles({ classes: { root: className }, clickable: !!onSelect });
  const { rc } = useTheme<Theme>();

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

  const iconProps =
    typeof icon === 'string' ? { name: icon, size: '1.5em' } : (icon as SvgSpriteIconProps<string>);

  const rootFlex =
    typeof theme?.flex === 'function'
      ? theme.flex({ hasIcon: !!iconProps, submenu, checked })
      : theme?.flex;

  const titleFlex =
    typeof theme?.title?.flex === 'function'
      ? theme.title.flex({ hasIcon: !!iconProps, shrinkTitle, submenu, checked })
      : theme?.title?.flex;
  const subtitleFlex =
    typeof theme?.subtitle?.flex === 'function'
      ? theme.subtitle.flex({ hasIcon: !!iconProps, shrinkTitle, submenu, checked })
      : theme?.subtitle?.flex;

  const checkIconProps = checked ? theme?.checkIcon : undefined;
  const submenuIconProps = submenu ? theme?.submenuIcon : undefined;

  return (
    <Flex
      aria-haspopup={submenu || undefined}
      role="menuitem"
      componentRef={rootRefs}
      px
      py={iconProps ? 0.375 : 0.625}
      alignItems="center"
      {...rootFlex}
      className={css.root}
      onClick={clickHandler}
      onKeyDown={keyDownHandler}
      {...rest}
    >
      {!!iconProps && <SvgSpriteIcon {...iconProps} />}

      {title && typeof title !== 'object' ? (
        <TruncatedText
          ml={iconProps ? 'xs' : undefined}
          grow
          shrink={shrinkTitle}
          {...titleFlex}
          className={css.title}
        >
          {title}
        </TruncatedText>
      ) : (
        title
      )}

      {!!subtitle && (
        <TruncatedText ml shrink={!shrinkTitle} {...subtitleFlex} className={css.subtitle}>
          {subtitle}
        </TruncatedText>
      )}

      {!!checkIconProps && (
        <Flex ml shrink={0} component={SvgSpriteIcon} size="0.75em" {...checkIconProps} />
      )}

      {!!submenuIconProps && (
        <Flex ml shrink={0} component={SvgSpriteIcon} size="0.6em" {...submenuIconProps} />
      )}
    </Flex>
  );
}
