
import { Target, User } from "lucide-react";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import BodyFatSlider from "./BodyFatSlider";
import EnhancedMotivationSelector from "./EnhancedMotivationSelector";

interface EnhancedOnboardingStep2Props {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const EnhancedOnboardingStep2 = ({ formData, updateFormData }: EnhancedOnboardingStep2Props) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Your Body Composition</h2>
        <p className="text-gray-600 text-sm md:text-base">Help us understand your current body composition and motivation</p>
      </div>

      {/* Body Composition Section */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 md:p-6 border border-blue-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">Body Composition *</h3>
            <p className="text-sm text-gray-600">Select your current body fat percentage and body type</p>
          </div>
        </div>
        <BodyFatSlider
          value={parseInt(formData.body_fat_percentage) || 25}
          onChange={(value) => {
            updateFormData("body_fat_percentage", value.toString());
            // Auto-set body shape based on body fat percentage
            let bodyShape = "average";
            if (formData.gender === "male") {
              if (value <= 10) bodyShape = "very_slim";
              else if (value <= 15) bodyShape = "slim";
              else if (value <= 18) bodyShape = "athletic";
              else if (value <= 25) bodyShape = "average";
              else if (value <= 30) bodyShape = "curvy";
              else bodyShape = "heavy";
            } else {
              if (value <= 15) bodyShape = "very_slim";
              else if (value <= 20) bodyShape = "slim";
              else if (value <= 25) bodyShape = "athletic";
              else if (value <= 30) bodyShape = "average";
              else if (value <= 35) bodyShape = "curvy";
              else bodyShape = "heavy";
            }
            updateFormData("body_shape", bodyShape);
          }}
          gender={formData.gender}
        />
      </div>

      {/* Motivation Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 md:p-6 border border-purple-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">What Motivates You?</h3>
            <p className="text-sm text-gray-600">Select what drives your fitness journey</p>
          </div>
        </div>
        <EnhancedMotivationSelector
          value={Array.isArray(formData.preferred_foods) ? formData.preferred_foods : []}
          onChange={(value) => updateFormData("preferred_foods", value)}
        />
      </div>

      {/* Progress Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-indigo-800 mb-1">Personalized Plans</h4>
            <p className="text-sm text-indigo-700">Your body composition and motivations help us create the perfect nutrition and workout plans for you.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOnboardingStep2;
