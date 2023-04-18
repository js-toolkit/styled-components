import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, type FlexComponentProps } from 'reflexy';
import type { Theme } from '../theme';
import { getBodyStyles } from './Body';

// type MakeStylesProps = Pick<FooterProps, >;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    ...getBodyStyles().root,
    borderTop: '1px solid var(--rc--divider-color, rgba(0, 0, 0, 0.1))',
    color: 'var(--rc--modal-footer-color, #2c7caf)',
    ...theme.rc?.Modal?.Footer,
  },
}));

export type FooterProps = FlexComponentProps<'div'>;

export default function Footer({
  p = 'l',
  className,
  ...rest
}: React.PropsWithChildren<FooterProps>): JSX.Element {
  const css = useStyles({ classes: { root: className } });
  return <Flex p={p} column className={css.root} {...rest} />;
}
