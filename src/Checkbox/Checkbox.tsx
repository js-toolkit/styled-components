import React, { useCallback, useState, useRef, useContext } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Flex, FlexComponentProps } from 'reflexy/styled';
import type { Theme } from '../theme';
import CheckboxContext, { CheckboxContextValue } from './CheckboxContext';

export type CheckboxType = 'checkbox' | 'radio' | 'switch';

export interface CheckboxProps<V = any> extends Omit<FlexComponentProps<'div'>, 'onChange'> {
  type?: CheckboxType;
  onChange?: (checked: boolean) => void;
  checked?: boolean;
  disabled?: boolean;
  /** Used with CheckboxGroup */
  value?: V;
}

const useStyles = makeStyles((theme: Theme) => {
  const checkboxTheme = theme.rc?.Checkbox ?? {};

  const shapeSize = checkboxTheme.shape?.width || checkboxTheme.shape?.height || '1em';

  const checkedColor =
    checkboxTheme.colors?.checked || 'var(--rc--checkbox-checked-color, rgb(92, 184, 92))';
  const uncheckedColor =
    checkboxTheme.colors?.unchecked || 'var(--rc--checkbox-unchecked-color, rgb(195, 205, 205))';
  const hoverColor =
    checkboxTheme.colors?.hover || 'var(--rc--checkbox-hover-color, rgba(92, 184, 92, 0.5))';
  const emptyColor = checkboxTheme.colors?.empty || 'var(--rc--area-bg-color, #f4f7f8)';

  const switchDuration = checkboxTheme.switch?.duration || '0.2s';
  const switchIndent = checkboxTheme.switch?.indent || '2px';

  return {
    root: {
      position: 'relative',
      cursor: 'pointer',
      lineHeight: 1,
      ...checkboxTheme.root,

      "&[aria-disabled='true']": {
        opacity: 'var(--rc--disabled-opacity, 0.5)',
        pointerEvents: 'none',
        ...checkboxTheme.disabled,
      },

      '&::before': {
        content: '""',
        width: shapeSize,
        height: shapeSize,
        border: `1px solid ${uncheckedColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...checkboxTheme.shape,
      },

      '&:not(:empty)::before': {
        marginRight: `calc(${shapeSize} / 2)`,
        ...checkboxTheme.root?.['&:not(:empty)::before'],
      },

      '&:hover::before': checkboxTheme.shape?.['&:hover'],

      // Checkbox
      "&[role='checkbox']": {
        ...checkboxTheme.checkbox?.root,

        '&::before': checkboxTheme.checkbox?.shape,

        '&:hover::before': checkboxTheme.checkbox?.shape?.['&:hover'],

        "&[aria-checked='true']": {
          ...checkboxTheme.checkbox?.checked?.root,

          '&::before': {
            content: '"\u2714"',
            color: checkedColor,
            ...checkboxTheme.checkbox?.checked?.shape,
          },
        },
      },

      // Radio
      "&[role='radio']": {
        ...checkboxTheme.radio?.root,

        '&::before': {
          borderRadius: '100%',
          ...checkboxTheme.radio?.shape,
        },

        '&:hover::before': {
          borderColor: hoverColor,
          background: `radial-gradient(ellipse at center, ${hoverColor} 0, ${hoverColor} 50%, ${emptyColor} 60%, ${emptyColor} 100%)`,
          ...checkboxTheme.radio?.shape?.['&:hover'],
        },

        "&[aria-checked='true']": {
          ...checkboxTheme.radio?.checked?.root,

          '&::before': {
            borderColor: checkedColor,
            background: `radial-gradient(ellipse at center, ${checkedColor} 0, ${checkedColor} 50%, ${emptyColor} 60%, ${emptyColor} 100%)`,
            ...checkboxTheme.radio?.checked?.shape,
          },
        },
      },

      // Switch
      "&[role='switch']": {
        userSelect: 'none',
        minWidth: `calc((${shapeSize} * 2) + (${switchIndent} * 2))`,
        height: `calc(${shapeSize} + (${switchIndent} * 2))`,
        borderRadius: shapeSize,
        background: uncheckedColor,
        transition: `background-color ${switchDuration}`,
        ...checkboxTheme.switch?.root,

        '&::before': {
          position: 'absolute',
          border: 'none',
          borderRadius: '100%',
          background: emptyColor,
          transition: `margin-left ${switchDuration}`,
          marginLeft: switchIndent,
          ...checkboxTheme.switch?.shape,
        },

        '&:hover::before': checkboxTheme.switch?.shape?.['&:hover'],

        "&[aria-checked='true']": {
          background: checkedColor,
          ...checkboxTheme.switch?.checked?.root,

          '&::before': {
            marginLeft: `calc(100% - ${shapeSize} - ${switchIndent})`,
            ...checkboxTheme.switch?.checked?.shape,
          },
        },
      },
    },
  };
});

export default function Checkbox<V = any>({
  type = 'checkbox',
  onChange,
  checked,
  disabled,
  value,
  className,
  ...rest
}: React.PropsWithChildren<CheckboxProps<V>>): JSX.Element {
  const css = useStyles({ classes: { root: className } });
  const { checkedValue, onChecked } = useContext<CheckboxContextValue<V>>(CheckboxContext);
  const [isChecked, setChecked] = useState(!!checked);

  const isCheckedRef = useRef(false);

  // If controlled
  if (onChange) {
    isCheckedRef.current = !!checked;
  }
  // If controlled by CheckboxGroup
  else if (onChecked) {
    isCheckedRef.current =
      value !== undefined && checkedValue !== undefined && checkedValue === value;
  }
  // Not controlled
  else {
    isCheckedRef.current = isChecked;
  }

  const toggle = useCallback(() => {
    // We can't uncheck radio
    if (type === 'radio' && isCheckedRef.current) {
      return;
    }

    // If controlled by CheckboxGroup
    if (onChecked && !isCheckedRef.current) {
      value !== undefined && onChecked(value);
      return;
    }

    // If controlled
    if (onChange) {
      onChange(!isCheckedRef.current);
      return;
    }

    // If not controlled
    setChecked(!isCheckedRef.current);
  }, [onChecked, onChange, type, value]);

  return (
    <Flex
      row
      alignItems="center"
      role={type}
      aria-checked={isCheckedRef.current || undefined}
      aria-disabled={disabled || undefined}
      onClick={toggle}
      className={css.root}
      {...rest}
    />
  );
}
