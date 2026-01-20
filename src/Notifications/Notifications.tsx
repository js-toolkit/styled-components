/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from '@mui/system/styled';
import {
  Flex,
  type FlexAllProps,
  type DefaultComponentType,
  type FlexComponentProps,
} from 'reflexy/styled';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { clsx } from 'clsx';
import { useRefState } from '@js-toolkit/react-hooks/useRefState';
import type { TransitionComponent } from '../TransitionFlex';
import type { GetOverridedKeys } from '../types/local';
import type { CSSProperties } from '../theme';
import { excludeProp } from '../utils';
import NotificationBar, { type NotificationBarProps } from './NotificationBar';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
  TContent = React.JSX.Element | string,
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
    ...rc?.Notifications?.root,
    ...positionStyles,
    ...rc?.Notifications?.[position]?.root,
  };
});

type ScrollingContainerProps = Pick<RootProps, 'position'>;

const ScrollingContainer = styled(Flex<'div'>, {
  shouldForwardProp: excludeProp<keyof ScrollingContainerProps>(['position']),
})<ScrollingContainerProps>(({ theme: { rc }, position }) => ({
  // Enable only on NotificationBar
  pointerEvents: 'none',
  ...rc?.Notifications?.scrollingContainer,
  ...rc?.Notifications?.[position]?.scrollingContainer,
}));

const StyledNotificationBar = styled(NotificationBar, {
  shouldForwardProp: excludeProp<keyof ScrollingContainerProps>(['position']),
  label: 'NotificationBar',
})<ScrollingContainerProps>(({ theme: { rc }, position }) => ({
  pointerEvents: 'auto',
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
}: NotificationsProps<C, N>): React.JSX.Element | null {
  const [getMap, setMap] = useRefState<Map<NotificationPosition, React.JSX.Element[]>>();

  React.useEffect(() => {
    const map = new Map<NotificationPosition, React.JSX.Element[]>();

    list.forEach((n) => {
      const position = n.position ?? defaultPosition;
      const arr = map.get(position) ?? [];
      map.set(position, arr);

      const { timeout } = n;
      let timer = 0;
      const shownHandler =
        onTimeout && timeout && timeout > 0
          ? () => {
              timer = window.setTimeout(() => onTimeout(n.id as N['id']), timeout);
            }
          : undefined;
      const hiddenHandler = shownHandler && (() => window.clearTimeout(timer));

      arr.push(
        <StyledNotificationBar
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
          onShown={shownHandler}
          onHidden={hiddenHandler}
          {...n.rootProps}
        >
          {n.content}
        </StyledNotificationBar>
      );
    });

    setMap(map);
  }, [defaultAction, defaultPosition, list, onAction, onTimeout, setMap]);

  return Array.from(getMap()?.entries() ?? [], ([pos, arr]) => {
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
  }) as unknown as React.JSX.Element;
});
