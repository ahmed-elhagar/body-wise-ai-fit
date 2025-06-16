
import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-6 mx-auto max-w-md">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-error-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Something went wrong
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                We're sorry, but an unexpected error occurred. Please try again.
              </p>
            </div>
            <Button 
              onClick={this.handleRetry}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
