
import { LucideIcon, CheckCircle, Loader2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface LoadingStepItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
}

export const LoadingStepItem = ({ 
  icon: IconComponent, 
  title, 
  description, 
  isActive, 
  isCompleted 
}: LoadingStepItemProps) => {
  const { isRTL } = useI18n();

  return (
    <div 
      className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-500 ${
        isActive 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 scale-105 shadow-md' 
          : isCompleted 
            ? 'bg-emerald-50 border-l-4 border-emerald-500 opacity-90' 
            : 'bg-gray-50 opacity-60'
      } ${isRTL ? 'flex-row-reverse border-r-4 border-l-0' : ''}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
        isCompleted 
          ? 'bg-emerald-500 text-white' 
          : isActive 
            ? 'bg-green-500 text-white animate-pulse' 
            : 'bg-gray-300 text-gray-600'
      }`}>
        {isCompleted ? (
          <CheckCircle className="w-5 h-5" />
        ) : isActive ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <IconComponent className="w-5 h-5" />
        )}
      </div>
      <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h4 className={`font-semibold text-gray-800 transition-colors duration-300 ${
          isActive ? 'text-green-700' : isCompleted ? 'text-emerald-700' : ''
        }`}>
          {title}
        </h4>
        <p className={`text-sm text-gray-600 transition-colors duration-300 ${
          isActive ? 'text-green-600' : isCompleted ? 'text-emerald-600' : ''
        }`}>
          {description}
        </p>
      </div>
    </div>
  );
};
