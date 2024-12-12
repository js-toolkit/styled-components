import React from 'react';
import styled from '@mui/system/styled';
import { Flex, type FlexComponentProps } from 'reflexy/styled';
import BadgeIcon from './BadgeIcon';

export interface BadgeProps extends FlexComponentProps {
  count?: React.ReactNode | undefined;
  loading?: boolean | undefined;
}

type CountIconProps = Pick<BadgeProps, 'loading' | 'count'>;

const CountIcon = styled(
  ({ count, ...rest }: CountIconProps) => <BadgeIcon {...rest}>{count}</BadgeIcon>,
  {
    shouldForwardProp: (key) => {
      const prop = key as keyof CountIconProps;
      return prop !== 'loading';
    },
  }
)(({ loading }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  transform: 'translate(50%, -50%)',
  zIndex: 1,
  animation: loading ? '$spin 1s infinite linear' : undefined,
}));

export default styled(function Badge({
  count,
  loading,
  children,
  ...rest
}: React.PropsWithChildren<BadgeProps>): React.JSX.Element {
  return (
    <Flex {...rest}>
      {children}
      {!!count && <CountIcon count={count} loading={loading} />}
    </Flex>
  );
})({ position: 'relative' });
