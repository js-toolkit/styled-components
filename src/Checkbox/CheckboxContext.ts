import React from 'react';

export interface CheckboxContextValue<V = any> {
  /** Callback when child checked */
  onChecked?: (value: V) => void;
  /** Value for group for check child with corresponding value */
  checkedValue?: V;
}

export default React.createContext<CheckboxContextValue>({
  onChecked: undefined,
  checkedValue: undefined,
});
