
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Save } from "lucide-react";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";
import { useState } from "react";
import { toast } from "sonner";

const ProfileHealthTab = () => {
  const { assessment, saveAssessment, isSaving } = useHealthAssessment();
  
  const [healthData, setHealthData] = useState({
    chronic_conditions: assessment?.chronic_conditions || [],
    medications: assessment?.medications || [],
    injuries: assessment?.injuries || [],
    physical_limitations: assessment?.physical_limitations || [],
    stress_level: assessment?.stress_level || 5,
    sleep_quality: assessment?.sleep_quality || 7,
    energy_level: assessment?.energy_level || 7,
    work_schedule: assessment?.work_schedule || '',
    exercise_history: assessment?.exercise_history || '',
    nutrition_knowledge: assessment?.nutrition_knowledge || '',
    cooking_skills: assessment?.cooking_skills || '',
    time_availability: assessment?.time_availability || '',
    primary_motivation: assessment?.primary_motivation || [],
    specific_goals: assessment?.specific_goals || [],
    timeline_expectation: assessment?.timeline_expectation || '',
    commitment_level: assessment?.commitment_level || 7,
  });

  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setHealthData(prev => ({ ...prev, [field]: arrayValue }));
  };

  const handleSave = async () => {
    try {
      await saveAssessment(healthData);
      toast.success('Health assessment saved successfully!');
    } catch (error) {
      console.error('Error saving health assessment:', error);
      toast.error('Failed to save health assessment');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Health Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Work Schedule</Label>
              <Select 
                value={healthData.work_schedule} 
                onValueChange={(value) => setHealthData(prev => ({ ...prev, work_schedule: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select work schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desk_job">Desk Job (Sedentary)</SelectItem>
                  <SelectItem value="active_job">Active Job</SelectItem>
                  <SelectItem value="shift_work">Shift Work</SelectItem>
                  <SelectItem value="flexible">Flexible Schedule</SelectItem>
                  <SelectItem value="unemployed">Unemployed/Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Exercise History</Label>
              <Select 
                value={healthData.exercise_history} 
                onValueChange={(value) => setHealthData(prev => ({ ...prev, exercise_history: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (0-6 months)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (6 months - 2 years)</SelectItem>
                  <SelectItem value="advanced">Advanced (2+ years)</SelectItem>
                  <SelectItem value="athlete">Competitive Athlete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Nutrition Knowledge</Label>
              <Select 
                value={healthData.nutrition_knowledge} 
                onValueChange={(value) => setHealthData(prev => ({ ...prev, nutrition_knowledge: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select nutrition knowledge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None/Minimal</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Cooking Skills</Label>
              <Select 
                value={healthData.cooking_skills} 
                onValueChange={(value) => setHealthData(prev => ({ ...prev, cooking_skills: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cooking level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None/Minimal</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Time Availability</Label>
              <Select 
                value={healthData.time_availability} 
                onValueChange={(value) => setHealthData(prev => ({ ...prev, time_availability: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="limited">Limited (15-30 min/day)</SelectItem>
                  <SelectItem value="moderate">Moderate (30-60 min/day)</SelectItem>
                  <SelectItem value="flexible">Flexible (60+ min/day)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Timeline Expectation</Label>
              <Select 
                value={healthData.timeline_expectation} 
                onValueChange={(value) => setHealthData(prev => ({ ...prev, timeline_expectation: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1_month">1 Month</SelectItem>
                  <SelectItem value="3_months">3 Months</SelectItem>
                  <SelectItem value="6_months">6 Months</SelectItem>
                  <SelectItem value="1_year">1 Year</SelectItem>
                  <SelectItem value="long_term">Long Term (1+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Chronic Conditions</Label>
            <Textarea
              value={healthData.chronic_conditions.join(', ')}
              onChange={(e) => handleArrayInput('chronic_conditions', e.target.value)}
              placeholder="Enter any chronic conditions, separated by commas"
              rows={2}
            />
          </div>

          <div>
            <Label>Medications</Label>
            <Textarea
              value={healthData.medications.join(', ')}
              onChange={(e) => handleArrayInput('medications', e.target.value)}
              placeholder="Enter any medications, separated by commas"
              rows={2}
            />
          </div>

          <div>
            <Label>Injuries</Label>
            <Textarea
              value={healthData.injuries.join(', ')}
              onChange={(e) => handleArrayInput('injuries', e.target.value)}
              placeholder="Enter any injuries, separated by commas"
              rows={2}
            />
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full md:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Health Assessment'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileHealthTab;
