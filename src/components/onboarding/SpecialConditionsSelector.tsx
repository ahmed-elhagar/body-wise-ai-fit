
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface SpecialConditionsSelectorProps {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string) => void;
}

const SpecialConditionsSelector = ({ formData, updateFormData }: SpecialConditionsSelectorProps) => {
  return (
    <div className="space-y-6">
      {/* Pregnancy Section */}
      {formData.gender === 'female' && (
        <Card className="p-4 space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Pregnancy Status (Optional)
            </Label>
            
            <Select 
              value={formData.pregnancy_trimester} 
              onValueChange={(value) => updateFormData("pregnancy_trimester", value)}
            >
              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl">
                <SelectValue placeholder="Select pregnancy status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not pregnant</SelectItem>
                <SelectItem value="1">First trimester (1-12 weeks)</SelectItem>
                <SelectItem value="2">Second trimester (13-26 weeks)</SelectItem>
                <SelectItem value="3">Third trimester (27-40 weeks)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Breastfeeding Status (Optional)
            </Label>
            
            <Select 
              value={formData.breastfeeding_level} 
              onValueChange={(value) => updateFormData("breastfeeding_level", value)}
            >
              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl">
                <SelectValue placeholder="Select breastfeeding status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not breastfeeding</SelectItem>
                <SelectItem value="exclusive">Exclusive breastfeeding</SelectItem>
                <SelectItem value="partial">Partial breastfeeding</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      )}

      {/* Fasting Section */}
      <Card className="p-4 space-y-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Fasting Preferences (Optional)
          </Label>
          
          <Select 
            value={formData.fasting_type} 
            onValueChange={(value) => updateFormData("fasting_type", value)}
          >
            <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl">
              <SelectValue placeholder="Select fasting type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No fasting</SelectItem>
              <SelectItem value="16_8">16:8 Intermittent Fasting</SelectItem>
              <SelectItem value="18_6">18:6 Intermittent Fasting</SelectItem>
              <SelectItem value="20_4">20:4 Intermittent Fasting</SelectItem>
              <SelectItem value="omad">One Meal A Day (OMAD)</SelectItem>
              <SelectItem value="ramadan">Ramadan Fasting</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <p className="text-xs text-gray-500 text-center">
        This information helps us create personalized nutrition and exercise plans that are safe and effective for your specific situation.
      </p>
    </div>
  );
};

export default SpecialConditionsSelector;
