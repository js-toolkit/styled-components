import { useMemo, useRef, useState } from 'react';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';

export interface HideableState {
  readonly enabled: boolean;
  readonly visible: boolean;
}

export type UseHideableStateProps = HideableState;

export type UseHideableStateResult = HideableState & { hide: VoidFunction; disable: VoidFunction };

export default function useHideableState(
  initialState: HideableState | (() => HideableState)
): UseHideableStateResult {
  const [state, setState] = useState<HideableState>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const hide = useRefCallback(() => {
    if (!state.visible) return;
    setState((prev) => ({ ...prev, visible: false }));
  });

  const disable = useRefCallback(() => {
    if (!state.enabled && !state.visible) return;
    setState((prev) => ({ ...prev, enabled: false, visible: false }));
  });

  return useMemo(
    () => ({
      get enabled() {
        return stateRef.current.enabled;
      },
      get visible() {
        return stateRef.current.visible;
      },
      hide,
      disable,
    }),
    [disable, hide]
  );
}
