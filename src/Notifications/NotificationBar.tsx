/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, FlexAllProps, FlexComponentProps } from 'reflexy';
import clsx from 'clsx';
import TransitionFlex, { HideableProps } from '../TransitionFlex';
import type { Theme, CSSProperties } from '../theme';
import type { GetOverridedKeys } from '../types/local';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NotificationVariants {}

export type NotificationVariant = GetOverridedKeys<
  'info' | 'success' | 'warning' | 'error',
  NotificationVariants
>;

export interface NotificationBarProps<
  TId extends string | number = string | number,
  CT extends React.ElementType = any,
  AT extends React.ElementType = any
> extends FlexComponentProps<'div', { omitProps: true }>,
    HideableProps {
  readonly id: TId;
  readonly variant?: NotificationVariant;
  readonly action?: (props: Pick<this, 'id' | 'variant' | 'onAction'>) => JSX.Element;
  readonly onAction?: (id: TId) => void;
  readonly contentProps?: FlexAllProps<CT>;
  readonly actionProps?: FlexAllProps<AT>;
}

type MakeStylesProps = Pick<NotificationBarProps, 'contentProps'>;

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

    content: {
      userSelect: 'none',
      whiteSpace: 'pre-line',
      wordBreak: 'break-word',
      textAlign: ({
        contentProps: { column, alignItems, justifyContent, center } = {},
      }: MakeStylesProps) => {
        if (column) {
          if (alignItems === 'flex-end') return 'right';
          if (alignItems === 'center' || center) return 'center';
          return undefined;
        }
        // If row
        if (justifyContent === 'flex-end') return 'right';
        if (justifyContent === 'center' || center) return 'center';
        return undefined;
      },
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
  TId extends string | number = string | number,
  CT extends React.ElementType = any,
  AT extends React.ElementType = any
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
  ...rest
}: React.PropsWithChildren<NotificationBarProps<TId, CT, AT>>): JSX.Element {
  const css = useStyles({
    classes: { content: contentProps?.className, action: actionProps?.className },
    contentProps,
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
      className={clsx(css.root, css[variant], className)}
      {...rootRest}
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
      }}
    >
      <Flex grow {...(contentProps as FlexComponentProps)} className={css.content}>
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
