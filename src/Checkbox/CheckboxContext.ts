import React from 'react';

export interface CheckboxContextValue<V = unknown> {
  /** Callback when child checked */
  onChecked?: ((value: V) => void) | undefined;
  /** Value for group for check child with corresponding value */
  checkedValue?: V | undefined;
}

export default React.createContext<CheckboxContextValue<any>>({
  onChecked: undefined,
  checkedValue: undefined,
});
