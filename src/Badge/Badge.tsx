import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, FlexComponentProps } from 'reflexy/styled';
import BadgeIcon from './BadgeIcon';

export interface BadgeProps extends FlexComponentProps {
  count?: React.ReactNode | undefined;
  loading?: boolean | undefined;
}

const useStyles = makeStyles({
  root: {
    position: 'relative',
  },

  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: 'translate(50%, -50%)',
    zIndex: 1,
    animation: ({ loading }: BadgeProps) => (loading ? '$spin 1s infinite linear' : undefined),
  },

  '@keyframes spin': {
    '0%': {
      transform: 'translate(50%, -50%) rotate(0deg)',
    },
    '100%': {
      transform: 'translate(50%, -50%) rotate(360deg)',
    },
  },
});

export default function Badge({
  count,
  loading,
  className,
  children,
  ...rest
}: React.PropsWithChildren<BadgeProps>): JSX.Element {
  const css = useStyles({ classes: { root: className }, loading } as any);

  return (
    <Flex className={css.root} {...rest}>
      {children}
      {!!count && <BadgeIcon className={css.icon}>{count}</BadgeIcon>}
    </Flex>
  );
}
