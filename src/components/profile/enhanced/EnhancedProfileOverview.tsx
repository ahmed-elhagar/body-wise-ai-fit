
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";

const EnhancedProfileOverview = () => {
  const { profile } = useProfile();
  const { assessment } = useHealthAssessment();

  const calculateHealthScore = () => {
    if (!profile || !assessment) return 0;
    
    let score = 0;
    
    // Basic info completeness (30 points)
    if (profile.first_name && profile.last_name) score += 5;
    if (profile.age) score += 5;
    if (profile.gender) score += 5;
    if (profile.height && profile.weight) score += 10;
    if (profile.fitness_goal) score += 5;
    
    // Health assessment completeness (40 points)
    if (assessment.stress_level) score += 10;
    if (assessment.sleep_quality) score += 10;
    if (assessment.energy_level) score += 10;
    if (assessment.exercise_history) score += 10;
    
    // Lifestyle factors (30 points)
    if (profile.activity_level) score += 10;
    if (assessment.nutrition_knowledge) score += 10;
    if (assessment.time_availability) score += 10;
    
    return Math.min(score, 100);
  };

  const calculateFitnessReadiness = () => {
    if (!profile || !assessment) return 0;
    
    let readiness = 85; // Base readiness
    
    // Reduce based on health conditions
    if (profile.health_conditions && profile.health_conditions.length > 0) {
      readiness -= profile.health_conditions.length * 5;
    }
    
    // Adjust based on activity level
    if (profile.activity_level === 'sedentary') readiness -= 10;
    if (profile.activity_level === 'very_active') readiness += 5;
    
    // Adjust based on stress and sleep
    if (assessment.stress_level && assessment.stress_level > 7) readiness -= 10;
    if (assessment.sleep_quality && assessment.sleep_quality < 6) readiness -= 10;
    
    return Math.max(Math.min(readiness, 100), 0);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Overview</h2>
      <p className="text-gray-600 mb-6">
        Your comprehensive health and fitness profile overview with AI-powered insights.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Health Score</h3>
          <p className="text-2xl font-bold text-blue-600">{calculateHealthScore()}/100</p>
          <p className="text-sm text-blue-600">
            {calculateHealthScore() >= 80 ? 'Excellent health profile' : 
             calculateHealthScore() >= 60 ? 'Good health profile' : 
             'Complete more sections to improve'}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Fitness Readiness</h3>
          <p className="text-2xl font-bold text-green-600">{calculateFitnessReadiness()}/100</p>
          <p className="text-sm text-green-600">
            {calculateFitnessReadiness() >= 80 ? 'Ready for intense exercise' : 
             calculateFitnessReadiness() >= 60 ? 'Ready for moderate exercise' : 
             'Start with light activities'}
          </p>
        </div>
      </div>
      
      {/* AI Integration Data Summary */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="font-semibold text-purple-800 mb-2">AI Integration Status</h3>
        <p className="text-sm text-purple-600 mb-2">
          Your profile data is being used to personalize AI recommendations for:
        </p>
        <ul className="text-sm text-purple-600 list-disc list-inside space-y-1">
          <li>Meal plans based on your preferences and restrictions</li>
          <li>Exercise programs tailored to your fitness level</li>
          <li>Health insights considering your conditions and goals</li>
          <li>Progress tracking aligned with your objectives</li>
        </ul>
      </div>
    </Card>
  );
};

export default EnhancedProfileOverview;
