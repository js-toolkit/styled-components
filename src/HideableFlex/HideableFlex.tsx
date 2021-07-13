import React, { useEffect } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Flex, DefaultComponentType, FlexAllProps } from 'reflexy';
import useRefCallback from '@js-toolkit/react-hooks/useRefCallback';
import useUpdatedRefState from '@js-toolkit/react-hooks/useUpdatedRefState';

type MakeStylesProps = RequiredBut<
  Pick<
    HideableFlexProps,
    | 'hidden'
    | 'collapsable'
    | 'transitionDuration'
    | 'transitionTimingFunction'
    | 'transitionProperty'
  >,
  'transitionProperty'
>;

export function getTransition({
  hidden,
  transitionDuration,
  transitionTimingFunction,
  transitionProperty,
}: OmitStrict<MakeStylesProps, 'collapsable'>): string {
  const duration =
    typeof transitionDuration === 'number' ? `${transitionDuration}ms` : transitionDuration;

  const transition = hidden
    ? `visibility 0.1ms ${transitionTimingFunction} ${duration}, max-height ${duration} ${transitionTimingFunction}, opacity ${duration} ${transitionTimingFunction}`
    : `visibility 0.1ms ${transitionTimingFunction} 0ms, max-height ${duration} ${transitionTimingFunction}, opacity ${duration} ${transitionTimingFunction}`;

  if (transitionProperty) {
    return transitionProperty.split(',').reduce((acc, prop) => {
      return `${acc}, ${prop} ${duration} ${transitionTimingFunction}`;
    }, transition);
  }

  return transition;
}

const useStyles = makeStyles({
  root: (props: MakeStylesProps) => {
    const transition = getTransition(props);
    if (props.hidden) {
      return {
        pointerEvents: 'none',
        visibility: 'hidden',
        opacity: 0,
        maxHeight: props.collapsable ? 0 : undefined,
        transition,
      };
    }
    return {
      visibility: 'visible',
      opacity: 1,
      maxHeight: props.collapsable ? '100vh' : undefined,
      transition,
    };
  },
});

export interface HideableProps
  extends Override<
    Pick<
      React.CSSProperties,
      'transitionDuration' | 'transitionTimingFunction' | 'transitionProperty'
    >,
    { transitionDuration?: number | string }
  > {
  readonly hidden?: boolean;
  readonly disposable?: boolean;
  readonly collapsable?: boolean;
  readonly keepChildren?: boolean;
  readonly mountWithTransition?: boolean;
  readonly hiddenClassName?: string;
  readonly onHidden?: VoidFunction;
  readonly onShown?: VoidFunction;
}

export type HideableFlexProps<C extends React.ElementType = DefaultComponentType> = FlexAllProps<
  C,
  { defaultStyles: { className: true } }
> &
  HideableProps;

interface State {
  readonly hidden: boolean;
  readonly disposed: boolean;
  readonly lastChildren: React.ReactNode;
}

export default function HideableFlex<C extends React.ElementType = DefaultComponentType>({
  hidden: hiddenProp,
  disposable,
  collapsable,
  keepChildren,
  mountWithTransition = true,
  className,
  hiddenClassName,
  transitionDuration = '0.2s',
  transitionTimingFunction = 'ease',
  transitionProperty,
  onHidden,
  onShown,
  ...rest
}: HideableFlexProps<C>): JSX.Element | null {
  const { onTransitionEnd, children: childrenProp } = rest as React.HTMLAttributes<Element>;

  const [getState, setState] = useUpdatedRefState<State>(
    (prev) => {
      // Initial state
      if (!prev) {
        return {
          hidden: mountWithTransition ? true : !!hiddenProp,
          disposed: disposable ? !!hiddenProp || mountWithTransition : false,
          lastChildren: childrenProp,
        };
      }
      // Sync state with prop
      return {
        ...prev,
        hidden: !!hiddenProp,
        // Restore if not hidden
        disposed: disposable && !hiddenProp ? false : prev.disposed,
      };
    },
    [disposable, hiddenProp]
  );

  // Immediatly show after first render to activate transition
  useEffect(() => {
    if (mountWithTransition && !hiddenProp) {
      setState((prev) => ({ ...prev, hidden: false, disposed: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transitionEndHandler = useRefCallback<React.TransitionEventHandler>((event) => {
    onTransitionEnd && onTransitionEnd(event);
    if (disposable && event.propertyName === 'visibility') {
      const { hidden, disposed } = getState();
      if (hidden && !disposed) setState((prev) => ({ ...prev, disposed: true }));
      else if (!hidden && disposed) setState((prev) => ({ ...prev, disposed: false }));
    }
    if (event.propertyName === 'opacity') {
      if (getState().hidden) {
        keepChildren && setState((prev) => ({ ...prev, lastChildren: undefined }));
        onHidden && onHidden();
      } else {
        keepChildren && setState((prev) => ({ ...prev, lastChildren: childrenProp }));
        onShown && onShown();
      }
    }
  });

  const { hidden, disposed, lastChildren } = getState();
  const children = keepChildren ? childrenProp || lastChildren : childrenProp;

  const css = useStyles({
    classes: { root: className },
    hidden: disposable ? hidden || disposed : hidden,
    collapsable: !!collapsable,
    transitionDuration,
    transitionTimingFunction,
    transitionProperty,
  });

  if (hidden && disposable && disposed) return null;

  return (
    <Flex
      className={hidden && hiddenClassName ? `${css.root} ${hiddenClassName}` : css.root}
      {...rest}
      onTransitionEnd={transitionEndHandler}
      // eslint-disable-next-line react/no-children-prop
      children={children}
    />
  );
}
