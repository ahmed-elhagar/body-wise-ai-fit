import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FoodPhotoAnalyzer } from "@/features/food-tracker";
import { Camera, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const CalorieChecker = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleFoodAnalyzed = (food: any) => {
    // Navigate to food tracker with the analyzed food data
    toast.success(t('Food analyzed! Redirecting to Food Tracker to log it.'));
    setTimeout(() => {
      navigate('/food-tracker', { 
        state: { 
          analyzedFood: food,
          openAddDialog: true 
        } 
      });
    }, 1500);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
          <PageHeader
            title={t('AI Food Scanner')}
            description={t('Analyze food photos with AI-powered recognition and get instant nutrition information')}
            icon={<Camera className="h-6 w-6 text-purple-600" />}
          />

          <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 p-6">
              <FoodPhotoAnalyzer onSelectFood={handleFoodAnalyzed} />
            </div>

            {/* Info Card */}
            <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {t('How it works')}
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {t('Take a photo of your food or upload an existing image')}</li>
                    <li>• {t('Our AI analyzes the image and identifies food items')}</li>
                    <li>• {t('Get instant nutrition information and calorie estimates')}</li>
                    <li>• {t('Add analyzed foods directly to your food tracker')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CalorieChecker;
