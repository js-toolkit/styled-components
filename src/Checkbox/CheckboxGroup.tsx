import React, { useState, useMemo } from 'react';
import { Flex, type FlexComponentProps } from 'reflexy/styled';
import useRefCallback from '@jstoolkit/react-hooks/useRefCallback';
import CheckboxContext, { type CheckboxContextValue } from './CheckboxContext';

export interface CheckboxGroupChangeEvent<V = unknown> {
  name?: string | undefined;
  value: V;
}

export interface CheckboxGroupProps<V = unknown>
  extends Omit<FlexComponentProps<'div'>, 'onChange'> {
  name?: string | undefined;
  value?: CheckboxContextValue<V>['checkedValue'] | undefined;
  onChange?: ((data: CheckboxGroupChangeEvent<V>) => void) | undefined;
}

export default function CheckboxGroup<V = unknown>({
  name,
  value: checkedValueProp,
  onChange,
  ...rest
}: React.PropsWithChildren<CheckboxGroupProps<V>>): JSX.Element {
  const [checkedValue, setCheckedValue] = useState(checkedValueProp);

  const onChecked = useRefCallback((value: V) => {
    // If controlled
    if (onChange) {
      onChange({ value, name });
      return;
    }
    // Not controlled
    setCheckedValue(value);
  });

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
