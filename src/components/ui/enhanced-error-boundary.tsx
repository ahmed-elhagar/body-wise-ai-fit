
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    const errorId = `boundary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error,
      errorId 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Enhanced Error Boundary caught error:', {
      error: error.message,
      stack: error.stack,
      errorInfo,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  private handleReportBug = () => {
    const errorReport = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.log('🐛 Error Report Generated:', errorReport);
    
    // In a real app, this would send to an error reporting service
    navigator.clipboard?.writeText(JSON.stringify(errorReport, null, 2));
    alert('Error details copied to clipboard. Please report this to support.');
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-8 m-4 text-center border-red-200 bg-red-50">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-2">
            We encountered an unexpected error. This has been logged for investigation.
          </p>
          <p className="text-sm text-gray-500 mb-4 font-mono">
            Error ID: {this.state.errorId}
          </p>
          <div className="space-x-4">
            <Button onClick={this.handleRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
            <Button onClick={this.handleReportBug} variant="outline" size="sm">
              <Bug className="w-4 h-4 mr-2" />
              Report Bug
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-600">
                Developer Details
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </Card>
      );
    }

    return this.props.children;
  }
}
