import React from 'react';
import DefaultRenderer from './DefaultRenderer';

export interface ErrorBoundaryProps {
  readonly error?: unknown;
  readonly onError?: ((error: Error, errorInfo: React.ErrorInfo) => void) | undefined;
  readonly renderer: ((error: unknown) => React.ReactNode) | undefined;
}

interface State {
  readonly error: unknown;
}

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren<ErrorBoundaryProps>,
  State
> {
  static defaultRenderer: ErrorBoundaryProps['renderer'] = (error) => (
    <DefaultRenderer error={error} />
  );

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

  override state: State = {
    error: undefined,
  };

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

    return null;
  }
}
