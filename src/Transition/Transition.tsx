import React from 'react';
import type {
  TransitionActions,
  TimeoutProps,
  TransitionStatus,
  EnterHandler,
  ExitHandler,
} from 'react-transition-group/Transition';
import CSSTransition, { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import useRefs from '@jstoolkit/react-hooks/useRefs';

interface BaseProps
  extends TransitionActions,
    TimeoutProps<undefined>,
    Pick<CSSTransitionProps, 'classNames'> {}

export interface TransitionProps extends BaseProps {
  /** A single child content element. */
  children: React.ReactElement<{ style?: React.CSSProperties }, any>;
  styles?: Partial<Record<TransitionStatus, React.CSSProperties>>;
}

export default React.forwardRef(function Transition(
  props: TransitionProps,
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

  const normalizedTransitionCallback =
    (
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

  const handleEnter = normalizedTransitionCallback(onEnter);

  const handleEntering = normalizedTransitionCallback(onEntering);

  const handleEntered = normalizedTransitionCallback(onEntered);

  const handleExit = normalizedTransitionCallback(onExit);

  const handleExiting = normalizedTransitionCallback(onExiting);

  const handleExited = normalizedTransitionCallback(onExited);

  const handleAddEndListener = (next: VoidFunction): void => {
    if (!addEndListener || !nodeRef.current) return;
    // Old call signature before `react-transition-group` implemented `nodeRef`
    addEndListener(nodeRef.current, next);
  };

  const TransitionComponent = CSSTransition as React.ComponentClass<
    CSSTransitionProps<HTMLElement | undefined>
  >;

  return (
    <TransitionComponent
      appear={appear}
      in={inProp}
      nodeRef={nodeRef}
      onEnter={handleEnter}
      onEntered={handleEntered}
      onEntering={handleEntering}
      onExit={handleExit}
      onExited={handleExited}
      onExiting={handleExiting}
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
    </TransitionComponent>
  );
}) as <E extends HTMLElement>(props: TransitionProps & React.RefAttributes<E>) => JSX.Element;
