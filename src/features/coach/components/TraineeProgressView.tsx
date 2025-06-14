
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Target, Activity, Calendar } from "lucide-react";

interface TraineeProgressViewProps {
  traineeId: string;
  traineeName: string;
  traineeProfile: any;
  onBack: () => void;
}

export const TraineeProgressView = ({ 
  traineeId, 
  traineeName, 
  traineeProfile,
  onBack 
}: TraineeProgressViewProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Trainees
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{traineeName}</h2>
          <p className="text-gray-600">Progress Overview</p>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Fitness Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {traineeProfile?.fitness_goal || 'Not Set'}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Current objective
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {traineeProfile?.activity_level || 'Not Set'}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Weekly activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              AI Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {traineeProfile?.ai_generations_remaining || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Remaining credits
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-sm">{traineeProfile?.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Age</label>
                <p className="text-sm">{traineeProfile?.age || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Gender</label>
                <p className="text-sm">{traineeProfile?.gender || 'Not provided'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Height</label>
                <p className="text-sm">{traineeProfile?.height ? `${traineeProfile.height} cm` : 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Weight</label>
                <p className="text-sm">{traineeProfile?.weight ? `${traineeProfile.weight} kg` : 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Profile Completion</label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {traineeProfile?.profile_completion_score || 0}%
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Information */}
      {(traineeProfile?.health_conditions?.length > 0 || traineeProfile?.dietary_restrictions?.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Health Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {traineeProfile?.health_conditions?.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Health Conditions</label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {traineeProfile.health_conditions.map((condition: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {traineeProfile?.dietary_restrictions?.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Dietary Restrictions</label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {traineeProfile.dietary_restrictions.map((restriction: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
