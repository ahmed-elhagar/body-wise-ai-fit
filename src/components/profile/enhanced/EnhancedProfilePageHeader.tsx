
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

interface EnhancedProfilePageHeaderProps {
  formData: any;
  profileCompleteness: number;
}

const EnhancedProfilePageHeader = ({ formData, profileCompleteness }: EnhancedProfilePageHeaderProps) => {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/profile')}
        className="mb-4 hover:text-blue-600"
      >
        <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
        {t('back')} {t('profile')}
      </Button>
      
      {/* Header Info Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-gray-200 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-fitness-gradient rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl lg:text-2xl">
                {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : user?.email?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                {t('enhancedProfile')}
              </h1>
              <p className="text-gray-600 mb-2">
                {t('completeProfileForPersonalization')}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{t('completion')}:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[120px]">
                  <div 
                    className="bg-fitness-gradient h-2 rounded-full transition-all duration-300"
                    style={{ width: `${profileCompleteness}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-800">{profileCompleteness}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfilePageHeader;
