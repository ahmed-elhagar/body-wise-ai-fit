
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileCompletionCard from "./ProfileCompletionCard";

interface EnhancedProfileDesktopLayoutProps {
  children: ReactNode;
  onStepClick: (step: string) => void;
}

const EnhancedProfileDesktopLayout = ({ 
  children, 
  onStepClick 
}: EnhancedProfileDesktopLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex min-h-screen max-w-7xl mx-auto">
        {/* Left Sidebar - Fixed width and proper spacing */}
        <div className="w-80 bg-white/60 backdrop-blur-sm border-r border-gray-200 flex-shrink-0">
          <div className="p-4 lg:p-6 h-full">
            <Button
              variant="ghost"
              onClick={() => navigate('/profile')}
              className="mb-4 p-0 h-auto text-sm hover:text-blue-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            
            <div className="mb-6">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Enhanced Profile</h1>
              <p className="text-xs lg:text-sm text-gray-600">
                Complete your profile for personalized AI recommendations
              </p>
            </div>
            
            <ProfileCompletionCard onStepClick={onStepClick} />
          </div>
        </div>

        {/* Main Content - Better responsive layout */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4 lg:p-6 xl:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfileDesktopLayout;
