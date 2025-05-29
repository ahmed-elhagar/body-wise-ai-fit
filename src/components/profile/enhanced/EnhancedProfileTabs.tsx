
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, User, Heart, Target, Settings, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import BasicInfoCard from "@/components/profile/BasicInfoCard";
import HealthGoalsCard from "@/components/profile/HealthGoalsCard";
import HealthAssessmentForm from "./HealthAssessmentForm";
import EnhancedProfileOverview from "./EnhancedProfileOverview";

interface EnhancedProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: any;
  updateFormData: (field: string, value: string) => void;
  handleArrayInput: (field: string, value: string) => void;
  handleSave: () => void;
  isUpdating: boolean;
}

const EnhancedProfileTabs = ({
  activeTab,
  setActiveTab,
  formData,
  updateFormData,
  handleArrayInput,
  handleSave,
  isUpdating,
}: EnhancedProfileTabsProps) => {
  const { t } = useLanguage();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-5 mb-6">
        <TabsTrigger value="overview" className="flex items-center text-xs lg:text-sm">
          <BarChart3 className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
          <span className="hidden sm:inline">{t('overview')}</span>
        </TabsTrigger>
        <TabsTrigger value="basic" className="flex items-center text-xs lg:text-sm">
          <User className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
          <span className="hidden sm:inline">{t('basic')}</span>
        </TabsTrigger>
        <TabsTrigger value="health" className="flex items-center text-xs lg:text-sm">
          <Heart className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
          <span className="hidden sm:inline">{t('health')}</span>
        </TabsTrigger>
        <TabsTrigger value="goals" className="flex items-center text-xs lg:text-sm">
          <Target className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
          <span className="hidden sm:inline">{t('goals')}</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center text-xs lg:text-sm">
          <Settings className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
          <span className="hidden sm:inline">{t('settings')}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <EnhancedProfileOverview />
      </TabsContent>

      <TabsContent value="basic" className="mt-6">
        <BasicInfoCard formData={formData} updateFormData={updateFormData} />
        <div className="mt-6 flex gap-3 justify-end">
          <Button 
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-fitness-gradient"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('saving')}...
              </>
            ) : (
              t('save')
            )}
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="health" className="mt-6">
        <HealthAssessmentForm />
      </TabsContent>

      <TabsContent value="goals" className="mt-6">
        <HealthGoalsCard 
          formData={formData} 
          updateFormData={updateFormData}
          handleArrayInput={handleArrayInput}
        />
        <div className="mt-6 flex gap-3 justify-end">
          <Button 
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-fitness-gradient"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('saving')}...
              </>
            ) : (
              t('save')
            )}
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('preferencesSettings')}</h2>
          <p className="text-gray-600">
            {t('configureAppPreferences')}
          </p>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default EnhancedProfileTabs;
