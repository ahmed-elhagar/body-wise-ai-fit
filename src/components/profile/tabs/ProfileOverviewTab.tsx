
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Target, TrendingUp, Calendar } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useTranslation } from 'react-i18next';

export const ProfileOverviewTab = () => {
  const { t } = useTranslation('common');
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return <div className="p-4">{t('loading')}</div>;
  }

  if (!profile) {
    return <div className="p-4">No profile data available</div>;
  }

  const completionScore = Math.round(
    (Object.values(profile).filter(value => 
      value !== null && value !== undefined && value !== ''
    ).length / Object.keys(profile).length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion Progress</span>
              <span>{completionScore}%</span>
            </div>
            <Progress value={completionScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Age</p>
            <p className="font-medium">{profile.age || 'Not set'} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p className="font-medium capitalize">{profile.gender || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Height</p>
            <p className="font-medium">{profile.height || 'Not set'} cm</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Current Weight</p>
            <p className="font-medium">{profile.weight || 'Not set'} kg</p>
          </div>
        </CardContent>
      </Card>

      {/* Fitness Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Fitness Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Primary Goal</p>
            <Badge variant="outline" className="mt-1">
              {profile.fitness_goal || 'Not set'}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600">Activity Level</p>
            <Badge variant="outline" className="mt-1">
              {profile.activity_level || 'Not set'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="font-medium">
              {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="font-medium">
              {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
