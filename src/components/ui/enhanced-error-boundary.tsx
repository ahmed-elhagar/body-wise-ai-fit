
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Enhanced Error Boundary caught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      retryCount: this.retryCount
    });

    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Show toast notification for non-critical errors
    if (this.retryCount < this.maxRetries) {
      toast.error('Something went wrong', {
        description: 'The application encountered an error. You can try again.',
        action: {
          label: 'Retry',
          onClick: this.handleRetry
        }
      });
    }
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`🔄 Retrying... Attempt ${this.retryCount}/${this.maxRetries}`);
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        errorId: undefined 
      });
    } else {
      toast.error('Maximum retries exceeded', {
        description: 'Please refresh the page or contact support if the issue persists.'
      });
    }
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  private handleReportError = () => {
    const errorReport = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.log('📋 Error report generated:', errorReport);
    
    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => {
        toast.success('Error report copied to clipboard', {
          description: 'Please share this with our support team.'
        });
      })
      .catch(() => {
        toast.error('Failed to copy error report');
      });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.retryCount < this.maxRetries;
      const isRepeatedError = this.retryCount > 1;

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="max-w-lg w-full p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {isRepeatedError ? 'Persistent Error Detected' : 'Something went wrong'}
            </h2>
            
            <p className="text-gray-600 mb-4">
              {isRepeatedError 
                ? 'The application is experiencing repeated errors. This might require attention from our support team.'
                : 'We encountered an unexpected error. This usually resolves itself with a retry.'
              }
            </p>

            {this.state.error && (
              <div className="bg-gray-100 p-3 rounded-lg mb-4 text-left">
                <p className="text-sm font-mono text-gray-700 truncate">
                  {this.state.error.message}
                </p>
                {this.state.errorId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Error ID: {this.state.errorId}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              {canRetry && (
                <Button 
                  onClick={this.handleRetry} 
                  className="w-full"
                  variant={isRepeatedError ? "outline" : "default"}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again ({this.maxRetries - this.retryCount} attempts left)
                </Button>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={this.handleRefresh} 
                  variant="outline" 
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>
                
                <Button 
                  onClick={this.handleGoHome} 
                  variant="outline" 
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {isRepeatedError && (
                <Button 
                  onClick={this.handleReportError} 
                  variant="ghost" 
                  size="sm"
                  className="w-full"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Copy Error Report
                </Button>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              If this issue persists, please refresh the page or contact support.
            </p>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
