/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import styled from '@mui/system/styled';
import {
  Flex,
  type FlexAllProps,
  type DefaultComponentType,
  type FlexComponentProps,
} from 'reflexy/styled';
import ForwardRef from 'reflexy/ForwardRef';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { clsx } from 'clsx';
import { clear } from '@js-toolkit/utils/clear';
import useUpdate from '@js-toolkit/react-hooks/useUpdate';
import type { TransitionComponent } from '../TransitionFlex';
import type { GetOverridedKeys } from '../types/local';
import type { CSSProperties } from '../theme';
import { excludeProp } from '../utils';
import NotificationBar, { type NotificationBarProps } from './NotificationBar';

export interface NotificationPositions {}

export type NotificationPosition = GetOverridedKeys<
  | 'static'
  | 'sticky-top'
  | 'sticky-bottom'
  | 'top'
  | 'bottom'
  | 'left-top'
  | 'left-middle'
  | 'left-bottom'
  | 'right-top'
  | 'right-middle'
  | 'right-bottom'
  | 'window-top'
  | 'window-bottom',
  NotificationPositions
>;

export interface Notification<
  TID extends string | number = string | number,
  TContent = JSX.Element | string,
  TTransition extends TransitionComponent = TransitionComponent,
  // TRoot extends React.ElementType = any,
  TBarContentElement extends React.ElementType = any,
  TBarActionElement extends React.ElementType = any,
> extends RequiredSome<
    Pick<
      NotificationBarProps<TID, TBarContentElement, TBarActionElement, TTransition>,
      'id' | 'variant' | 'contentProps' | 'actionProps'
    >,
    'variant'
  > {
  readonly content: TContent;
  readonly position?: NotificationPosition | undefined;
  readonly noAction?: boolean | undefined;
  // readonly rootProps?: TransitionFlexProps<TTransition, TRoot>;
  readonly rootProps?:
    | OmitStrict<
        NotificationBarProps<TID, TBarContentElement, TBarActionElement, TTransition>,
        'id' | 'variant' | 'contentProps' | 'actionProps'
      >
    | undefined;
  readonly timeout?: number | undefined;
}

export type NotificationsProps<
  C extends React.ElementType,
  N extends Notification<any, any, any, any, any>,
> = FlexAllProps<C> & {
  readonly list: readonly N[];
  readonly defaultPosition?: NotificationPosition | undefined;
  readonly defaultAction?:
    | NotificationBarProps<
        N extends Notification<infer TID, any, any, any, any> ? TID : string | number
      >['action']
    | undefined;
  readonly onAction?:
    | NotificationBarProps<
        N extends Notification<infer TID, any, any, any, any> ? TID : string | number
      >['onAction']
    | undefined;
  readonly onTimeout?:
    | ((id: N extends Notification<infer TID, any, any, any, any> ? TID : string | number) => void)
    | undefined;
  readonly containerProps?: FlexComponentProps<'div', { omitProps: true }> | undefined;
  readonly listProps?: FlexComponentProps<'div', { omitProps: true }> | undefined;
  readonly disableTransition?: boolean;
};

// These styles take precedence over NotificationBar styles because makeStyles is called later.

type RootProps = React.PropsWithChildren<
  FlexComponentProps &
    Pick<NotificationsProps<any, any>, 'containerProps'> & {
      variant: 'absolute' | 'fixed' | undefined;
      position: NotificationPosition;
    }
>;

const Root = styled(
  ({ className, containerProps, ...rest }: RootProps) => (
    // Extra container for correct positioning by center
    <Flex
      justifyContent="center"
      {...containerProps}
      className={clsx(`${className}__container`, containerProps?.className)}
    >
      <Flex column className={className} {...rest} />
    </Flex>
  ),
  {
    shouldForwardProp: (key) => {
      const prop = key as keyof RootProps;
      return prop !== 'variant' && prop !== 'position';
    },
  }
)(({ theme: { rc }, variant, position }) => {
  const positionStyles: CSSProperties = {
    ...(position === 'static' && {
      position: 'static',
    }),
    ...(position === 'sticky-top' && {
      position: 'sticky',
      top: 0,
    }),
    ...(position === 'sticky-bottom' && {
      position: 'sticky',
      bottom: 0,
    }),
    ...(position === 'top' && {
      position: 'absolute',
      top: 0,
      // left: '50%',
      // transform: 'translateX(-50%)',
    }),
    ...(position === 'bottom' && {
      position: 'absolute',
      bottom: 0,
      // left: '50%',
      // transform: 'translateX(-50%)',
    }),
    ...(position === 'left-top' && {
      position: 'absolute',
      left: 0,
      top: 0,
    }),
    ...(position === 'left-middle' && {
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
    }),
    ...(position === 'left-bottom' && {
      position: 'absolute',
      left: 0,
      bottom: 0,
    }),
    ...(position === 'right-top' && {
      position: 'absolute',
      right: 0,
      top: 0,
    }),
    ...(position === 'right-middle' && {
      position: 'absolute',
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
    }),
    ...(position === 'right-bottom' && {
      position: 'absolute',
      right: 0,
      bottom: 0,
    }),
    ...(position === 'window-top' && {
      position: 'fixed',
      top: '0.75rem',
      // width: '100%',
    }),
    ...(position === 'window-bottom' && {
      position: 'fixed',
      bottom: '0.75rem',
      // width: '100%',
    }),
  };

  return {
    '&__container': {
      ...(variant === 'fixed' && {
        position: 'fixed',
        left: 0,
        top: '-1px',
        width: '100%',
        height: 0,
        overflow: 'hidden',
      }),

      ...(variant === 'absolute' && {
        position: 'absolute',
        left: 0,
        width: '100%',
        height: 0,
      }),

      zIndex: 999,
      ...rc?.Notifications?.rootContainer,
      ...positionStyles,
      ...rc?.Notifications?.[position]?.rootContainer,
    },

    zIndex: 'inherit',
    // Enable only on NotificationBar
    pointerEvents: 'none',
    ...rc?.Notifications?.root,
    ...positionStyles,
    ...rc?.Notifications?.[position]?.root,
  };
});

