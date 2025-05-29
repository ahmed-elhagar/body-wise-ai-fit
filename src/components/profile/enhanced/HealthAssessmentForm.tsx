
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { toast } from "sonner";
import HealthConditionsSection from "./health/HealthConditionsSection";
import WellnessMetricsSection from "./health/WellnessMetricsSection";
import LifestyleSection from "./health/LifestyleSection";
import GoalsMotivationSection from "./health/GoalsMotivationSection";

const HealthAssessmentForm = () => {
  const { assessment, saveAssessment, isSaving } = useHealthAssessment();
  const { markStepComplete } = useOnboardingProgress();
  
  const [formData, setFormData] = useState({
    chronic_conditions: [],
    medications: [],
    injuries: [],
    physical_limitations: [],
    stress_level: 5,
    sleep_quality: 7,
    energy_level: 7,
    work_schedule: '',
    exercise_history: '',
    nutrition_knowledge: '',
    cooking_skills: '',
    time_availability: '',
    primary_motivation: [],
    specific_goals: [],
    timeline_expectation: '',
    commitment_level: 7,
  });

  // Sync form data with assessment data when component mounts or assessment changes
  useEffect(() => {
    if (assessment) {
      console.log('HealthAssessmentForm - Loading existing assessment data:', assessment);
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

  const calculateHealthScore = () => {
    let score = 50;
    score += (formData.sleep_quality - 5) * 5;
    score += (formData.energy_level - 5) * 3;
    score -= (formData.stress_level - 5) * 4;
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
    let score = 10;
    score += formData.chronic_conditions.length * 15;
    score += formData.injuries.length * 10;
    score += formData.physical_limitations.length * 8;
    score += (10 - formData.sleep_quality) * 2;
    score += formData.stress_level * 3;
    return Math.max(0, Math.min(100, score));
  };

  const validateForm = () => {
    // Check required fields
    const requiredFields = [
      'work_schedule',
      'exercise_history', 
      'nutrition_knowledge',
      'cooking_skills',
      'time_availability',
      'timeline_expectation'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === '') {
        toast.error(`Please complete all required fields`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const assessmentData = {
        ...formData,
        assessment_type: 'enhanced_profile',
        health_score: calculateHealthScore(),
        readiness_score: calculateReadinessScore(),
        risk_score: calculateRiskScore(),
      };

      console.log('HealthAssessmentForm - Submitting assessment data:', assessmentData);
      
      // Save the assessment using the mutation
      await new Promise((resolve, reject) => {
        const unsubscribe = () => {};
        
        try {
          saveAssessment(assessmentData);
          // Since the mutation doesn't return a promise directly, we'll resolve immediately
          // The actual success/error handling is done in the mutation callbacks
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });

      // Mark the health assessment step as complete
      console.log('HealthAssessmentForm - Marking health assessment step as complete');
      markStepComplete('health_assessment');
      
      toast.success('Health assessment saved successfully!');
      
    } catch (error) {
      console.error('HealthAssessmentForm - Failed to save health assessment:', error);
      toast.error('Failed to save health assessment. Please try again.');
    }
  };

  return (
    <Card className="p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Health Assessment</h2>
        <p className="text-sm lg:text-base text-gray-600">
          Help us understand your health status and lifestyle for better AI recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <HealthConditionsSection formData={formData} setFormData={setFormData} />
        <WellnessMetricsSection formData={formData} setFormData={setFormData} />
        <LifestyleSection formData={formData} setFormData={setFormData} />
        <GoalsMotivationSection formData={formData} setFormData={setFormData} />

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={isSaving} 
            className="bg-fitness-gradient hover:opacity-90 w-full md:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Health Assessment'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default HealthAssessmentForm;
