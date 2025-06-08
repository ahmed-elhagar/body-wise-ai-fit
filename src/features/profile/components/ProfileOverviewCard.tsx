
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Target, Heart, Scale } from "lucide-react";

interface ProfileOverviewCardProps {
  profile: any;
}

const ProfileOverviewCard = ({ profile }: ProfileOverviewCardProps) => {
  const getBMI = () => {
    if (profile?.height && profile?.weight) {
      const heightInM = profile.height / 100;
      return (profile.weight / (heightInM * heightInM)).toFixed(1);
    }
    return null;
  };

  const bmi = getBMI();

  return (
    <Card className="bg-gradient-to-br from-white via-slate-50/20 to-gray-50/20 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-slate-100 rounded-lg">
            <User className="w-6 h-6 text-slate-600" />
          </div>
          Profile Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-600" />
              <p className="text-sm text-gray-500">Fitness Goal</p>
            </div>
            <p className="font-medium text-gray-900 capitalize">
              {profile?.fitness_goal?.replace('_', ' ') || 'Not set'}
            </p>
          </div>

          <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-red-600" />
              <p className="text-sm text-gray-500">Activity Level</p>
            </div>
            <p className="font-medium text-gray-900 capitalize">
              {profile?.activity_level?.replace('_', ' ') || 'Not set'}
            </p>
          </div>

          {bmi && (
            <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-gray-500">BMI</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">{bmi}</p>
                <Badge variant="outline" className="text-xs">
                  {parseFloat(bmi) < 18.5 ? 'Underweight' :
                   parseFloat(bmi) < 25 ? 'Normal' :
                   parseFloat(bmi) < 30 ? 'Overweight' : 'Obese'}
                </Badge>
              </div>
            </div>
          )}

          <div className="p-4 bg-white/70 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Physical Stats</p>
            <p className="font-medium text-gray-900">
              {profile?.height ? `${profile.height} cm` : 'Height not set'} • {profile?.weight ? `${profile.weight} kg` : 'Weight not set'}
            </p>
          </div>
        </div>

        {(profile?.health_conditions?.length > 0 || profile?.allergies?.length > 0) && (
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-sm text-yellow-800 font-medium mb-2">Health Considerations</p>
            <div className="space-y-1">
              {profile?.health_conditions?.length > 0 && (
                <p className="text-xs text-yellow-700">
                  {profile.health_conditions.length} health condition(s) noted
                </p>
              )}
              {profile?.allergies?.length > 0 && (
                <p className="text-xs text-yellow-700">
                  {profile.allergies.length} allergy/intolerance(s) noted
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileOverviewCard;
