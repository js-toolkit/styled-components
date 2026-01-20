/* eslint-disable react-hooks/refs */
import React from 'react';
import TransitionBase, {
  type TransitionActions,
  type TimeoutProps,
  type TransitionStatus as TransitionStatusOrigin,
  type EnterHandler,
  type ExitHandler,
} from 'react-transition-group/Transition';
import { clsx } from 'clsx';
import { useRefs } from '@js-toolkit/react-hooks/useRefs';
import { useRefCallback } from '@js-toolkit/react-hooks/useRefCallback';
import { useChainRefCallback } from '@js-toolkit/react-hooks/useChainRefCallback';

export type TransitionClassNames = PartialRecord<
  ExcludeStrict<TransitionStatusOrigin, 'unmounted'> | 'appearing' | 'appeared',
  string | undefined
>;

export type TransitionStatus = keyof TransitionClassNames;

export interface TransitionProps extends TransitionActions, OmitIndex<TimeoutProps<undefined>> {
  /** A single child content element. */
  children: React.ReactElement<
    { style?: React.CSSProperties | undefined; className?: string | undefined },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >;
  classNames?: string | TransitionClassNames | undefined;
  styles?: Partial<Record<TransitionStatus, React.CSSProperties>> | undefined;
}

const normalizedTransitionCallback =
  (
    nodeRef: React.RefObject<HTMLElement | null | undefined>,
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

const getClassName = (
  classNames: string | TransitionClassNames,
  status: TransitionStatus
): string => {
  const isStringClassNames = typeof classNames === 'string';
  const prefix = isStringClassNames && classNames ? `${classNames}-` : '';
  return isStringClassNames ? `${prefix}${status}` : (classNames[status] ?? '');
};

export default function Transition<E extends HTMLElement>(
  props: TransitionProps & React.RefAttributes<E>
): React.JSX.Element {
  const {
    ref,
    nodeRef: nodeRefProp,
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
    classNames = '',
    children,
    ...other
  } = props;

  const nodeRef = React.useRef<HTMLElement | null | undefined>(null);

  const handleRef = useRefs(
    (children as React.ReactElement<React.RefAttributes<unknown>>).props.ref,
    ref,
    nodeRefProp,
    nodeRef
  );

  const appearingRef = React.useRef(false);

  const handleStartTransition = (appearing?: boolean): void => {
    appearingRef.current = !!appearing;
  };

  const handleEnter = useChainRefCallback(
    handleStartTransition,
    normalizedTransitionCallback(nodeRef, onEnter)
  );

  const handleEntering = useRefCallback(normalizedTransitionCallback(nodeRef, onEntering));

  const handleEntered = useRefCallback(normalizedTransitionCallback(nodeRef, onEntered));

  const handleExit = useChainRefCallback(
    handleStartTransition,
    normalizedTransitionCallback(nodeRef, onExit)
  );

  const handleExiting = useRefCallback(normalizedTransitionCallback(nodeRef, onExiting));

  const handleExited = useRefCallback(normalizedTransitionCallback(nodeRef, onExited));

  const handleAddEndListener = useRefCallback((next: VoidFunction): void => {
    if (!addEndListener || !nodeRef.current) return;
    // Old call signature before `react-transition-group` implemented `nodeRef`
    addEndListener(nodeRef.current, next);
  });

  // const rootRef = React.useRef<TransitionBase<HTMLElement>>(null);

  return (
    // When prop `nodeRef` is provided `node` is excluded from callbacks
    <TransitionBase
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
      // ref={rootRef}
      {...other}
    >
      {(status0) => {
        if (status0 === 'unmounted') return null;

        const status =
          (appearingRef.current &&
            (((status0 === 'entering' && 'appearing') ||
              (status0 === 'entered' && 'appeared')) as TransitionStatus)) ||
          status0;

        const className = clsx(
          children.props.className,
          getClassName(classNames, status)
          // type === 'appear' && phase === 'done' && getClassNames(classNames, 'enter').doneClassName
        );

        // if ((children.props as AnyObject)['data-test']) {
        //   console.log(status, className, '-', (children.props as AnyObject).className);
        //   // console.log(rootRef.current);
        // }

        return React.cloneElement(children, {
          style: {
            ...children.props.style,
            ...(styles && styles[status]),
          },
          className,
          ref: handleRef,
          // ...childProps,
        });
      }}
    </TransitionBase>
  );
}
