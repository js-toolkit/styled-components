import React, { useCallback, useState, useMemo } from 'react';
import { Flex, FlexComponentProps } from 'reflexy/styled';
import CheckboxContext, { CheckboxContextValue } from '../CheckboxContext';

export interface CheckboxGroupChangeEvent<V = any> {
  name?: string;
  value: V;
}

export interface CheckboxGroupProps<V = any> extends Omit<FlexComponentProps<'div'>, 'onChange'> {
  name?: string;
  value?: CheckboxContextValue<V>['checkedValue'];
  onChange?: (data: CheckboxGroupChangeEvent<V>) => void;
}

export default function CheckboxGroup<V = any>({
  name,
  value: checkedValueProp,
  onChange,
  ...rest
}: React.PropsWithChildren<CheckboxGroupProps<V>>): JSX.Element {
  const [checkedValue, setCheckedValue] = useState(checkedValueProp);

  const onChecked = useCallback(
    (value: V) => {
      // If controlled
      if (onChange) {
        onChange({ value, name });
        return;
      }
      // Not controlled
      setCheckedValue(value);
    },
    [name, onChange]
  );

  const contextValue = useMemo<CheckboxContextValue<V>>(
    () => ({
      checkedValue: onChange
        ? // If controlled
          checkedValueProp
        : // Not controlled
          checkedValue,
      onChecked,
    }),
    [checkedValue, checkedValueProp, onChange, onChecked]
  );

  return (
    <CheckboxContext.Provider value={contextValue}>
      <Flex role="radiogroup" {...rest} />
    </CheckboxContext.Provider>
  );
}
