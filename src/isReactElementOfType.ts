/* eslint-disable dot-notation */
import React from 'react';
import ReactIs from 'react-is';

export function isReactElementOfType<
  T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>,
>(
  element: React.ReactNode | React.ComponentType<any>,
  type: T,
  deep = false
): element is React.ReactComponentElement<T, React.ComponentProps<T>> {
  if (React.isValidElement(element)) {
    if ((element as AnyObject)['$$typeof'] === ReactIs.Memo) {
      return isReactElementOfType(element['type'] as React.ElementType, type, deep);
    }

    if (isReactElementOfType(element['type'] as React.ElementType, type, deep)) {
      return true;
    }

    if (
      deep &&
      React.Children.count((element.props as React.PropsWithChildren<unknown>).children) === 1
    ) {
      return isReactElementOfType(
        React.Children.only((element.props as React.PropsWithChildren<unknown>).children),
        type,
        deep
      );
    }
  }

  return element === type;
}
