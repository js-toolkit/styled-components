import React from 'react';
import DefaultRenderer, { DefaultRendererProps } from './DefaultRenderer';

export type ErrorBoundaryProps = {
  error?: unknown;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
} & (
  | ({ renderer?: undefined } & Partial<DefaultRendererProps>)
  | { renderer: (error: unknown) => React.ReactNode }
);

interface State {
  error: unknown;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  // eslint-disable-next-line react/state-in-constructor
  override state: State = {
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

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const { onError } = this.props;
    onError && onError(error, errorInfo);
  }

  override render(): React.ReactNode {
    const { renderer, children } = this.props;
    const { error } = this.state;

    if (error == null) {
      return children;
    }

    if (renderer) {
      return renderer(error);
    }

    return <DefaultRenderer error={error} />;
  }
}
