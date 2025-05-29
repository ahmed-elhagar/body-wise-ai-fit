
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Heart, Target, Settings, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EnhancedBasicInfoForm from "./EnhancedBasicInfoForm";
import EnhancedGoalsForm from "./EnhancedGoalsForm";
import HealthAssessmentForm from "./HealthAssessmentForm";
import EnhancedProfileOverview from "./EnhancedProfileOverview";

interface EnhancedProfileTabsContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: any;
  updateFormData: (field: string, value: string) => void;
  handleArrayInput: (field: string, value: string) => void;
  saveBasicInfo: () => void;
  saveGoalsAndActivity: () => void;
  isUpdating: boolean;
}

const EnhancedProfileTabsContainer = ({
  activeTab,
  setActiveTab,
  formData,
  updateFormData,
  handleArrayInput,
  saveBasicInfo,
  saveGoalsAndActivity,
  isUpdating,
}: EnhancedProfileTabsContainerProps) => {
  const { t } = useLanguage();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-6">
        <TabsTrigger value="overview" className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">{t('overview')}</span>
        </TabsTrigger>
        <TabsTrigger value="basic" className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">{t('basic')}</span>
        </TabsTrigger>
        <TabsTrigger value="health" className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          <span className="hidden sm:inline">{t('health')}</span>
        </TabsTrigger>
        <TabsTrigger value="goals" className="flex items-center gap-1">
          <Target className="w-4 h-4" />
          <span className="hidden sm:inline">{t('goals')}</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-1">
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">{t('settings')}</span>
        </TabsTrigger>
      </TabsList>

      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 min-h-[600px]">
        <TabsContent value="overview" className="p-6 m-0">
          <EnhancedProfileOverview />
        </TabsContent>

        <TabsContent value="basic" className="p-6 m-0">
          <EnhancedBasicInfoForm
            formData={formData}
            updateFormData={updateFormData}
            onSave={saveBasicInfo}
            isUpdating={isUpdating}
          />
        </TabsContent>

        <TabsContent value="health" className="p-6 m-0">
          <HealthAssessmentForm />
        </TabsContent>

        <TabsContent value="goals" className="p-6 m-0">
          <EnhancedGoalsForm
            formData={formData}
            updateFormData={updateFormData}
            handleArrayInput={handleArrayInput}
            onSave={saveGoalsAndActivity}
            isUpdating={isUpdating}
          />
        </TabsContent>

        <TabsContent value="settings" className="p-6 m-0">
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">{t('settings')} {t('comingSoon')}</h3>
            <p className="text-gray-500">{t('configureAppPreferences')}</p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default EnhancedProfileTabsContainer;
