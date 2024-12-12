import React, { useCallback, useState, useRef, useMemo } from 'react';
import styled from '@mui/system/styled';
import { clsx } from 'clsx';
import { Flex, type FlexComponentProps } from 'reflexy/styled';
import type { WithFlexComponent } from 'reflexy/types';
import { OutsideClickListener, type OutsideClickListenerProps } from 'react-outside-click-listener';
import DropDownContext, { type DropDownContextValue } from './DropDownContext';

export interface DropDownProps
  extends Partial<Pick<OutsideClickListenerProps, 'onOutsideClick'>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Omit<FlexComponentProps<'div'>, keyof React.DOMAttributes<any>>,
    WithFlexComponent {
  expanded?: boolean | undefined;
  onToggle?: ((expanded: boolean) => void) | undefined;
  /** Works only for uncontrolled */
  onToggled?: ((expanded: boolean) => void) | undefined;
  expandedClassName?: string | undefined;
  hideOnOutsideClick?: boolean | undefined;
  /**
   * Whether set position `absolute` for DropDownBox.
   * Default `true`.
   */
  floating?: boolean | undefined;
}

export default styled(function DropDown({
  expanded,
  onToggle,
  onToggled,
  floating = true,
  hideOnOutsideClick = floating,
  className,
  expandedClassName,
  onOutsideClick,
  children,
  ...rest
}: React.PropsWithChildren<DropDownProps>): React.JSX.Element {
  const [isExpandedState, setExpandedState] = useState(!onToggle && !!expanded);

  const isExpanded = onToggle
    ? // If controlled
      !!expanded
    : // Not controlled
      isExpandedState;

  const isExpandedRef = useRef(false);
  isExpandedRef.current = isExpanded;

  const toggle = useCallback(
    (value?: boolean) => {
      const nextValue = typeof value === 'boolean' ? value : !isExpandedRef.current;
      if (nextValue === isExpandedRef.current) return;

      // If controlled
      if (onToggle) {
        onToggle(nextValue);
        return;
      }

      // If not controlled
      setExpandedState(nextValue);
      onToggled && onToggled(nextValue);
    },
    [onToggle, onToggled]
  );

  const contextValue = useMemo<DropDownContextValue>(
    () => ({ floating, expanded: isExpanded, toggle }),
    [floating, isExpanded, toggle]
  );

  const outsideClickHandler = useCallback<OutsideClickListenerProps['onOutsideClick']>(
    (event) => {
      if (onOutsideClick) {
        onOutsideClick(event);
        return;
      }
      toggle(false);
    },
    [onOutsideClick, toggle]
  );

  return (
    <DropDownContext.Provider value={contextValue}>
      <OutsideClickListener
        disabled={!hideOnOutsideClick || !isExpandedRef.current}
        onOutsideClick={outsideClickHandler}
      >
        <Flex
          column
          className={clsx(className, isExpandedRef.current && expandedClassName)}
          aria-expanded={isExpandedRef.current}
          data-dropdown=""
          {...rest}
        >
          {children}
        </Flex>
      </OutsideClickListener>
    </DropDownContext.Provider>
  );
})(({ theme: { rc } }) => ({
  position: 'relative',
  cursor: 'pointer',
  userSelect: 'none',
  ...rc?.DropDown?.root,
}));
