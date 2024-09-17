import React from 'react';
import type {
  TransitionActions,
  TimeoutProps,
  TransitionStatus,
  EnterHandler,
  ExitHandler,
} from 'react-transition-group/Transition';
import CSSTransition, { type CSSTransitionProps } from 'react-transition-group/CSSTransition';
import useRefs from '@js-toolkit/react-hooks/useRefs';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';

export interface TransitionProps<E extends HTMLElement | undefined>
  extends TransitionActions,
    OmitIndex<TimeoutProps<E>>,
    Pick<CSSTransitionProps<E>, 'classNames'> {
  /** A single child content element. */
  children: React.ReactElement<{ style?: React.CSSProperties | undefined }, any>;
  styles?: Partial<Record<TransitionStatus, React.CSSProperties>> | undefined;
}

const normalizedTransitionCallback =
  (
    nodeRef: React.RefObject<HTMLElement | undefined>,
    callback: EnterHandler<undefined> | ExitHandler<undefined> | undefined
  ): ((isAppearing?: boolean) => void) =>
  (maybeIsAppearing) => {
    if (!callback || !nodeRef.current) return;
    const node = nodeRef.current;
    // onEnterXxx and onExitXxx callbacks have a different arguments.length value.
    if (maybeIsAppearing === undefined) {
      (callback as ExitHandler<undefined>)(node);
    } else {
      (callback as EnterHandler<undefined>)(node, maybeIsAppearing);
    }
  };

export default React.forwardRef(function Transition(
  props: TransitionProps<undefined>,
  ref: React.Ref<unknown>
): JSX.Element {
  const {
    nodeRef: _,
    appear = true,
    in: inProp,
    addEndListener,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExited,
    onExiting,
    styles,
    children,
    ...other
  } = props;

  const nodeRef = React.useRef<HTMLElement | undefined>(null);

  const handleRef = useRefs(
    (children as React.FunctionComponentElement<unknown>).ref,
    ref,
    nodeRef
  );

  const handleEnter = useRefCallback(normalizedTransitionCallback(nodeRef, onEnter));
  const handleEntering = useRefCallback(normalizedTransitionCallback(nodeRef, onEntering));
  const handleEntered = useRefCallback(normalizedTransitionCallback(nodeRef, onEntered));
  const handleExit = useRefCallback(normalizedTransitionCallback(nodeRef, onExit));
  const handleExiting = useRefCallback(normalizedTransitionCallback(nodeRef, onExiting));
  const handleExited = useRefCallback(normalizedTransitionCallback(nodeRef, onExited));

  const handleAddEndListener = useRefCallback((next: VoidFunction): void => {
    if (!addEndListener || !nodeRef.current) return;
    // Old call signature before `react-transition-group` implemented `nodeRef`
    addEndListener(nodeRef.current, next);
  });

  return (
    <CSSTransition
      appear={appear}
      in={inProp}
      nodeRef={nodeRef}
      onEnter={handleEnter}
      onEntering={handleEntering}
      onEntered={handleEntered}
      onExit={handleExit}
      onExiting={handleExiting}
      onExited={handleExited}
      addEndListener={handleAddEndListener}
      {...other}
    >
      {(status /* , childProps */) => {
        return React.cloneElement(children, {
          style: {
            ...children.props.style,
            ...(styles && styles[status]),
          },
          ref: handleRef,
          // ...childProps,
        });
      }}
    </CSSTransition>
  );
}) as <E extends HTMLElement>(props: TransitionProps<E> & React.RefAttributes<E>) => JSX.Element;
