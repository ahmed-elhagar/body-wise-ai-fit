
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileCompletionCard from "./ProfileCompletionCard";

interface EnhancedProfileLayoutProps {
  children: ReactNode;
  onStepClick: (step: string) => void;
}

const EnhancedProfileLayout = ({ children, onStepClick }: EnhancedProfileLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 bg-white/60 backdrop-blur-sm border-b border-gray-200">
          <Button
            variant="ghost"
            onClick={() => navigate('/profile')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-800">Enhanced Profile</h1>
            <p className="text-sm text-gray-600">Complete your profile for personalized recommendations</p>
          </div>
          
          {/* Mobile Profile Completion Card */}
          <ProfileCompletionCard onStepClick={onStepClick} />
        </div>

        {/* Desktop Left Sidebar - Profile Completion */}
        <div className="hidden lg:block w-80 bg-white/60 backdrop-blur-sm border-r border-gray-200">
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
              <h1 className="text-xl font-bold text-gray-800">Enhanced Profile</h1>
              <p className="text-sm text-gray-600">Complete your profile for personalized recommendations</p>
            </div>
            <ProfileCompletionCard onStepClick={onStepClick} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfileLayout;
