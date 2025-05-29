
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
      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <div className="w-80 bg-white/60 backdrop-blur-sm border-r border-gray-200">
          <div className="p-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/profile')}
              className="mb-4 p-0 h-auto text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Enhanced Profile</h1>
              <p className="text-sm text-gray-600">
                Complete your profile for personalized AI recommendations
              </p>
            </div>
            
            <ProfileCompletionCard onStepClick={onStepClick} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfileDesktopLayout;
