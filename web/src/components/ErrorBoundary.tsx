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
  errorRef: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorRef: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorRef: `MKD-${Date.now().toString(36).toUpperCase()}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Mkadamnasi ErrorBoundary]', {
      ref: this.state.errorRef,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-8 text-center">
          <div className="mb-4">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="28" fill="#FEF2F2" stroke="#FECACA" strokeWidth="1.5" />
              <path d="M32 20L46 44H18L32 20Z" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinejoin="round" />
              <line x1="32" y1="28" x2="32" y2="36" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
              <circle cx="32" cy="40" r="1.2" fill="#EF4444" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">
            Sehemu hii ina tatizo
          </h2>
          <p className="text-sm text-neutral-500 mb-4 max-w-sm">
            Samahani, sehemu hii ya ukurasa haifanyi kazi kwa sasa. Jaribu kupakia upya.
          </p>
          <Button onClick={() => this.setState({ hasError: false, errorRef: '' })}>
            Jaribu Tena
          </Button>
          <p className="text-xs text-neutral-300 mt-4 font-mono">Ref: {this.state.errorRef}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
