
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Alert className="max-w-md border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="space-y-4">
          <div>
            <p className="font-medium text-red-800">Unable to load meal plan</p>
            <p className="text-sm text-red-700 mt-1">
              {error.message || 'An unexpected error occurred while loading your meal plan.'}
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={onRetry} 
              variant="outline" 
              size="sm"
              className="w-full border-red-300 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={handleGoHome} 
              variant="ghost" 
              size="sm"
              className="w-full text-red-600 hover:bg-red-100"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
          
          <p className="text-xs text-red-600">
            If this issue persists, try refreshing the page or check your internet connection.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ErrorState;
