import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, FlexAllProps, DefaultComponentType } from 'reflexy';
import clsx from 'clsx';
import type { Theme } from '../theme';
import NotificationBar, { NotificationBarProps } from './NotificationBar';

const useStyles = makeStyles(({ rc }: Theme) => {
  const {
    root,
    static: staticPos,
    'sticky-top': stickyTop,
    'sticky-bottom': stickyBottom,
    top,
    bottom,
    'window-top': windowTop,
    'window-bottom': windowBottom,
  } = rc?.Notifications ?? {};

  return {
    fixedContainer: {
      position: 'fixed',
      left: 0,
      top: '-1px',
      width: '100%',
      height: 0,
      overflow: 'hidden',
      zIndex: 999,
    },

    absoluteContainer: {
      position: 'absolute',
      left: 0,
      width: '100%',
      height: 0,
      zIndex: 999,
    },

    root: {
      zIndex: 999,
      ...root,
    },

    static: {
      position: 'static',
      ...staticPos,
    },

    'sticky-top': {
      position: 'sticky',
      top: 0,
      ...stickyTop,
    },

    'sticky-bottom': {
      position: 'sticky',
      bottom: 0,
      ...stickyBottom,
    },

    top: {
      position: 'absolute',
      top: 0,
      // left: '50%',
      // transform: 'translateX(-50%)',
      ...top,
    },

    bottom: {
      position: 'absolute',
      bottom: 0,
      // left: '50%',
      // transform: 'translateX(-50%)',
      ...bottom,
    },

    'window-top': {
      position: 'fixed',
      top: '0.75rem',
      // width: '100%',
      ...windowTop,
    },

    'window-bottom': {
      position: 'fixed',
      bottom: '0.75rem',
      // width: '100%',
      ...windowBottom,
    },

    item: {
      marginTop: '0.375em',
      marginBottom: '0.375em',

      // '& + &': {
      //   marginTop: '0.375em',
      // },
    },
  };
});

export interface NotificationPositions {
  static: 'static';
  'sticky-top': 'sticky-top';
  'sticky-bottom': 'sticky-bottom';
  top: 'top';
  bottom: 'bottom';
  'window-top': 'window-top';
  'window-bottom': 'window-bottom';
}

export type NotificationPosition = keyof NotificationPositions;

export interface Notification<
  TID extends React.ReactText = React.ReactText,
  TContent = JSX.Element | string
> extends RequiredSome<
    Pick<NotificationBarProps<TID>, 'id' | 'variant' | 'contentProps' | 'actionProps'>,
    'variant'
  > {
  // readonly id: TID;
  // readonly type: NotificationVariant;
  readonly content: TContent;
  readonly position?: NotificationPosition;
  readonly noAction?: boolean;
  // readonly contentProps?: NotificationBarProps['contentProps'];
}

export type NotificationsProps<
  C extends React.ElementType = DefaultComponentType,
  N extends Notification<any, any> = Notification
> = FlexAllProps<C> & {
  readonly list: readonly N[];
  readonly defaultPosition?: NotificationPosition;
  readonly defaultAction?: NotificationBarProps<
    N extends Notification<infer TID> ? TID : React.ReactText
  >['action'];
  // readonly defaultCloseIcon?: NotificationBarProps['closeIcon'];
  readonly onAction?: NotificationBarProps<
    N extends Notification<infer TID> ? TID : React.ReactText
  >['onAction'];
};

export default function Notifications<
  C extends React.ElementType = DefaultComponentType,
  N extends Notification<any, any> = Notification
>({
  list,
  defaultPosition = 'window-top',
  defaultAction,
  onAction,
  // defaultCloseIcon,
  // onClose,
  className,
  ...rest
}: NotificationsProps<C, N>): JSX.Element | null {
  const css = useStyles();

  if (list.length === 0) return null;

  const items = list.reduce((acc, n) => {
    const position = n.position ?? defaultPosition;
    acc[position] = acc[position] ?? [];

    const bar = (
      <NotificationBar
        key={n.id}
        id={n.id}
        variant={n.variant}
        shrink={false}
        justifyContent="center"
        className={css.item}
        action={n.noAction ? undefined : defaultAction}
        onAction={n.noAction ? undefined : onAction}
        // closeIcon={defaultCloseIcon}
        contentProps={n.contentProps}
        actionProps={n.actionProps}
      >
        {n.content}
      </NotificationBar>
    );

    acc[position].push(bar);

    return acc;
  }, {} as Record<NotificationPosition, JSX.Element[]>);

  return (
    <>
      {(Object.getOwnPropertyNames(items) as (keyof typeof items)[]).map((pos) => {
        const rootClassName = clsx(css.root, css[pos], className);
        const root = (
          <Flex column className={rootClassName} {...rest}>
            {items[pos]}
          </Flex>
        );

        // It needs an extra container for correct positioning by center
        const containerClassName =
          (pos.indexOf('window') === 0 && css.fixedContainer) ||
          ((pos === 'top' || pos === 'bottom') && `${css.absoluteContainer} ${css[pos]}`) ||
          css[pos];

        return (
          <Flex key={pos} justifyContent="center" className={containerClassName}>
            {root}
          </Flex>
        );
      })}
    </>
  );
}
