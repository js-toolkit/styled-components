import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Flex, FlexAllProps, DefaultComponentType } from 'reflexy/styled';
import Theme from '../Theme';

const useStyles = makeStyles((theme: Theme) => {
  const { light: lightTheme, ...defaultTheme } = theme.rc?.Divider ?? {};

  return {
    root: ({ light }: Pick<DividerProps, 'light'>) => ({
      ...{
        "&[data-orientation='horizontal']": {
          height: '1px',
        },

        "&[data-orientation='vertical']": {
          width: '1px',
        },
      },

      backgroundColor: light
        ? 'var(--rc--divider-color-light, rgba(255, 255, 255, 0.1))'
        : 'var(--rc--divider-color, rgba(0, 0, 0, 0.1))',

      ...(light ? lightTheme : defaultTheme),
    }),
  };
});

export type DividerProps<C extends React.ElementType = DefaultComponentType> = {
  light?: boolean;
} & FlexAllProps<C, true>;

export default function Divider<C extends React.ElementType = DefaultComponentType>({
  light,
  column,
  className,
  ...rest
}: DividerProps<C>): JSX.Element {
  const css = useStyles({ classes: { root: className }, light });

  return (
    <Flex
      column={column}
      shrink={0}
      className={css.root}
      data-orientation={column ? 'vertical' : 'horizontal'}
      {...rest}
    />
  );
}
