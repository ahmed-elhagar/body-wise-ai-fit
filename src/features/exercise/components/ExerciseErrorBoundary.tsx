
import { ErrorBoundary } from 'react-error-boundary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface ExerciseErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ExerciseErrorFallback = ({ error, resetErrorBoundary }: ExerciseErrorFallbackProps) => {
  const { language } = useLanguage();

  const handleReportError = () => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      page: 'exercise',
      userAgent: navigator.userAgent
    };

    console.error('🐛 Exercise Error Report:', errorReport);
    
    // Copy to clipboard
    navigator.clipboard?.writeText(JSON.stringify(errorReport, null, 2));
    
    const message = language === 'ar'
      ? 'تم نسخ تفاصيل الخطأ. يرجى إرسالها للدعم الفني.'
      : 'Error details copied. Please send to support.';
    
    toast.success(message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <Card className="p-8 bg-white/90 backdrop-blur-sm border-red-200 text-center max-w-md w-full">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {language === 'ar' ? 'حدث خطأ في صفحة التمارين' : 'Exercise Page Error'}
        </h2>
        
        <p className="text-gray-600 mb-4">
          {language === 'ar' 
            ? 'واجهنا مشكلة في تحميل التمارين. يرجى المحاولة مرة أخرى.'
            : 'We encountered an issue loading your exercises. Please try again.'
          }
        </p>
        
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded mb-4 font-mono">
          {error.message}
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={resetErrorBoundary}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
          </Button>
          
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full"
          >
            {language === 'ar' ? 'إعادة تحميل الصفحة' : 'Reload Page'}
          </Button>
          
          <Button
            onClick={handleReportError}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            <Bug className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'إبلاغ عن الخطأ' : 'Report Error'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

interface ExerciseErrorBoundaryProps {
  children: React.ReactNode;
}

export const ExerciseErrorBoundary = ({ children }: ExerciseErrorBoundaryProps) => {
  const handleError = (error: Error, errorInfo: any) => {
    console.error('🚨 Exercise Error Boundary triggered:', {
      error: error.message,
      stack: error.stack,
      errorInfo,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <ErrorBoundary
      FallbackComponent={ExerciseErrorFallback}
      onError={handleError}
      onReset={() => {
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
