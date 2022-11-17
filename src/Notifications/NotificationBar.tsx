/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, FlexAllProps, FlexComponentProps } from 'reflexy';
import clsx from 'clsx';
import TransitionFlex, { HideableProps, TransitionComponent } from '../TransitionFlex';
import type { Theme, CSSProperties } from '../theme';
import type { GetOverridedKeys } from '../types/local';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NotificationVariants {}

export type NotificationVariant = GetOverridedKeys<
  'info' | 'success' | 'warning' | 'error',
  NotificationVariants
>;

export interface NotificationBarProps<
  TID extends string | number = string | number,
  TContent extends React.ElementType = any,
  TAction extends React.ElementType = any,
  TTransition extends TransitionComponent = TransitionComponent
> extends FlexComponentProps<'div', { omitProps: true }>,
    HideableProps<TTransition> {
  readonly id: TID;
  readonly variant?: NotificationVariant;
  readonly action?: (props: Pick<this, 'id' | 'variant' | 'onAction'>) => JSX.Element;
  readonly onAction?: (id: TID) => void;
  readonly contentProps?: FlexAllProps<TContent>;
  readonly actionProps?: FlexAllProps<TAction>;
  readonly applyClassesToTransition?: boolean;
}

const useStyles = makeStyles(({ rc }: Theme) => {
  const { root, content, action, info, success, warning, error, ...restTheme } =
    rc?.NotificationBar ?? {};

  // Build futured classes from theme
  const themeClasses = Object.getOwnPropertyNames(restTheme).reduce((acc, p) => {
    if (typeof restTheme[p] === 'object') {
      acc[p] = restTheme[p] as CSSProperties;
    }
    return acc;
  }, {} as Record<NotificationVariant, CSSProperties>);

  return {
    root: {
      boxSizing: 'border-box',
      padding: '0.75em 1.25em',
      borderRadius: '2px',
      ...root,
    },

    textRight: {
      textAlign: 'right',
    },

    textCenter: {
      textAlign: 'center',
    },

    content: {
      userSelect: 'none',
      whiteSpace: 'pre-line',
      wordBreak: 'break-word',
      ...content,
    },

    action: {
      marginLeft: '1em',
      ...action,
    },

    ...themeClasses,

    info: {
      backgroundColor: 'rgb(100, 200, 255)',
      color: 'rgb(0, 80, 100)',
      ...info,
    },

    success: {
      backgroundColor: 'rgb(120, 220, 125)',
      color: 'rgb(30, 90, 30)',
      ...success,
    },

    warning: {
      backgroundColor: 'rgb(255, 200, 50)',
      color: 'rgb(130, 80, 0)',
      ...warning,
    },

    error: {
      backgroundColor: 'rgb(255, 100, 90)',
      color: 'rgb(125, 0, 0)',
      ...error,
    },
  };
});

export default function NotificationBar<
  TID extends string | number = string | number,
  TContent extends React.ElementType = any,
  TAction extends React.ElementType = any,
  TTransition extends TransitionComponent = TransitionComponent
>({
  id,
  variant = 'info',
  action: Action,
  onAction,
  className,
  contentProps,
  actionProps,
  children,
  transitionProps,
  applyClassesToTransition,
  ...rest
}: React.PropsWithChildren<
  NotificationBarProps<TID, TContent, TAction, TTransition>
>): JSX.Element {
  const css = useStyles({
    classes: { content: contentProps?.className, action: actionProps?.className },
  });

  // In case if NotificationBar inside TransitionGroup
  const {
    appear,
    in: inProp,
    enter,
    exit,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
    ...rootRest
  } = rest as NonNullable<HideableProps['transitionProps']>;

  return (
    <TransitionFlex
      alignItems="center"
      className={applyClassesToTransition ? undefined : clsx(css.root, css[variant], className)}
      transitionProps={{
        appear,
        in: inProp,
        enter,
        exit,
        onEnter,
        onEntering,
        onEntered,
        onExit,
        onExiting,
        onExited,
        ...transitionProps,
        ...(applyClassesToTransition && {
          className: clsx(
            css.root,
            css[variant],
            (transitionProps as HideableProps['transitionProps'])?.className,
            className
          ),
        }),
      }}
      {...rootRest}
    >
      <Flex
        grow
        {...(contentProps as FlexComponentProps)}
        className={
          contentProps
            ? clsx(
                ((contentProps.column && contentProps.alignItems === 'flex-end') ||
                  (!contentProps.column && contentProps.justifyContent === 'flex-end')) &&
                  css.textRight,
                (contentProps.center ||
                  (contentProps.column && contentProps.alignItems === 'center') ||
                  (!contentProps.column && contentProps.justifyContent === 'center')) &&
                  css.textCenter,
                css.content
              )
            : css.content
        }
      >
        {children}
      </Flex>
      {!!Action && (
        <Flex {...(actionProps as FlexComponentProps)} className={css.action}>
          <Action id={id} variant={variant} onAction={onAction} />
        </Flex>
      )}
    </TransitionFlex>
  );
}
