import React from 'react';
import DefaultRenderer, { DefaultRendererProps } from './DefaultRenderer';

export type ErrorBoundaryProps = { error?: unknown } & (
  | ({ renderer?: undefined } & Partial<DefaultRendererProps>)
  | { renderer: (error: unknown) => React.ReactNode }
);

interface State {
  error: unknown;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  // eslint-disable-next-line react/state-in-constructor
  state: State = {
    error: undefined,
  };

  static getDerivedStateFromProps(
    nextProps: ErrorBoundaryProps,
    prevState: State
  ): Partial<State> | null {
    if (nextProps.error !== prevState.error) {
      return { error: nextProps.error ?? prevState.error };
    }
    return null;
  }

  static getDerivedStateFromError(error: unknown): State {
    return { error };
  }

  // componentDidCatch(): void {
  // Define it just for logging error by react itself.
  // }

  render(): React.ReactNode {
    const { error } = this.state;
    const { renderer, error: _, children, ...rest } = this.props;

    if (error == null) {
      return children;
    }

    if (renderer) {
      return renderer(error);
    }

    return <DefaultRenderer error={error} {...rest} />;
  }
}
