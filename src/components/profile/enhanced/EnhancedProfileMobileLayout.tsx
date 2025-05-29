
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EnhancedProfileMobileLayoutProps {
  children: ReactNode;
  currentStep: string;
  onStepChange: (step: string) => void;
}

const steps = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'basic', label: 'Basic Info', icon: '👤' },
  { id: 'health', label: 'Health', icon: '❤️' },
  { id: 'goals', label: 'Goals', icon: '🎯' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

const EnhancedProfileMobileLayout = ({ 
  children, 
  currentStep, 
  onStepChange 
}: EnhancedProfileMobileLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
              className="p-0 h-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg font-semibold text-gray-800">Enhanced Profile</h1>
            <div className="w-12" /> {/* Spacer for centering */}
          </div>
          
          {/* Mobile Step Navigation */}
          <div className="flex space-x-1 overflow-x-auto pb-1">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => onStepChange(step.id)}
                className={`
                  flex flex-col items-center min-w-0 flex-shrink-0 px-3 py-2 rounded-lg text-xs transition-colors
                  ${currentStep === step.id 
                    ? 'bg-blue-100 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-base mb-1">{step.icon}</span>
                <span className="truncate">{step.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {children}
      </div>
    </div>
  );
};

export default EnhancedProfileMobileLayout;
