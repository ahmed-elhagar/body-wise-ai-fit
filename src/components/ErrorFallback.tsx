
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="p-8 bg-white border-red-200 max-w-lg w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          
          <p className="text-gray-600 mb-6">
            The application encountered an unexpected error. This usually resolves itself with a refresh.
          </p>
          
          {error && import.meta.env.DEV && (
            <details className="mb-6 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer mb-2">
                Technical details (development mode)
              </summary>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto text-red-600">
                {error.message}
                {error.stack && '\n\n' + error.stack}
              </pre>
            </details>
          )}
          
          <div className="space-y-3">
            <Button 
              onClick={handleRefresh}
              className="w-full bg-red-600 text-white hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={handleGoHome}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ErrorFallback;
