'use client';

import { Component, ReactNode } from 'react';
import Button from './ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-semantic-error/10 flex items-center justify-center mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">
            Hitilafu imetokea
          </h2>
          <p className="text-sm text-neutral-500 mb-4 max-w-sm">
            Samahani, kuna tatizo la kiufundi. Tafadhali jaribu tena.
          </p>
          <Button onClick={() => this.setState({ hasError: false })}>
            Jaribu Tena
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
