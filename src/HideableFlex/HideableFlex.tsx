import React, { useLayoutEffect } from 'react';
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
    ? `visibility 0s ${transitionTimingFunction} ${duration}`
    : `visibility 0s ${transitionTimingFunction} 0s`;

  const properties = `opacity,max-height${transitionProperty ? `,${transitionProperty}` : ''}`;

  return properties.split(',').reduce((acc, prop) => {
    return `${acc},${prop} ${duration} ${transitionTimingFunction}`;
  }, transition);
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
  useLayoutEffect(() => {
    if (mountWithTransition && !hiddenProp) {
      setState((prev) => ({ ...prev, hidden: false, disposed: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transitionEndHandler = useRefCallback<React.TransitionEventHandler>((event) => {
    onTransitionEnd && onTransitionEnd(event);

    // Ignore bubbling events from children elements
    if (event.target !== event.currentTarget) return;
    // Listen only `opacity` changes.
    if (event.propertyName !== 'opacity') return;

    const { hidden, disposed } = getState();
    if (hidden) {
      if ((disposable && !disposed) || keepChildren) {
        setState((prev) => ({
          ...prev,
          // Dispose after animation ends. It will be reverted by state sync.
          disposed: disposable ? true : prev.disposed,
          lastChildren: undefined,
        }));
      }
      onHidden && onHidden();
    } else {
      keepChildren && setState((prev) => ({ ...prev, lastChildren: childrenProp }));
      onShown && onShown();
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
