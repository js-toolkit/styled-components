import React, { useMemo } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Flex, FlexComponentProps } from 'reflexy';
import clsx from 'clsx';
import type { Theme, CSSProperties } from '../theme';
import CloseIcon from '../Modal/CloseIcon';
import Button from '../Button';

type MakeStylesProps = Pick<NotificationBarProps, 'contentProps'>;

const useStyles = makeStyles(({ rc }: Theme) => {
  const { root, content, closeButton, info, success, warning, error, ...restTheme } =
    rc?.NotificationBar ?? {};

  // Build futured classes from theme
  const themeClasses = Object.getOwnPropertyNames(restTheme).reduce((acc, p) => {
    if (typeof restTheme[p] === 'object') {
      acc[p] = restTheme[p] as CSSProperties;
    }
    return acc;
  }, {} as Record<NotificationType, CSSProperties>);

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

    closeBtn: {
      boxSizing: 'content-box',
      marginLeft: '1em',
      color: 'inherit',
      ...closeButton,
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

export interface NotificationTypes {
  info: 'info';
  success: 'success';
  warning: 'warning';
  error: 'error';
}

export type NotificationType = keyof NotificationTypes;

export interface NotificationBarProps<T extends React.ReactText = React.ReactText>
  extends FlexComponentProps {
  readonly id: T;
  readonly type?: NotificationType;
  // readonly action?: (props: Pick<NotificationBarProps<T>, 'id' | 'type'>) => JSX.Element;
  readonly onClose?: (id: T) => void;
  readonly closeIcon?: string | React.ReactNode;
  readonly contentProps?: FlexComponentProps;
}

export default function NotificationBar<T extends React.ReactText = React.ReactText>({
  id,
  type = 'info',
  onClose,
  closeIcon,
  className,
  contentProps,
  children,
  ...rest
}: React.PropsWithChildren<NotificationBarProps<T>>): JSX.Element {
  const css = useStyles({ classes: { content: contentProps?.className }, contentProps });

  const closeClickHandler = useMemo(() => onClose && (() => onClose(id)), [id, onClose]);

  // const content =
  //   children && typeof children === 'object' ? (
  //     children
  //   ) : (
  //     <Flex grow className={css.content}>
  //       {children}
  //     </Flex>
  //   );

  return (
    <Flex alignItems="center" className={clsx(css.root, css[type], className)} {...rest}>
      <Flex grow {...contentProps} className={css.content}>
        {children}
      </Flex>

      {onClose && (
        <Button color="none" size="contain" onClick={closeClickHandler} className={css.closeBtn}>
          {closeIcon ?? <CloseIcon width="1.25em" height="1.25em" fill="currentColor" />}
        </Button>
      )}
    </Flex>
  );
}
