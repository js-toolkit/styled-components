/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import styled from '@mui/system/styled';
import { Flex, type FlexAllProps, type FlexComponentProps } from 'reflexy/styled';
import { clsx } from 'clsx';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import TransitionFlex, {
  type HideableProps,
  type TransitionComponent,
  type TransitionFlexProps,
} from '../TransitionFlex';
import type { GetOverridedKeys } from '../types/local';

export interface NotificationVariants {}

export type NotificationVariant = GetOverridedKeys<
  'info' | 'success' | 'warning' | 'error',
  NotificationVariants
>;

export interface NotificationBarProps<
  TID extends string | number = string | number,
  TContent extends React.ElementType = any,
  TAction extends React.ElementType = any,
  TTransition extends TransitionComponent = TransitionComponent,
> extends FlexComponentProps<'div', { omitProps: true }>,
    HideableProps<TTransition> {
  readonly id: TID;
  readonly variant?: NotificationVariant | undefined;
  readonly action?: ((props: Pick<this, 'id' | 'variant' | 'onAction'>) => JSX.Element) | undefined;
  readonly onAction?: ((id: TID) => void) | undefined;
  readonly contentProps?: FlexAllProps<TContent> | undefined;
  readonly actionProps?: FlexAllProps<TAction> | undefined;
  readonly applyClassesToTransition?: boolean | undefined;
  readonly onUnmount?: VoidFunction | undefined;
}

type RootProps = TransitionFlexProps &
  RequiredSome<Pick<NotificationBarProps, 'variant' | 'applyClassesToTransition'>, 'variant'>;

const Root = styled(
  ({ applyClassesToTransition, className, transitionProps, ...props }: RootProps) => (
    <TransitionFlex
      className={applyClassesToTransition ? undefined : className}
      transitionProps={{
        ...transitionProps,
        ...(applyClassesToTransition && {
          className: clsx(transitionProps?.className, className),
        }),
      }}
      {...props}
    />
  ),
  {
    shouldForwardProp: (key) => {
      const prop = key as keyof RootProps;
      return prop !== 'variant';
    },
  }
)(({ theme: { rc }, variant }) => ({
  boxSizing: 'border-box',
  padding: '0.75em 1.25em',
  borderRadius: '2px',
  ...rc?.NotificationBar?.root,

  ...(variant === 'info' && {
    backgroundColor: 'rgb(100, 200, 255)',
    color: 'rgb(0, 80, 100)',
  }),

  ...(variant === 'success' && {
    backgroundColor: 'rgb(120, 220, 125)',
    color: 'rgb(30, 90, 30)',
  }),

  ...(variant === 'warning' && {
    backgroundColor: 'rgb(255, 200, 50)',
    color: 'rgb(130, 80, 0)',
  }),

  ...(variant === 'error' && {
    backgroundColor: 'rgb(255, 100, 90)',
    color: 'rgb(125, 0, 0)',
  }),

  ...(variant && rc?.NotificationBar?.[variant]),
}));

const ContentContainer = styled(Flex)(({ theme: { rc }, ...props }) => ({
  userSelect: 'none',
  whiteSpace: 'pre-line',
  wordBreak: 'break-word',
  texAlign:
    (((props.column && props.alignItems === 'flex-end') ||
      (!props.column && props.justifyContent === 'flex-end')) &&
      'right') ||
    ((props.center ||
      (props.column && props.alignItems === 'center') ||
      (!props.column && props.justifyContent === 'center')) &&
      'center') ||
    undefined,
  ...rc?.NotificationBar?.content,
}));

const ActionContainer = styled(Flex)(({ theme: { rc } }) => ({
  marginLeft: '1em',
  ...rc?.NotificationBar?.action,
}));

export default function NotificationBar<
  TID extends string | number = string | number,
  TContent extends React.ElementType = any,
  TAction extends React.ElementType = any,
  TTransition extends TransitionComponent = TransitionComponent,
>({
  id,
  variant = 'info',
  action: Action,
  onAction,
  contentProps,
  actionProps,
  children,
  onUnmount,
  ...rest
}: React.PropsWithChildren<
  NotificationBarProps<TID, TContent, TAction, TTransition>
>): JSX.Element {
  const onUnmountRef = useRefCallback(() => onUnmount && onUnmount());
  useEffect(() => onUnmountRef, [onUnmountRef]);

  return (
    <Root variant={variant} alignItems="center" {...(rest as TransitionFlexProps)}>
      <ContentContainer grow {...(contentProps as FlexComponentProps)}>
        {children}
      </ContentContainer>

      {!!Action && (
        <ActionContainer shrink={0} {...(actionProps as FlexComponentProps)}>
          <Action id={id} variant={variant} onAction={onAction} />
        </ActionContainer>
      )}
    </Root>
  );
}
