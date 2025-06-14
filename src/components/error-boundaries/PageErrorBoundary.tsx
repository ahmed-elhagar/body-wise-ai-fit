
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  pageName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export class PageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Page Error in ${this.props.pageName}:`, error, errorInfo);
    
    // Log error to external service
    this.logError(error, errorInfo);
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorData = {
      page: this.props.pageName,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('Page Error Logged:', errorData);
  };

  private handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorId: Math.random().toString(36).substr(2, 9)
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportIssue = () => {
    // In a real app, this would open a support ticket or feedback form
    console.log('Report issue clicked for error:', this.state.errorId);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-600">
                Page Error Occurred
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div>
                <p className="text-gray-600 mb-2">
                  We're sorry! The <strong>{this.props.pageName}</strong> page encountered an unexpected error.
                </p>
                <p className="text-sm text-gray-500">
                  Our team has been notified and we're working to fix this issue.
                </p>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <div className="text-left bg-gray-50 p-4 rounded-md">
                  <p className="font-semibold text-red-600 mb-2">Development Info:</p>
                  <p className="text-sm text-gray-700 break-all mb-2">
                    {this.state.error?.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    Error ID: {this.state.errorId}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 justify-center">
                  <Button onClick={this.handleRetry} size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reload Page
                  </Button>
                  <Button onClick={this.handleGoHome} variant="outline" size="sm">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Button>
                </div>
                <Button 
                  onClick={this.handleReportIssue} 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Report This Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
