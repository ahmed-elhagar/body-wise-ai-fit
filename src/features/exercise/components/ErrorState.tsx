
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to Load Exercise Program
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          {error.message || 'There was an error loading your exercise program. Please try again.'}
        </p>
        <Button onClick={onRetry} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    </Card>
  );
};

export default ErrorState;
