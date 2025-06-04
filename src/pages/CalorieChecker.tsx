
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Camera, Utensils } from "lucide-react";
import FoodPhotoAnalyzer from "@/components/calorie/FoodPhotoAnalyzer";
import FoodConsumptionTracker from "@/components/calorie/FoodConsumptionTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

const CalorieChecker = () => {
  const { t } = useLanguage();
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <PageHeader
            title={t('Calorie Checker')}
            description={t('Analyze food photos and track your calorie intake with AI-powered recognition')}
            icon={<Camera className="h-6 w-6 text-blue-600" />}
          />

          <div className="max-w-7xl mx-auto p-4 md:p-6">
            <Tabs defaultValue="photo-analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md bg-white/80 backdrop-blur-sm">
                <TabsTrigger value="photo-analysis" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('Photo Analysis')}</span>
                </TabsTrigger>
                <TabsTrigger value="food-tracker" className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('Food Tracker')}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="photo-analysis" className="mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 p-6">
                  <FoodPhotoAnalyzer />
                </div>
              </TabsContent>

              <TabsContent value="food-tracker" className="mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 p-6">
                  <FoodConsumptionTracker />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CalorieChecker;
