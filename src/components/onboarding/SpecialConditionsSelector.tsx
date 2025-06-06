
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import { Baby, Heart, Utensils } from "lucide-react";

interface SpecialConditionsSelectorProps {
  formData: OnboardingFormData;
  updateFormData: (field: string, value: string | string[]) => void;
}

const SpecialConditionsSelector = ({ formData, updateFormData }: SpecialConditionsSelectorProps) => {
  const isFemale = formData.gender === 'female';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Pregnancy Section - Only for females */}
      {isFemale && (
        <Card className="p-3 sm:p-4 border-2 border-pink-200 bg-pink-50/50">
          <div className="flex items-center gap-2 mb-3">
            <Baby className="w-4 h-4 text-pink-600" />
            <Label className="text-sm font-medium text-gray-700">Pregnancy Status</Label>
          </div>
          <Select
            value={formData.pregnancy_trimester || 'none'}
            onValueChange={(value) => updateFormData("pregnancy_trimester", value)}
          >
            <SelectTrigger className="border-pink-300 focus:border-pink-500 h-11 text-base">
              <SelectValue placeholder="Select if pregnant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not pregnant</SelectItem>
              <SelectItem value="1">First trimester (1-12 weeks)</SelectItem>
              <SelectItem value="2">Second trimester (13-26 weeks)</SelectItem>
              <SelectItem value="3">Third trimester (27+ weeks)</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      )}

      {/* Breastfeeding Section - Only for females */}
      {isFemale && (
        <Card className="p-3 sm:p-4 border-2 border-blue-200 bg-blue-50/50">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-blue-600" />
            <Label className="text-sm font-medium text-gray-700">Breastfeeding Status</Label>
          </div>
          <Select
            value={formData.breastfeeding_level || 'none'}
            onValueChange={(value) => updateFormData("breastfeeding_level", value)}
          >
            <SelectTrigger className="border-blue-300 focus:border-blue-500 h-11 text-base">
              <SelectValue placeholder="Select breastfeeding status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not breastfeeding</SelectItem>
              <SelectItem value="exclusive">Exclusively breastfeeding</SelectItem>
              <SelectItem value="partial">Partially breastfeeding</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      )}

      {/* Fasting Section - For everyone */}
      <Card className="p-3 sm:p-4 border-2 border-green-200 bg-green-50/50">
        <div className="flex items-center gap-2 mb-3">
          <Utensils className="w-4 h-4 text-green-600" />
          <Label className="text-sm font-medium text-gray-700">Intermittent Fasting</Label>
        </div>
        <Select
          value={formData.fasting_type || 'none'}
          onValueChange={(value) => updateFormData("fasting_type", value)}
        >
          <SelectTrigger className="border-green-300 focus:border-green-500 h-11 text-base">
            <SelectValue placeholder="Select fasting type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No fasting</SelectItem>
            <SelectItem value="16_8">16:8 (16 hours fasting, 8 hours eating)</SelectItem>
            <SelectItem value="18_6">18:6 (18 hours fasting, 6 hours eating)</SelectItem>
            <SelectItem value="20_4">20:4 (20 hours fasting, 4 hours eating)</SelectItem>
            <SelectItem value="omad">OMAD (One meal a day)</SelectItem>
            <SelectItem value="5_2">5:2 (5 days normal, 2 days reduced calories)</SelectItem>
          </SelectContent>
        </Select>
      </Card>
    </div>
  );
};

export default SpecialConditionsSelector;
