
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Heart, Target, TrendingUp, Shield } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";

const EnhancedProfileOverview = () => {
  const { profile } = useProfile();
  const { assessment } = useHealthAssessment();

  // Use same calculation logic as ProfileCompletionCard
  const calculateCompletionScore = () => {
    let totalFields = 0;
    let completedFields = 0;

    // Basic Information (8 required fields)
    const basicFields = ['first_name', 'last_name', 'age', 'gender', 'height', 'weight', 'nationality', 'body_shape'];
    basicFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile];
      if (value !== null && value !== undefined && value !== '') {
        completedFields++;
      }
    });

    // Goals & Activity (6 fields - 2 required + 4 array fields)
    const goalFields = ['fitness_goal', 'activity_level'];
    goalFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile];
      if (value && value !== '') {
        completedFields++;
      }
    });
    
    // Array fields for profile
    const arrayFields = ['health_conditions', 'allergies', 'preferred_foods', 'dietary_restrictions'];
    arrayFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile] as string[];
      if (value && Array.isArray(value) && value.length > 0) {
        completedFields++;
      }
    });

    // Health Assessment (12 key fields)
    if (assessment) {
      const assessmentFields = [
        'stress_level', 'sleep_quality', 'energy_level', 'work_schedule',
        'exercise_history', 'nutrition_knowledge', 'cooking_skills', 'time_availability',
        'timeline_expectation', 'commitment_level'
      ];
      
      assessmentFields.forEach(field => {
        totalFields++;
        const value = assessment[field as keyof typeof assessment];
        if (value !== null && value !== undefined && value !== '') {
          completedFields++;
        }
      });

      // Assessment array fields
      const assessmentArrayFields = ['chronic_conditions', 'medications', 'primary_motivation', 'specific_goals'];
      assessmentArrayFields.forEach(field => {
        totalFields++;
        const value = assessment[field as keyof typeof assessment] as string[];
        if (value && Array.isArray(value) && value.length > 0) {
          completedFields++;
        }
      });
    } else {
      totalFields += 14; // Add assessment fields to total even if not completed
    }

    return Math.round((completedFields / totalFields) * 100);
  };

  const completionScore = calculateCompletionScore();
  const healthScore = assessment?.health_score || 0;
  const readinessScore = assessment?.readiness_score || 0;
  const riskScore = assessment?.risk_score || 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Welcome Section */}
      <Card className="p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
          <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-800">
            Welcome {profile?.first_name || 'User'}!
          </h2>
        </div>
        <p className="text-sm lg:text-base text-gray-600 mb-4">
          Your enhanced profile helps our AI create personalized meal plans and exercise programs 
          tailored specifically to your needs, preferences, and health status.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Profile Completion:</span>
          <Progress value={completionScore} className="flex-1 max-w-48" />
          <span className="text-sm font-semibold text-gray-800">{completionScore}%</span>
        </div>
      </Card>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-gray-800">Health Score</h3>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(healthScore)}`}>
              {healthScore}/100
            </div>
            <Badge className={`mt-2 ${getScoreBadgeColor(healthScore)}`}>
              {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention'}
            </Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-800">Readiness Score</h3>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(readinessScore)}`}>
              {readinessScore}/100
            </div>
            <Badge className={`mt-2 ${getScoreBadgeColor(readinessScore)}`}>
              {readinessScore >= 80 ? 'Ready' : readinessScore >= 60 ? 'Moderately Ready' : 'Building Up'}
            </Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-800">Risk Score</h3>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${riskScore <= 30 ? 'text-green-600' : riskScore <= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {riskScore}/100
            </div>
            <Badge className={`mt-2 ${riskScore <= 30 ? 'bg-green-100 text-green-800' : riskScore <= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
              {riskScore <= 30 ? 'Low Risk' : riskScore <= 60 ? 'Moderate Risk' : 'High Risk'}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Profile Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card className="p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Age:</span>
              <span className="font-medium">{profile?.age || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium capitalize">{profile?.gender || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Height:</span>
              <span className="font-medium">{profile?.height ? `${profile.height} cm` : 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium">{profile?.weight ? `${profile.weight} kg` : 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nationality:</span>
              <span className="font-medium">{profile?.nationality || 'Not set'}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">Goals & Activity</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Fitness Goal:</span>
              <span className="font-medium capitalize">{profile?.fitness_goal?.replace('_', ' ') || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Activity Level:</span>
              <span className="font-medium capitalize">{profile?.activity_level?.replace('_', ' ') || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Exercise History:</span>
              <span className="font-medium capitalize">{assessment?.exercise_history || 'Not assessed'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time Available:</span>
              <span className="font-medium capitalize">{assessment?.time_availability?.replace('_', ' ') || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Commitment Level:</span>
              <span className="font-medium">{assessment?.commitment_level ? `${assessment.commitment_level}/10` : 'Not rated'}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Health Information */}
      {(profile?.health_conditions?.length || profile?.allergies?.length || assessment?.chronic_conditions?.length) && (
        <Card className="p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-800">Health Information</h3>
          </div>
          <div className="space-y-3">
            {profile?.health_conditions?.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Health Conditions:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.health_conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {profile?.allergies?.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Allergies:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {assessment?.chronic_conditions?.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Chronic Conditions:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {assessment.chronic_conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-orange-50 text-orange-700">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default EnhancedProfileOverview;
