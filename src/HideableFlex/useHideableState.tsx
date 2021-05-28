import { useState } from 'react';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';

export interface HideableState {
  readonly enabled: boolean;
  readonly visible: boolean;
}

export type UseHideableStateProps = HideableState;

export type UseHideableStateResult = [
  state: HideableState,
  hide: VoidFunction,
  disable: VoidFunction
];

export default function useHideableState(
  initialState: HideableState | (() => HideableState)
): UseHideableStateResult {
  const [state, setState] = useState<HideableState>(initialState);

  const hide = useRefCallback(() => {
    if (!state.visible) return;
    setState((prev) => ({ ...prev, visible: false }));
  });

  const disable = useRefCallback(() => {
    if (!state.enabled && !state.visible) return;
    setState((prev) => ({ ...prev, enabled: false, visible: false }));
  });

  return [state, hide, disable];
}
