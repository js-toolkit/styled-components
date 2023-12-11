import React, { useContext } from 'react';
import styled from '@mui/system/styled';
import { clsx } from 'clsx';
import { Flex, type FlexAllProps, type DefaultComponentType } from 'reflexy/styled';
import DropDownContext from '../DropDownContext';
import ExpandIcon from './ExpandIcon';

export type DropDownLabelProps<C extends React.ElementType = DefaultComponentType> =
  React.PropsWithChildren<{
    toggleOnClick?: boolean | undefined;
    expandedClassName?: string | undefined;
    expandIcon?: boolean | React.ReactElement | undefined;
  }> &
    FlexAllProps<C>;

function DropDownLabel<C extends React.ElementType = DefaultComponentType>({
  toggleOnClick = true,
  expandIcon = true,
  expandedClassName,
  className,
  children,
  ...rest
}: DropDownLabelProps<C>): JSX.Element {
  const { expanded, toggle } = useContext(DropDownContext);

  return (
    <Flex
      shrink={false}
      alignItems="center"
      className={clsx(className, expanded && expandedClassName)}
      onClick={toggleOnClick ? toggle : undefined}
      aria-expanded={expanded}
      data-dropdown-label=""
      {...(rest as any)}
    >
      {children}

      {typeof expandIcon === 'boolean'
        ? expandIcon && <ExpandIcon expanded={expanded} />
        : expandIcon}
    </Flex>
  );
}

export default styled(DropDownLabel)(({ theme: { rc } }) => ({
  ...rc?.DropDownLabel?.root,
})) as typeof DropDownLabel;
