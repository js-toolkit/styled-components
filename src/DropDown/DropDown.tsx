import React, { useCallback, useState, useRef, useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import type { FlexComponentProps } from 'reflexy/styled';
import FlexWithRef from 'reflexy/FlexWithRef';
import { OutsideClickListener, OutsideClickListenerProps } from 'react-outside-click-listener';
import type { Theme } from '../theme';
import DropDownContext, { DropDownContextValue } from './DropDownContext';

export interface DropDownProps
  extends Partial<Pick<OutsideClickListenerProps, 'onOutsideClick'>>,
    Omit<FlexComponentProps<'div'>, keyof React.DOMAttributes<any>> {
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

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
    cursor: 'pointer',
    userSelect: 'none',
    ...theme.rc?.DropDown?.root,
  },
}));

export default function DropDown({
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
}: React.PropsWithChildren<DropDownProps>): JSX.Element {
  const [isExpandedState, setExpandedState] = useState(!onToggle && !!expanded);

  const isExpanded = onToggle
    ? // If controlled
      !!expanded
    : // Not controlled
      isExpandedState;

  const isExpandedRef = useRef(false);
  isExpandedRef.current = isExpanded;

  const toggle = useCallback(
    (value?: boolean | undefined) => {
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

  const css = useStyles({
    classes: {
      root: `${className || ''} ${(isExpandedRef.current && expandedClassName) || ''}`.trim(),
    },
  });

  return (
    <DropDownContext.Provider value={contextValue}>
      <OutsideClickListener
        disabled={!hideOnOutsideClick || !isExpandedRef.current}
        onOutsideClick={outsideClickHandler}
      >
        <FlexWithRef
          component="div"
          column
          className={css.root}
          aria-expanded={isExpandedRef.current}
          data-dropdown=""
          {...rest}
        >
          {children}
        </FlexWithRef>
      </OutsideClickListener>
    </DropDownContext.Provider>
  );
}
