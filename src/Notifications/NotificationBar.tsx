import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Flex, FlexComponentProps } from 'reflexy';
import clsx from 'clsx';
import type { Theme, CSSProperties } from '../theme';

export interface NotificationVariants {
  info: 'info';
  success: 'success';
  warning: 'warning';
  error: 'error';
}

export type NotificationVariant = NotificationVariants[keyof NotificationVariants];

export interface NotificationBarProps<T extends React.ReactText = React.ReactText>
  extends FlexComponentProps {
  readonly id: T;
  readonly variant?: NotificationVariant;
  readonly action?: (props: Pick<this, 'id' | 'variant' | 'onAction'>) => JSX.Element;
  readonly onAction?: (id: T) => void;
  // readonly onClose?: (id: T) => void;
  // readonly closeIcon?: React.ReactNode;
  readonly contentProps?: FlexComponentProps;
  readonly actionProps?: FlexComponentProps;
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

export default function NotificationBar<T extends React.ReactText = React.ReactText>({
  id,
  variant = 'info',
  action: Action,
  onAction,
  // onClose,
  // closeIcon,
  className,
  contentProps,
  actionProps,
  children,
  ...rest
}: React.PropsWithChildren<NotificationBarProps<T>>): JSX.Element {
  const css = useStyles({
    classes: { content: contentProps?.className, action: actionProps?.className },
    contentProps,
  });

  return (
    <Flex alignItems="center" className={clsx(css.root, css[variant], className)} {...rest}>
      <Flex grow {...contentProps} className={css.content}>
        {children}
      </Flex>
      {!!Action && (
        <Flex {...actionProps} className={css.action}>
          <Action id={id} variant={variant} onAction={onAction} />
        </Flex>
      )}
    </Flex>
  );
}
