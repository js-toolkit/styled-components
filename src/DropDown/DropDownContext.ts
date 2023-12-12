import React from 'react';
import { noop } from '@js-toolkit/utils/noop';

export interface ToggleHandler {
  (expanded: boolean): void;
  (): void;
}

export interface DropDownContextValue {
  expanded: boolean;
  floating: boolean;
  toggle: ToggleHandler;
}

export default React.createContext<DropDownContextValue>({
  expanded: false,
  floating: true,
  toggle: noop,
});
