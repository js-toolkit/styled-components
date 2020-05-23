import React from 'react';

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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggle: () => {},
});
