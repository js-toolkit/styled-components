import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, type FlexComponentProps } from 'reflexy/styled';
import type { Theme } from '../theme';
import CloseIcon from './CloseIcon';

// type MakeStylesProps = Pick<HeaderProps, >;

const useStyles = makeStyles((theme: Theme) => {
  const { closeIcon: closeIconTheme, ...headerTheme } = theme.rc?.Modal?.Header ?? {};

  return {
    root: {
      position: 'relative',
      boxSizing: 'border-box',
      fontSize: '1.125em',
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit',
      borderBottom: '1px solid var(--rc--modal-footer-color, #2c7caf)',
      backgroundColor: 'var(--rc--modal-header-bg-color, #3488c3)',
      color: '#fff',

      ...headerTheme,
    },

    closeIcon: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '1.35em',
      height: '1.35em',
      boxSizing: 'content-box',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'scale 0.1s',

      '&:hover:not(:active)': {
        scale: 1.2,
      },

      ...closeIconTheme,
    },
  };
});

export interface HeaderProps extends FlexComponentProps<'div'> {
  readonly closeIcon?: boolean | React.ReactNode | undefined;
  readonly onCloseClick?: React.MouseEventHandler<SVGSVGElement> | undefined;
}

export default function Header({
  p = 'l',
  closeIcon,
  onCloseClick,
  className,
  children,
  ...rest
}: React.PropsWithChildren<HeaderProps>): JSX.Element {
  const css = useStyles({ classes: { root: className } });

  return (
    <Flex p={p} className={css.root} {...rest}>
      {children}
      {closeIcon === true && (
        <Flex p="s" component={CloseIcon} className={css.closeIcon} onClick={onCloseClick} />
      )}
      {closeIcon && closeIcon !== true && closeIcon}
    </Flex>
  );
}
