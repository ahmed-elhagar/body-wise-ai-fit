
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";

interface LifePhaseFormProps {
  fastingType?: string;
  pregnancyTrimester?: number;
  breastfeedingLevel?: string;
  conditionStartDate?: string;
  onFastingTypeChange: (value: string) => void;
  onPregnancyTrimesterChange: (value: number) => void;
  onBreastfeedingLevelChange: (value: string) => void;
  onConditionStartDateChange: (value: string) => void;
}

export const LifePhaseForm = ({
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
          <Heart className="w-5 h-5" />
          Life Phase Nutrition
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fasting_type">Fasting Type</Label>
            <Select value={fastingType || ""} onValueChange={onFastingTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select fasting type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Fasting</SelectItem>
                <SelectItem value="intermittent_16_8">Intermittent 16:8</SelectItem>
                <SelectItem value="intermittent_18_6">Intermittent 18:6</SelectItem>
                <SelectItem value="omad">One Meal A Day (OMAD)</SelectItem>
                <SelectItem value="alternate_day">Alternate Day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="pregnancy_trimester">Pregnancy Trimester</Label>
            <Select 
              value={pregnancyTrimester?.toString() || ""} 
              onValueChange={(value) => onPregnancyTrimesterChange(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trimester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Not Pregnant</SelectItem>
                <SelectItem value="1">First Trimester</SelectItem>
                <SelectItem value="2">Second Trimester</SelectItem>
                <SelectItem value="3">Third Trimester</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="breastfeeding_level">Breastfeeding Level</Label>
            <Select value={breastfeedingLevel || ""} onValueChange={onBreastfeedingLevelChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select breastfeeding level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not Breastfeeding</SelectItem>
                <SelectItem value="exclusive">Exclusive Breastfeeding</SelectItem>
                <SelectItem value="partial">Partial Breastfeeding</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="condition_start_date">Condition Start Date</Label>
            <Input
              id="condition_start_date"
              type="date"
              value={conditionStartDate || ''}
              onChange={(e) => onConditionStartDateChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
