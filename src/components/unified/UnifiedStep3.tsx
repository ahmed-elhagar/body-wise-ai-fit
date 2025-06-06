
import { Gauge } from "lucide-react";
import { UnifiedFormData } from "@/hooks/useUnifiedForm";
import UnifiedBodyShapeSelector from "./UnifiedBodyShapeSelector";

interface UnifiedStep3Props {
  formData: UnifiedFormData;
  updateFormData: (field: string, value: string | number) => void;
}

const UnifiedStep3 = ({ formData, updateFormData }: UnifiedStep3Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <Gauge className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Body Composition</h2>
        <p className="text-gray-600">Choose your body type and adjust the body fat slider</p>
      </div>

      <UnifiedBodyShapeSelector
        bodyShape={formData.body_shape}
        bodyFatPercentage={
          typeof formData.body_fat_percentage === 'string' 
            ? parseFloat(formData.body_fat_percentage) || (formData.gender === 'male' ? 20 : 25)
            : formData.body_fat_percentage || (formData.gender === 'male' ? 20 : 25)
        }
        gender={formData.gender}
        onBodyShapeChange={(value) => updateFormData("body_shape", value)}
        onBodyFatChange={(value) => updateFormData("body_fat_percentage", value)}
      />
    </div>
  );
};

export default UnifiedStep3;
