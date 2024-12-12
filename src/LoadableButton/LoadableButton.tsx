import React from 'react';
import styled from '@mui/system/styled';
import { clsx } from 'clsx';
import LoadableFlex, {
  type LoadableFlexProps,
  type SpinnerPosition as LoadableSpinnerPosition,
} from '../LoadableFlex';
import Button, { type ButtonProps } from '../Button';
import type { CSSProperties } from '../theme';

export type SpinnerPosition = Extract<LoadableSpinnerPosition, 'right' | 'left' | 'center'>;

export type LoadableButtonProps<C extends React.ElementType = 'button'> = Omit<
  LoadableFlexProps<any>,
  'size' | 'color' | 'variant' | 'spinnerPosition' | 'spinnerSize'
> &
  ButtonProps<C> & { spinnerPosition?: SpinnerPosition | undefined };

const Root = styled(
  ({ loading, spinnerPosition, spinnerClassName, ...rest }: LoadableButtonProps) => (
    <LoadableFlex
      center
      shrink={false}
      component={Button}
      loading={loading}
      spinnerPosition={spinnerPosition}
      spinnerClassName={clsx(`${rest.className}__spinner`, spinnerClassName)}
      {...(rest as any)}
    />
  )
)(({ theme: { rc }, loading, spinnerPosition }) => ({
  ...rc?.LoadableButton?.root,

  // Space for spinner
  '&::after': {
    content: loading && spinnerPosition !== 'center' ? '""' : 'unset',
    width: '1.5em',
    ...(rc?.LoadableButton?.root?.['&::after'] as CSSProperties),
  },

  '&__spinner': {
    width: '1.5em',
    left: spinnerPosition === 'left' ? '0.75em' : undefined,
    right: spinnerPosition === 'right' ? '0.75em' : undefined,
    order: spinnerPosition === 'left' ? -1 : undefined,
    ...rc?.LoadableButton?.spinner,

    '& > svg': {
      left: spinnerPosition !== 'center' ? 0 : undefined,
      ...(rc?.LoadableButton?.spinner?.['& > svg'] as CSSProperties),
    },
  },
}));

export default function LoadableButton<C extends React.ElementType = 'button'>(
  props: LoadableButtonProps<C>
): React.JSX.Element {
  return <Root {...props} />;
}
