import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { User, Target, Activity, Heart } from "lucide-react";

const ProfileOverviewTab = () => {
  const { profile } = useProfile();

  if (!profile) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading profile information...</p>
      </div>
    );
  }

  const completionPercentage = profile.profile_completion_score || 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Overview</h2>
        <p className="text-gray-600">Quick overview of your profile information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Info</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile.first_name} {profile.last_name}
            </div>
            <p className="text-xs text-muted-foreground">
              Age: {profile.age} | {profile.gender} | {profile.nationality}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Physical Stats</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile.height}cm | {profile.weight}kg
            </div>
            <p className="text-xs text-muted-foreground">
              Body Shape: {profile.body_shape}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fitness Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile.fitness_goal?.replace('_', ' ')}
            </div>
            <p className="text-xs text-muted-foreground">
              Activity: {profile.activity_level?.replace('_', ' ')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Health Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Health Conditions</h4>
              <div className="flex flex-wrap gap-1">
                {profile.health_conditions?.length ? (
                  profile.health_conditions.map((condition, index) => (
                    <Badge key={index} variant="outline">{condition}</Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">None specified</span>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Allergies</h4>
              <div className="flex flex-wrap gap-1">
                {profile.allergies?.length ? (
                  profile.allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline">{allergy}</Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">None specified</span>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Dietary Restrictions</h4>
              <div className="flex flex-wrap gap-1">
                {profile.dietary_restrictions?.length ? (
                  profile.dietary_restrictions.map((restriction, index) => (
                    <Badge key={index} variant="outline">{restriction}</Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">None specified</span>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Preferred Foods</h4>
              <div className="flex flex-wrap gap-1">
                {profile.preferred_foods?.length ? (
                  profile.preferred_foods.map((food, index) => (
                    <Badge key={index} variant="outline">{food}</Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">None specified</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Your profile is {completionPercentage}% complete
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileOverviewTab;