type ScrollingContainerProps = Pick<RootProps, 'position'>;

const ScrollingContainer = styled(Flex, {
  shouldForwardProp: excludeProp<keyof ScrollingContainerProps>(['position']),
})<ScrollingContainerProps>(({ theme: { rc }, position }) => ({
  ...rc?.Notifications?.scrollingContainer,
  ...rc?.Notifications?.[position]?.scrollingContainer,
}));

const StyledNotificationBar = styled(NotificationBar, {
  shouldForwardProp: excludeProp<keyof ScrollingContainerProps>(['position']),
  label: 'NotificationBar',
})<ScrollingContainerProps>(({ theme: { rc }, position }) => ({
  pointerEvents: 'initial',
  ...rc?.Notifications?.item,
  ...rc?.Notifications?.[position]?.item,
  '& + [class$=-NotificationBar]': {
    marginTop: '0.75em',
    ...rc?.Notifications?.itemSpace,
    ...rc?.Notifications?.[position]?.itemSpace,
  },
}));

export default React.memo(function Notifications<
  C extends React.ElementType = DefaultComponentType,
  N extends Notification<any, any, any, any, any> = Notification,
>({
  list,
  defaultPosition = 'window-top',
  defaultAction,
  onAction,
  onTimeout,
  listProps,
  disableTransition,
  ...rest
}: NotificationsProps<C, N>): JSX.Element | null {
  const update = useUpdate();

  // if (list.length === 0) return null;
  const mapRef = useRef(undefined as unknown as Map<NotificationPosition, JSX.Element[]>);
  if (!mapRef.current) {
    mapRef.current = new Map();
  }

  useEffect(() => {
    const map = mapRef.current;
    map.forEach(clear);

    list.forEach((n) => {
      const position = n.position ?? defaultPosition;
      const arr = map.get(position) ?? [];
      map.set(position, arr);

      const { timeout } = n;
      let timer = 0;
      const onShown =
        onTimeout && timeout && timeout > 0
          ? () => {
              timer = window.setTimeout(() => onTimeout(n.id as N['id']), timeout);
            }
          : undefined;
      const onUnmount = onShown && (() => window.clearTimeout(timer));

      arr.push(
        <ForwardRef
          component={StyledNotificationBar}
          key={n.id} // eslint-disable-line @typescript-eslint/no-unsafe-assignment
          id={n.id} // eslint-disable-line @typescript-eslint/no-unsafe-assignment
          position={position}
          variant={n.variant}
          shrink={false}
          justifyContent="center"
          // mt={map[position].length > 0 ? 0.75 : undefined}
          action={n.noAction ? undefined : (defaultAction as NotificationBarProps['action'])}
          onAction={n.noAction ? undefined : (onAction as NotificationBarProps['onAction'])}
          contentProps={n.contentProps}
          actionProps={n.actionProps}
          onShown={onShown}
          onUnmount={onUnmount}
          {...(n.rootProps as FlexComponentProps)}
        >
          {n.content}
        </ForwardRef>
      );
    });

    update();
  }, [defaultAction, defaultPosition, list, onAction, onTimeout, update]);

  return Array.from(mapRef.current.entries(), ([pos, arr]) => {
    const variant: RootProps['variant'] =
      (pos.startsWith('window') && 'fixed') ||
      ((pos === 'top' || pos === 'bottom' || pos.startsWith('left') || pos.startsWith('right')) &&
        'absolute') ||
      undefined;

    return (
      <Root key={pos} variant={variant} position={pos} {...rest}>
        {/* Extra container for scrolling */}
        <ScrollingContainer
          position={pos}
          column
          alignItems={
            (pos.startsWith('left') && 'flex-start') ||
            (pos.startsWith('right') && 'flex-end') ||
            undefined
          }
          {...listProps}
        >
          <TransitionGroup
            component={null}
            {...(disableTransition && { appear: false, enter: false, exit: false })}
          >
            {arr}
          </TransitionGroup>
        </ScrollingContainer>
      </Root>
    );
  }) as unknown as JSX.Element;
});
