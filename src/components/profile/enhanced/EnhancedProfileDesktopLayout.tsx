
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/useI18n";

interface EnhancedProfileLayoutProps {
  children: ReactNode;
  onStepClick: (step: string) => void;
}

const EnhancedProfileDesktopLayout = ({ 
  children, 
  onStepClick 
}: EnhancedProfileLayoutProps) => {
  const navigate = useNavigate();
  const { t, isRTL } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left Sidebar - Profile completion */}
        <div className="w-80 flex-shrink-0">
          <div className="h-full overflow-y-auto bg-white/60 backdrop-blur-sm border-r border-gray-200">
            <div className="p-6 space-y-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/profile')}
                className="p-0 h-auto text-sm hover:text-blue-600"
              >
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('back')} {t('profile')}
              </Button>
              
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
                  {t('enhancedProfile')}
                </h1>
                <p className="text-sm text-gray-600">
                  {t('completeProfileForPersonalization')}
                </p>
              </div>
              
              {/* Placeholder for profile completion content */}
              <div className="bg-white/80 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Profile Progress</h3>
                <p className="text-sm text-gray-600">Complete your profile to get personalized recommendations.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6 xl:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfileDesktopLayout;
