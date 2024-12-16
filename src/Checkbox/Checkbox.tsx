import React from 'react';
import styled from '@mui/system/styled';
import { Flex, type FlexComponentProps } from 'reflexy/styled';
import CheckboxContext from './CheckboxContext';

export type CheckboxType = 'checkbox' | 'radio' | 'switch';

export interface CheckboxProps<V = unknown> extends Omit<FlexComponentProps<'div'>, 'onChange'> {
  type?: CheckboxType | undefined;
  onChange?: ((checked: boolean) => void) | undefined;
  checked?: boolean | undefined;
  disabled?: boolean | undefined;
  /** Used with CheckboxGroup */
  value?: V | undefined;
}

const Root = styled(Flex)(({ theme: { rc } }) => {
  const theme = rc?.Checkbox ?? {};

  const defaultShapeSize = theme.shape?.width || theme.shape?.height || '1em';

  const checkedColor =
    theme.colors?.checked || 'var(--rc--checkbox-checked-color, rgb(92, 184, 92))';
  const uncheckedColor =
    theme.colors?.unchecked || 'var(--rc--checkbox-unchecked-color, rgb(195, 205, 205))';
  const hoverColor =
    theme.colors?.hover || 'var(--rc--checkbox-hover-color, rgba(92, 184, 92, 0.5))';
  const emptyColor = theme.colors?.empty || 'var(--rc--area-bg-color, #f4f7f8)';

  const switchDuration = theme.switch?.duration || '0.2s';
  const switchIndent = theme.switch?.indent || '2px';
  const switchIndentAbs = switchIndent.startsWith('-') ? switchIndent.substring(1) : switchIndent;
  const switchShapeSize =
    theme.switch?.shape?.width || theme.switch?.shape?.height || defaultShapeSize;

  return {
    position: 'relative',
    cursor: 'pointer',
    lineHeight: 1,
    ...theme.root,

    "&[aria-disabled='true']": {
      opacity: 'var(--rc--disabled-opacity, 0.5)',
      pointerEvents: 'none',
      ...theme.disabled,
    },

    '&::before': {
      content: '""',
      width: defaultShapeSize,
      height: defaultShapeSize,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shape,
    },

    // '&:not(:empty)::before': {
    //   marginRight: `calc(${shapeSize} / 2)`,
    //   ...checkboxTheme.root?.['&:not(:empty)::before'],
    // },

    // Checkbox
    "&[role='checkbox']": {
      ...theme.checkbox?.root,

      '&::before': {
        border: `1px solid ${uncheckedColor}`,
        ...theme.checkbox?.shape,
      },

      "&[aria-checked='true']": {
        ...theme.checkbox?.checked?.root,

        '&::before': {
          content: '"\u2714"',
          color: checkedColor,
          ...theme.checkbox?.checked?.shape,
        },
      },
    },

    // Radio
    "&[role='radio']": {
      ...theme.radio?.root,

      '&::before': {
        border: `1px solid ${uncheckedColor}`,
        borderRadius: '100%',
        ...theme.radio?.shape,
      },

      "&[aria-checked='true']": {
        ...theme.radio?.checked?.root,

        '&::before': {
          borderColor: checkedColor,
          backgroundColor: `radial-gradient(ellipse at center, ${checkedColor} 0, ${checkedColor} 50%, ${emptyColor} 60%, ${emptyColor} 100%)`,
          ...theme.radio?.checked?.shape,
        },
      },
    },

    // Switch
    "&[role='switch']": {
      userSelect: 'none',
      minWidth: `calc((${switchShapeSize} * 2) + (${switchIndentAbs} * 2))`,
      height: `calc(${switchShapeSize} + (${switchIndentAbs} * 2))`,
      borderRadius: switchShapeSize,
      backgroundColor: uncheckedColor,
      transition: `background-color ${switchDuration}`,
      ...theme.switch?.root,

      '&::before': {
        position: 'absolute',
        border: 'none',
        borderRadius: '100%',
        backgroundColor: emptyColor,
        transition: `margin-left ${switchDuration}`,
        marginLeft: switchIndent,
        ...theme.switch?.shape,
      },

      "&[aria-checked='true']": {
        backgroundColor: checkedColor,
        ...theme.switch?.checked?.root,

        '&::before': {
          marginLeft: `calc(100% - ${switchShapeSize} - ${switchIndent})`,
          ...theme.switch?.checked?.shape,
        },
      },
    },

    '@media (hover: hover)': {
      '&:hover::before': {
        ...theme.shape?.hover,
      },

      "&[role='checkbox']:hover::before": {
        ...theme.checkbox?.shape?.hover,
      },

      "&[role='radio']:hover::before": {
        borderColor: hoverColor,
        backgroundColor: `radial-gradient(ellipse at center, ${hoverColor} 0, ${hoverColor} 50%, ${emptyColor} 60%, ${emptyColor} 100%)`,
        ...theme.radio?.shape?.hover,
      },

      "&[role='switch']:hover::before": {
        ...theme.switch?.shape?.hover,
      },
    },
  };
});

export default function Checkbox<V = unknown>({
  type = 'checkbox',
  onChange,
  checked,
  disabled,
  value,
  ...rest
}: React.PropsWithChildren<CheckboxProps<V>>): React.JSX.Element {
  const { checkedValue, onChecked } = React.use(CheckboxContext);
  const [isChecked, setChecked] = React.useState(!!checked);

  const isCheckedRef = React.useRef(false);

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

  const toggle = React.useCallback(() => {
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
    <Root
      alignItems="center"
      role={type}
      aria-checked={isCheckedRef.current || undefined}
      aria-disabled={disabled || undefined}
      onClick={toggle}
      {...rest}
    />
  );
}
