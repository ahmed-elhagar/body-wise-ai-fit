
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Heart } from "lucide-react";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { toast } from "sonner";

const CompactHealthAssessmentForm = () => {
  const { assessment, saveAssessment, isSaving } = useHealthAssessment();
  const { markStepComplete } = useOnboardingProgress();
  
  const [formData, setFormData] = useState({
    chronic_conditions: [] as string[],
    medications: [] as string[],
    injuries: [] as string[],
    physical_limitations: [] as string[],
    stress_level: 5,
    sleep_quality: 7,
    energy_level: 7,
    work_schedule: '',
    exercise_history: '',
    nutrition_knowledge: '',
    cooking_skills: '',
    time_availability: '',
    primary_motivation: [] as string[],
    specific_goals: [] as string[],
    timeline_expectation: '',
    commitment_level: 7,
  });

  useEffect(() => {
    if (assessment) {
      console.log('CompactHealthAssessmentForm - Loading assessment:', assessment);
      setFormData({
        chronic_conditions: assessment.chronic_conditions || [],
        medications: assessment.medications || [],
        injuries: assessment.injuries || [],
        physical_limitations: assessment.physical_limitations || [],
        stress_level: assessment.stress_level || 5,
        sleep_quality: assessment.sleep_quality || 7,
        energy_level: assessment.energy_level || 7,
        work_schedule: assessment.work_schedule || '',
        exercise_history: assessment.exercise_history || '',
        nutrition_knowledge: assessment.nutrition_knowledge || '',
        cooking_skills: assessment.cooking_skills || '',
        time_availability: assessment.time_availability || '',
        primary_motivation: assessment.primary_motivation || [],
        specific_goals: assessment.specific_goals || [],
        timeline_expectation: assessment.timeline_expectation || '',
        commitment_level: assessment.commitment_level || 7,
      });
    }
  }, [assessment]);

  const calculateScores = () => {
    let healthScore = 50;
    healthScore += (formData.sleep_quality - 5) * 5;
    healthScore += (formData.energy_level - 5) * 3;
    healthScore -= (formData.stress_level - 5) * 4;
    healthScore -= formData.chronic_conditions.length * 5;
    healthScore -= formData.medications.length * 3;
    healthScore -= formData.injuries.length * 4;

    let readinessScore = 50;
    readinessScore += formData.commitment_level * 5;
    readinessScore += formData.energy_level * 3;
    if (formData.exercise_history === 'advanced' || formData.exercise_history === 'athlete') readinessScore += 15;
    if (formData.time_availability === 'flexible') readinessScore += 10;

    let riskScore = 10;
    riskScore += formData.chronic_conditions.length * 15;
    riskScore += formData.injuries.length * 10;
    riskScore += formData.physical_limitations.length * 8;
    riskScore += (10 - formData.sleep_quality) * 2;
    riskScore += formData.stress_level * 3;

    return {
      health_score: Math.max(0, Math.min(100, healthScore)),
      readiness_score: Math.max(0, Math.min(100, readinessScore)),
      risk_score: Math.max(0, Math.min(100, riskScore))
    };
  };

  const handleArrayInput = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: arrayValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = ['work_schedule', 'exercise_history', 'nutrition_knowledge', 'cooking_skills', 'time_availability', 'timeline_expectation'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === '');
    
    if (missingFields.length > 0) {
      toast.error('Please complete all required fields');
      console.log('Missing required fields:', missingFields);
      return;
    }
    
    try {
      const scores = calculateScores();
      const assessmentData = { ...formData, ...scores };
      
      console.log('CompactHealthAssessmentForm - Submitting:', assessmentData);
      
      await saveAssessment(assessmentData);
      console.log('CompactHealthAssessmentForm - Assessment saved, marking step complete');
      await markStepComplete('health_assessment');
      
      toast.success('Health assessment completed successfully!');
      
    } catch (error) {
      console.error('CompactHealthAssessmentForm - Save failed:', error);
      toast.error('Failed to save health assessment. Please try again.');
    }
  };

  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-bold text-gray-800">Health Assessment</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Health Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Chronic Conditions</Label>
            <Input
              placeholder="e.g., diabetes, hypertension"
              value={formData.chronic_conditions.join(', ')}
              onChange={(e) => handleArrayInput('chronic_conditions', e.target.value)}
              className="text-sm h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Current Medications</Label>
            <Input
              placeholder="e.g., metformin, lisinopril"
              value={formData.medications.join(', ')}
              onChange={(e) => handleArrayInput('medications', e.target.value)}
              className="text-sm h-8"
            />
          </div>
        </div>

        {/* Wellness Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Stress: {formData.stress_level}</Label>
            <Slider
              value={[formData.stress_level]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, stress_level: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Sleep: {formData.sleep_quality}</Label>
            <Slider
              value={[formData.sleep_quality]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, sleep_quality: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Energy: {formData.energy_level}</Label>
            <Slider
              value={[formData.energy_level]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, energy_level: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="mt-1"
            />
          </div>
        </div>

        {/* Lifestyle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Work Schedule *</Label>
            <Select value={formData.work_schedule} onValueChange={(value) => setFormData(prev => ({ ...prev, work_schedule: value }))}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select work schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular_9_5">Regular 9-5</SelectItem>
                <SelectItem value="shift_work">Shift Work</SelectItem>
                <SelectItem value="flexible">Flexible Hours</SelectItem>
                <SelectItem value="part_time">Part Time</SelectItem>
                <SelectItem value="unemployed">Unemployed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Exercise History *</Label>
            <Select value={formData.exercise_history} onValueChange={(value) => setFormData(prev => ({ ...prev, exercise_history: value }))}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner (0-6 months)</SelectItem>
                <SelectItem value="intermediate">Intermediate (6-24 months)</SelectItem>
                <SelectItem value="advanced">Advanced (2+ years)</SelectItem>
                <SelectItem value="athlete">Competitive Athlete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Knowledge & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Nutrition Knowledge *</Label>
            <Select value={formData.nutrition_knowledge} onValueChange={(value) => setFormData(prev => ({ ...prev, nutrition_knowledge: value }))}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Cooking Skills *</Label>
            <Select value={formData.cooking_skills} onValueChange={(value) => setFormData(prev => ({ ...prev, cooking_skills: value }))}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Time Availability *</Label>
            <Select value={formData.time_availability} onValueChange={(value) => setFormData(prev => ({ ...prev, time_availability: value }))}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="limited">Limited (1-2 hours/week)</SelectItem>
                <SelectItem value="moderate">Moderate (3-5 hours/week)</SelectItem>
                <SelectItem value="flexible">Flexible (5+ hours/week)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Timeline Expectation *</Label>
            <Select value={formData.timeline_expectation} onValueChange={(value) => setFormData(prev => ({ ...prev, timeline_expectation: value }))}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1_month">1 Month</SelectItem>
                <SelectItem value="3_months">3 Months</SelectItem>
                <SelectItem value="6_months">6 Months</SelectItem>
                <SelectItem value="1_year">1 Year</SelectItem>
                <SelectItem value="ongoing">Ongoing Lifestyle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Commitment Level */}
        <div>
          <Label className="text-xs">Commitment Level: {formData.commitment_level}/10</Label>
          <Slider
            value={[formData.commitment_level]}
            onValueChange={(value) => setFormData(prev => ({ ...prev, commitment_level: value[0] }))}
            max={10}
            min={1}
            step={1}
            className="mt-1"
          />
        </div>

        {/* Primary Motivation - Fixed spacing issue */}
        <div>
          <Label className="text-xs">Primary Motivation</Label>
          <Textarea
            placeholder="Describe what motivates you to achieve your fitness goals"
            value={formData.primary_motivation.join(', ')}
            onChange={(e) => handleArrayInput('primary_motivation', e.target.value)}
            className="text-sm h-16 resize-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            disabled={isSaving} 
            className="bg-fitness-gradient hover:opacity-90 h-8 px-4 text-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Assessment'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CompactHealthAssessmentForm;
