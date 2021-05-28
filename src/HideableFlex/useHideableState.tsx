import React, { useEffect, useMemo, useRef, useState } from 'react';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';

export interface HideableState {
  readonly enabled: boolean;
  readonly visible: boolean;
}

export type UseHideableStateProps = HideableState;

export type UseHideableStateResult = HideableState & { hide: VoidFunction; disable: VoidFunction };

export default function useHideableState(
  initialState: HideableState | (() => HideableState),
  stateUpdate?: (prevState: HideableState) => HideableState,
  stateUpdateDeps: React.DependencyList = []
): UseHideableStateResult {
  const [state, setState] = useState<HideableState>(initialState);
  const firstRenderRef = useRef(true);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    stateUpdate && setState(stateUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, stateUpdateDeps);

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
