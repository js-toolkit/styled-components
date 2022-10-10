import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, FlexAllProps, DefaultComponentType } from 'reflexy';
import clsx from 'clsx';
import type { Theme } from '../theme';
import type { GetOverridedKeys } from '../types/local';
import NotificationBar, { NotificationBarProps } from './NotificationBar';

const useStyles = makeStyles(({ rc }: Theme) => {
  const {
    root,
    static: staticPos,
    'sticky-top': stickyTop,
    'sticky-bottom': stickyBottom,
    top,
    bottom,
    'left-top': leftTop,
    'left-middle': leftMiddle,
    'left-bottom': leftBottom,
    'right-top': rightTop,
    'right-middle': rightMiddle,
    'right-bottom': rightBottom,
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

    'left-top': {
      position: 'absolute',
      left: 0,
      top: 0,
      ...leftTop,
    },

    'left-middle': {
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      ...leftMiddle,
    },

    'left-bottom': {
      position: 'absolute',
      left: 0,
      bottom: 0,
      ...leftBottom,
    },

    'right-top': {
      position: 'absolute',
      right: 0,
      top: 0,
      ...rightTop,
    },

    'right-middle': {
      position: 'absolute',
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      ...rightMiddle,
    },

    'right-bottom': {
      position: 'absolute',
      right: 0,
      bottom: 0,
      ...rightBottom,
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
  static: true;
  'sticky-top': true;
  'sticky-bottom': true;
  top: true;
  bottom: true;
  'left-top': true;
  'left-middle': true;
  'left-bottom': true;
  'right-top': true;
  'right-middle': true;
  'right-bottom': true;
  'window-top': true;
  'window-bottom': true;
}

export type NotificationPosition = GetOverridedKeys<never, NotificationPositions>;

export interface Notification<
  TID extends React.ReactText = React.ReactText,
  TContent = JSX.Element | string
> extends RequiredSome<
    Pick<NotificationBarProps<TID>, 'id' | 'variant' | 'contentProps' | 'actionProps'>,
    'variant'
  > {
  readonly content: TContent;
  readonly position?: NotificationPosition;
  readonly noAction?: boolean;
  readonly rootProps?: NotificationBarProps['contentProps'];
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

export default React.memo(function Notifications<
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
        {...n.rootProps}
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
          (pos.startsWith('window') && css.fixedContainer) ||
          ((pos === 'top' ||
            pos === 'bottom' ||
            pos.startsWith('left') ||
            pos.startsWith('right')) &&
            `${css.absoluteContainer} ${css[pos]}`) ||
          css[pos];

        return (
          <Flex key={pos} justifyContent="center" className={containerClassName}>
            {root}
          </Flex>
        );
      })}
    </>
  );
});
