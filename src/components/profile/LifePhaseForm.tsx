
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface LifePhaseFormProps {
  fastingType?: string;
  pregnancyTrimester?: string;
  breastfeedingLevel?: string;
  conditionStartDate?: string;
  onFastingTypeChange: (value: string) => void;
  onPregnancyTrimesterChange: (value: string) => void;
  onBreastfeedingLevelChange: (value: string) => void;
  onConditionStartDateChange: (value: string) => void;
}

const LifePhaseForm = ({
  fastingType,
  pregnancyTrimester,
  breastfeedingLevel,
  conditionStartDate,
  onFastingTypeChange,
  onPregnancyTrimesterChange,
  onBreastfeedingLevelChange,
  onConditionStartDateChange
}: LifePhaseFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Life Phase Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Life phase form coming soon!</p>
      </CardContent>
    </Card>
  );
};

export { LifePhaseForm };
export default LifePhaseForm;
