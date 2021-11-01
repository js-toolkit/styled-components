import React, { useContext } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, FlexAllProps, DefaultComponentType } from 'reflexy/styled';
import type { Theme } from '../../theme';
import DropDownContext from '../DropDownContext';
import ExpandIcon from './ExpandIcon';

export type DropDownLabelProps<C extends React.ElementType = DefaultComponentType> =
  React.PropsWithChildren<{
    toggleOnClick?: boolean;
    expandedClassName?: string;
    expandIcon?: boolean | React.ReactElement;
  }> &
    FlexAllProps<C>;

const useStyles = makeStyles((theme: Theme) => ({
  root: theme.rc?.DropDownLabel?.root ?? {},
}));

export default function DropDownLabel<C extends React.ElementType = DefaultComponentType>({
  toggleOnClick = true,
  expandIcon = true,
  expandedClassName,
  className,
  children,
  ...rest
}: DropDownLabelProps<C>): JSX.Element {
  const { expanded, toggle } = useContext(DropDownContext);
  const css = useStyles({
    classes: { root: `${className || ''} ${(expanded && expandedClassName) || ''}`.trim() },
  });

  return (
    <Flex
      shrink={false}
      alignItems="center"
      className={css.root}
      onClick={toggleOnClick ? toggle : undefined}
      aria-expanded={expanded}
      data-dropdown-label=""
      {...rest}
    >
      {children}

      {typeof expandIcon === 'boolean'
        ? expandIcon && <ExpandIcon expanded={expanded} />
        : expandIcon}
    </Flex>
  );
}
