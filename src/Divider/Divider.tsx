import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Flex, FlexAllProps, DefaultComponentType } from 'reflexy/styled';
import type { Theme } from '../theme';

const useStyles = makeStyles((theme: Theme) => {
  const { light: lightTheme, ...defaultTheme } = theme.rc?.Divider ?? {};

  return {
    root: {
      "&[data-orientation='horizontal']": {
        height: '1px',
      },

      "&[data-orientation='vertical']": {
        width: '1px',
      },
    },

    default: {
      backgroundColor: 'var(--rc--divider-color, rgba(0, 0, 0, 0.1))',
      ...defaultTheme,
    },

    light: {
      backgroundColor: 'var(--rc--divider-color-light, rgba(255, 255, 255, 0.1))',
      ...lightTheme,
    },
  };
});

export type DividerProps<C extends React.ElementType = DefaultComponentType> = {
  light?: boolean;
} & FlexAllProps<C>;

export default function Divider<C extends React.ElementType = DefaultComponentType>({
  light,
  column,
  className,
  ...rest
}: DividerProps<C>): JSX.Element {
  const css = useStyles({ classes: { root: className } });

  return (
    <Flex
      column={column}
      shrink={0}
      className={`${css.root} ${light ? css.light : css.default}`}
      data-orientation={column ? 'vertical' : 'horizontal'}
      {...rest}
    />
  );
}
