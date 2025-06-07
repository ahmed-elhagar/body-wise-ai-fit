
import { Loader2 } from "lucide-react";

interface EnhancedPageLoadingProps {
  title?: string;
  description?: string;
  estimatedTime?: number;
  className?: string;
}

const EnhancedPageLoading = ({ 
  title = "Loading...", 
  description = "Please wait while we fetch your data",
  estimatedTime = 3,
  className = ""
}: EnhancedPageLoadingProps) => {
  return (
    <div className={`flex items-center justify-center min-h-[400px] w-full ${className}`}>
      <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 max-w-md">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
        <p className="text-gray-700 font-medium text-lg mb-2">{title}</p>
        <p className="text-gray-500 text-sm mb-3">{description}</p>
        <div className="bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>
        <p className="text-xs text-gray-400">Estimated time: {estimatedTime}s</p>
      </div>
    </div>
  );
};

export default EnhancedPageLoading;
