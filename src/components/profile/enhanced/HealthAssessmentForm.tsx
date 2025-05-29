
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";

const HealthAssessmentForm = () => {
  const { assessment, saveAssessment, isSaving } = useHealthAssessment();
  const { markStepComplete } = useOnboardingProgress();
  
  const [formData, setFormData] = useState({
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

  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newInjury, setNewInjury] = useState('');
  const [newLimitation, setNewLimitation] = useState('');
  const [newMotivation, setNewMotivation] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const addArrayItem = (field: string, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev] as string[], value.trim()]
      }));
      setter('');
    }
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const assessmentData = {
      ...formData,
      assessment_type: 'onboarding',
      health_score: calculateHealthScore(),
      readiness_score: calculateReadinessScore(),
      risk_score: calculateRiskScore(),
    };

    saveAssessment(assessmentData);
    markStepComplete('health_assessment');
  };

  const calculateHealthScore = () => {
    let score = 50; // Base score
    
    // Positive factors
    score += (formData.sleep_quality - 5) * 5;
    score += (formData.energy_level - 5) * 3;
    score -= (formData.stress_level - 5) * 4;
    
    // Health conditions impact
    score -= formData.chronic_conditions.length * 5;
    score -= formData.medications.length * 3;
    score -= formData.injuries.length * 4;
    
    return Math.max(0, Math.min(100, score));
  };

  const calculateReadinessScore = () => {
    let score = 50;
    
    score += formData.commitment_level * 5;
    score += formData.energy_level * 3;
    
    if (formData.exercise_history === 'advanced' || formData.exercise_history === 'athlete') score += 15;
    if (formData.time_availability === 'flexible') score += 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const calculateRiskScore = () => {
    let score = 10; // Base low risk
    
    score += formData.chronic_conditions.length * 15;
    score += formData.injuries.length * 10;
    score += formData.physical_limitations.length * 8;
    score += (10 - formData.sleep_quality) * 2;
    score += formData.stress_level * 3;
    
    return Math.max(0, Math.min(100, score));
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Health Assessment</h2>
        <p className="text-gray-600">Help us understand your health status and lifestyle to create a personalized plan.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Health Conditions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Health Information</h3>
          
          <div>
            <Label htmlFor="chronic_conditions">Chronic Conditions</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add condition (e.g., diabetes, hypertension)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('chronic_conditions', newCondition, setNewCondition))}
              />
              <Button 
                type="button" 
                onClick={() => addArrayItem('chronic_conditions', newCondition, setNewCondition)}
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.chronic_conditions.map((condition, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {condition}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeArrayItem('chronic_conditions', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="medications">Current Medications</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                placeholder="Add medication"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('medications', newMedication, setNewMedication))}
              />
              <Button 
                type="button" 
                onClick={() => addArrayItem('medications', newMedication, setNewMedication)}
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.medications.map((medication, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {medication}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeArrayItem('medications', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Wellness Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Wellness Metrics</h3>
          
          <div>
            <Label>Stress Level: {formData.stress_level}/10</Label>
            <Slider
              value={[formData.stress_level]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, stress_level: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Sleep Quality: {formData.sleep_quality}/10</Label>
            <Slider
              value={[formData.sleep_quality]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, sleep_quality: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Energy Level: {formData.energy_level}/10</Label>
            <Slider
              value={[formData.energy_level]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, energy_level: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
        </div>

        {/* Lifestyle Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Lifestyle</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="work_schedule">Work Schedule</Label>
              <Select value={formData.work_schedule} onValueChange={(value) => setFormData(prev => ({ ...prev, work_schedule: value }))}>
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
              <Label htmlFor="exercise_history">Exercise History</Label>
              <Select value={formData.exercise_history} onValueChange={(value) => setFormData(prev => ({ ...prev, exercise_history: value }))}>
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
              <Label htmlFor="cooking_skills">Cooking Skills</Label>
              <Select value={formData.cooking_skills} onValueChange={(value) => setFormData(prev => ({ ...prev, cooking_skills: value }))}>
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
              <Label htmlFor="time_availability">Time Availability</Label>
              <Select value={formData.time_availability} onValueChange={(value) => setFormData(prev => ({ ...prev, time_availability: value }))}>
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
          </div>
        </div>

        {/* Goals and Motivation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Goals & Motivation</h3>
          
          <div>
            <Label>Commitment Level: {formData.commitment_level}/10</Label>
            <Slider
              value={[formData.commitment_level]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, commitment_level: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="timeline_expectation">Timeline Expectation</Label>
            <Select value={formData.timeline_expectation} onValueChange={(value) => setFormData(prev => ({ ...prev, timeline_expectation: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1_month">1 Month</SelectItem>
                <SelectItem value="3_months">3 Months</SelectItem>
                <SelectItem value="6_months">6 Months</SelectItem>
                <SelectItem value="1_year">1 Year</SelectItem>
                <SelectItem value="long_term">Long-term (1+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="bg-fitness-gradient">
            {isSaving ? 'Saving...' : 'Save Health Assessment'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default HealthAssessmentForm;
