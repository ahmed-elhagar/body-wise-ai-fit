import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Target, 
  Activity, 
  Heart, 
  Scale, 
  Calendar,
  Settings,
  Bell,
  Shield,
  Utensils,
  Award,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useI18n } from '@/shared/hooks/useI18n';
import StatsCard from '@/shared/components/design-system/StatsCard';
import GradientCard from '@/shared/components/design-system/GradientCard';
import { ActionButton } from '@/shared/components/design-system/ActionButton';
import { brandColors, gradients, shadows } from '@/shared/config/design.config';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  dateOfBirth: string;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  fitnessGoals: string[];
  healthConditions: string[];
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: string;
    dataSharing: boolean;
  };
}

const ProfessionalProfile: React.FC = () => {
  const { profile, updateProfile, isLoading } = useProfile();
  const { user } = useAuth();
  const { t } = useI18n();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState<ProfileData>({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    bio: profile?.bio || '',
    dateOfBirth: profile?.date_of_birth || '',
    gender: profile?.gender || '',
    height: profile?.height || 0,
    weight: profile?.weight || 0,
    activityLevel: profile?.activity_level || 'moderate',
    fitnessGoals: profile?.fitness_goals || [],
    healthConditions: profile?.health_conditions || [],
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisibility: 'friends',
      dataSharing: false,
    },
  });

  // Calculate profile completion
  const calculateCompletion = (): number => {
    const fields = [
      formData.firstName,
      formData.lastName,
      formData.phone,
      formData.dateOfBirth,
      formData.gender,
      formData.height > 0,
      formData.weight > 0,
      formData.activityLevel,
      formData.fitnessGoals.length > 0,
    ];
    
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof ProfileData],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        activity_level: formData.activityLevel,
        fitness_goals: formData.fitnessGoals,
        health_conditions: formData.healthConditions,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const getCompletionColor = () => {
    if (completionPercentage >= 80) return brandColors.success[500];
    if (completionPercentage >= 50) return brandColors.warning[500];
    return brandColors.error[500];
  };

  const getCompletionBadge = () => {
    if (completionPercentage >= 80) return { label: 'Complete', color: 'bg-green-100 text-green-800' };
    if (completionPercentage >= 50) return { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Incomplete', color: 'bg-red-100 text-red-800' };
  };

  const badge = getCompletionBadge();

  // Profile Header Component
  const ProfileHeader = () => (
    <GradientCard variant="primary" className="mb-8">
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={profile?.avatar_url || ''} alt="Profile" />
                <AvatarFallback className="bg-white text-brand-600 text-2xl font-bold">
                  {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-white shadow-md hover:shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="text-white/80 mb-4">
                {formData.bio || 'Fitness enthusiast on a journey to better health'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {formData.location && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <MapPin className="w-3 h-3 mr-1" />
                    {formData.location}
                  </Badge>
                )}
                <Badge className={badge.color}>
                  {badge.label}
                </Badge>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="text-center">
              <div className="relative w-20 h-20 mb-2">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - completionPercentage / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {completionPercentage}%
                  </span>
                </div>
              </div>
              <p className="text-white/80 text-sm">Profile Complete</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <ActionButton
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-white text-brand-600 hover:bg-gray-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </ActionButton>
                  <ActionButton
                    onClick={() => setIsEditing(false)}
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </ActionButton>
                </>
              ) : (
                <ActionButton
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-brand-600 hover:bg-gray-50"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </ActionButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </GradientCard>
  );

  // Quick Stats Component
  const QuickStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatsCard
        title="Current Weight"
        value={`${formData.weight || '--'} kg`}
        icon={<Scale className="w-5 h-5" />}
        trend={5}
        className="bg-gradient-to-br from-blue-50 to-indigo-50"
      />
      <StatsCard
        title="Height"
        value={`${formData.height || '--'} cm`}
        icon={<TrendingUp className="w-5 h-5" />}
        className="bg-gradient-to-br from-green-50 to-emerald-50"
      />
      <StatsCard
        title="BMI"
        value={formData.weight && formData.height ? 
          ((formData.weight / ((formData.height / 100) ** 2)).toFixed(1)) : '--'
        }
        icon={<Activity className="w-5 h-5" />}
        className="bg-gradient-to-br from-purple-50 to-violet-50"
      />
      <StatsCard
        title="Goals"
        value={`${formData.fitnessGoals.length} Active`}
        icon={<Target className="w-5 h-5" />}
        className="bg-gradient-to-br from-orange-50 to-amber-50"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader />
        <QuickStats />

        {/* Main Content Tabs */}
        <Card className="bg-white/90 backdrop-blur-sm border-0" style={{ boxShadow: shadows.xl }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200 px-6">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-transparent h-auto p-0">
                <TabsTrigger value="overview" className="flex items-center gap-2 py-4">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="health" className="flex items-center gap-2 py-4">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Health</span>
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-2 py-4">
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">Goals</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2 py-4">
                  <Utensils className="w-4 h-4" />
                  <span className="hidden sm:inline">Preferences</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2 py-4">
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2 py-4">
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Privacy</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-brand-600" />
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          disabled
                          className="mt-1 bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-brand-600" />
                      Physical Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select 
                          value={formData.gender} 
                          onValueChange={(value) => handleInputChange('gender', value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            type="number"
                            value={formData.height || ''}
                            onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            value={formData.weight || ''}
                            onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || 0)}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="activityLevel">Activity Level</Label>
                        <Select 
                          value={formData.activityLevel} 
                          onValueChange={(value) => handleInputChange('activityLevel', value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select activity level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                            <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                            <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                            <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                            <SelectItem value="very-active">Very Active (very hard exercise, physical job)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Health Tab */}
              <TabsContent value="health" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-brand-600" />
                    Health Conditions
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Please select any health conditions that may affect your fitness journey.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis',
                      'Back Problems', 'Knee Problems', 'Allergies', 'None'
                    ].map((condition) => (
                      <label key={condition} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.healthConditions.includes(condition)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange('healthConditions', [...formData.healthConditions, condition]);
                            } else {
                              handleInputChange('healthConditions', 
                                formData.healthConditions.filter(c => c !== condition)
                              );
                            }
                          }}
                          disabled={!isEditing}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{condition}</span>
                      </label>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Goals Tab */}
              <TabsContent value="goals" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-brand-600" />
                    Fitness Goals
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Select your primary fitness goals to help us personalize your experience.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Weight Loss', 'Weight Gain', 'Muscle Building', 'Endurance',
                      'Strength', 'Flexibility', 'General Health', 'Sports Performance'
                    ].map((goal) => (
                      <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.fitnessGoals.includes(goal)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange('fitnessGoals', [...formData.fitnessGoals, goal]);
                            } else {
                              handleInputChange('fitnessGoals', 
                                formData.fitnessGoals.filter(g => g !== goal)
                              );
                            }
                          }}
                          disabled={!isEditing}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{goal}</span>
                      </label>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-brand-600" />
                    Food Preferences
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Coming soon: Set your dietary preferences and restrictions.
                  </p>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-brand-600" />
                    Notification Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={formData.notifications.email}
                        onCheckedChange={(checked) => 
                          handleNestedChange('notifications', 'email', checked)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Push Notifications</h4>
                        <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                      </div>
                      <Switch
                        checked={formData.notifications.push}
                        onCheckedChange={(checked) => 
                          handleNestedChange('notifications', 'push', checked)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-sm text-gray-600">Receive text messages</p>
                      </div>
                      <Switch
                        checked={formData.notifications.sms}
                        onCheckedChange={(checked) => 
                          handleNestedChange('notifications', 'sms', checked)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-brand-600" />
                    Privacy Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="profileVisibility">Profile Visibility</Label>
                      <Select 
                        value={formData.privacy.profileVisibility} 
                        onValueChange={(value) => handleNestedChange('privacy', 'profileVisibility', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Data Sharing</h4>
                        <p className="text-sm text-gray-600">Allow anonymous data sharing for research</p>
                      </div>
                      <Switch
                        checked={formData.privacy.dataSharing}
                        onCheckedChange={(checked) => 
                          handleNestedChange('privacy', 'dataSharing', checked)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ProfessionalProfile; 