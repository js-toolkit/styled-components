import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import useTheme from '@material-ui/styles/useTheme';
import { Flex, FlexComponentProps } from 'reflexy';
import stopPropagation from '@js-toolkit/web-utils/stopPropagation';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import type { Theme } from '../theme';
import TruncatedText from '../TruncatedText';
import SvgSpriteIcon, { SvgSpriteIconProps } from '../SvgSpriteIcon';

type MakeStylesProps = { clickable: boolean };

const useStyles = makeStyles(({ rc }: Theme) => ({
  root: {
    cursor: ({ clickable }: MakeStylesProps) => (clickable ? 'pointer' : ''),

    ...rc?.MenuListItem?.root,

    '&:hover': {
      ...rc?.MenuListItem?.hover,
    },
  },

  title: {
    whiteSpace: 'nowrap',
    ...rc?.MenuListItem?.title?.root,
  },

  subtitle: {
    whiteSpace: 'nowrap',
    ...rc?.MenuListItem?.subtitle?.root,
  },
}));

export interface MenuListItemProps<V, I extends string | SvgSpriteIconProps<string>>
  extends FlexComponentProps,
    Pick<React.HTMLAttributes<HTMLDivElement>, keyof React.AriaAttributes | 'tabIndex' | 'role'> {
  icon?: I;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  shrinkTitle?: boolean;
  value: V;
  submenu?: boolean;
  checked?: boolean;
  onSelect?: (value: this['value'], event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: (value: this['value'], event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (value: this['value'], event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function MenuListItem<V, I extends string | SvgSpriteIconProps<string>>({
  icon,
  title,
  subtitle,
  value,
  submenu,
  checked,
  shrinkTitle = !subtitle && !!(checked || submenu),
  className,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: MenuListItemProps<V, I>): JSX.Element {
  const css = useStyles({ classes: { root: className }, clickable: !!onSelect });
  const { rc } = useTheme<Theme>();

  const clickHandler = useRefCallback<React.MouseEventHandler<HTMLDivElement>>((event) => {
    if (onSelect) {
      stopPropagation(event);
      onSelect(value, event);
    }
  });

  const mouseEnterHandler = useRefCallback<React.MouseEventHandler<HTMLDivElement>>(
    (event) => onMouseEnter && onMouseEnter(value, event)
  );

  const mouseLeaveHandler = useRefCallback<React.MouseEventHandler<HTMLDivElement>>(
    (event) => onMouseLeave && onMouseLeave(value, event)
  );

  const theme = rc?.MenuListItem;

  const iconProps =
    typeof icon === 'string' ? { name: icon, size: '1.5em' } : (icon as SvgSpriteIconProps<string>);

  const rootFlex =
    typeof theme?.flex === 'function' ? theme.flex({ hasIcon: !!iconProps }) : theme?.flex;

  const titleFlex =
    typeof theme?.title?.flex === 'function'
      ? theme.title.flex({ hasIcon: !!iconProps, shrinkTitle })
      : theme?.title?.flex;
  const subtitleFlex =
    typeof theme?.subtitle?.flex === 'function'
      ? theme.subtitle.flex({ shrinkTitle })
      : theme?.subtitle?.flex;

  const checkIconProps = checked ? theme?.checkIcon : undefined;
  const submenuIconProps = submenu ? theme?.submenuIcon : undefined;

  return (
    <Flex
      px
      py={iconProps ? 0.375 : 0.625}
      alignItems="center"
      {...rootFlex}
      className={css.root}
      onClick={clickHandler}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
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
