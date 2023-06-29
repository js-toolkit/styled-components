import React, { useCallback } from 'react';
import type { FlexComponentProps } from 'reflexy/styled';
import Button from '../Button';
import CloseIcon from '../Modal/CloseIcon';
import type { NotificationBarProps } from './NotificationBar';

export interface NotificationCloseActionProps<T extends string | number>
  extends FlexComponentProps,
    Pick<NotificationBarProps<T>, 'id' | 'onAction'> {}

export default function NotificationCloseAction<T extends string | number>({
  id,
  onAction,
  children,
  ...rest
}: React.PropsWithChildren<NotificationCloseActionProps<T>>): JSX.Element {
  const clickHandler = useCallback(() => onAction && onAction(id), [id, onAction]);

  return (
    <Button color="none" size="contain" onClick={clickHandler} {...rest}>
      {children || <CloseIcon width="1.25em" height="1.25em" fill="currentColor" />}
    </Button>
  );
}
