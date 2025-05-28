
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Save, Settings, LogOut, Mail, Lock, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, isLoading, isUpdating } = useProfile();
  const { signOut, user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    nationality: "",
    body_shape: "",
    health_conditions: [] as string[],
    fitness_goal: "",
    activity_level: "",
    allergies: [] as string[],
    preferred_foods: [] as string[],
    dietary_restrictions: [] as string[]
  });

  const [emailData, setEmailData] = useState({
    newEmail: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        age: profile.age?.toString() || "",
        gender: profile.gender || "",
        height: profile.height?.toString() || "",
        weight: profile.weight?.toString() || "",
        nationality: profile.nationality || "",
        body_shape: profile.body_shape || "",
        health_conditions: profile.health_conditions || [],
        fitness_goal: profile.fitness_goal || "",
        activity_level: profile.activity_level || "",
        allergies: profile.allergies || [],
        preferred_foods: profile.preferred_foods || [],
        dietary_restrictions: profile.dietary_restrictions || []
      });
    }
  }, [profile]);

  const handleSave = () => {
    const profileData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      age: formData.age ? parseInt(formData.age) : undefined,
      gender: formData.gender as any,
      height: formData.height ? parseFloat(formData.height) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      nationality: formData.nationality,
      body_shape: formData.body_shape as any,
      health_conditions: formData.health_conditions,
      fitness_goal: formData.fitness_goal as any,
      activity_level: formData.activity_level as any,
      allergies: formData.allergies,
      preferred_foods: formData.preferred_foods,
      dietary_restrictions: formData.dietary_restrictions
    };

    updateProfile(profileData);
  };

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    updateFormData(field, items);
  };

  const handleEmailUpdate = async () => {
    if (!emailData.newEmail) {
      toast.error("Please enter a new email address");
      return;
    }

    setEmailLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: emailData.newEmail
      });

      if (error) throw error;
      
      toast.success("Email update initiated. Please check both your old and new email for confirmation.");
      setEmailData({ newEmail: "" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;
      
      toast.success("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
              <p className="text-gray-600">Manage your personal information and account settings</p>
            </div>
          </div>
          <div className="flex space-x-3">
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Panel</span>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Summary & Navigation */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {formData.first_name && formData.last_name 
                  ? `${formData.first_name} ${formData.last_name}` 
                  : "Your Name"}
              </h3>
              <p className="text-sm text-gray-600 mb-1">{user?.email}</p>
              <p className="text-gray-600 mb-4">
                {formData.age ? `${formData.age} years old` : "Age not set"}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600">Height</p>
                  <p className="font-semibold">{formData.height || "—"} cm</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600">Weight</p>
                  <p className="font-semibold">{formData.weight || "—"} kg</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                  <p className="text-gray-600">Goal</p>
                  <p className="font-semibold capitalize">{formData.fitness_goal?.replace('_', ' ') || "Not set"}</p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="space-y-2">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "profile" ? "bg-fitness-gradient text-white" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <User className="w-4 h-4 mr-3" />
                Profile Info
              </Button>
              <Button
                variant={activeTab === "account" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "account" ? "bg-fitness-gradient text-white" : ""}`}
                onClick={() => setActiveTab("account")}
              >
                <Settings className="w-4 h-4 mr-3" />
                Account Settings
              </Button>
            </div>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "profile" && (
              <>
                {/* Basic Information */}
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <div className="flex items-center mb-6">
                    <User className="w-5 h-5 text-fitness-primary mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => updateFormData("first_name", e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => updateFormData("last_name", e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => updateFormData("age", e.target.value)}
                        placeholder="Enter your age"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => updateFormData("height", e.target.value)}
                        placeholder="Enter your height"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => updateFormData("weight", e.target.value)}
                        placeholder="Enter your weight"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={formData.nationality}
                        onChange={(e) => updateFormData("nationality", e.target.value)}
                        placeholder="Your nationality"
                      />
                    </div>
                    <div>
                      <Label htmlFor="body_shape">Body Shape</Label>
                      <Select value={formData.body_shape} onValueChange={(value) => updateFormData("body_shape", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select body shape" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ectomorph">Ectomorph</SelectItem>
                          <SelectItem value="mesomorph">Mesomorph</SelectItem>
                          <SelectItem value="endomorph">Endomorph</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                {/* Health & Goals */}
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <div className="flex items-center mb-6">
                    <Settings className="w-5 h-5 text-fitness-primary mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Health & Goals</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fitness_goal">Fitness Goal</Label>
                      <Select value={formData.fitness_goal} onValueChange={(value) => updateFormData("fitness_goal", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weight_loss">Weight Loss</SelectItem>
                          <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                          <SelectItem value="maintenance">Weight Maintenance</SelectItem>
                          <SelectItem value="endurance">Improve Endurance</SelectItem>
                          <SelectItem value="weight_gain">Weight Gain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="activity_level">Activity Level</Label>
                      <Select value={formData.activity_level} onValueChange={(value) => updateFormData("activity_level", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary</SelectItem>
                          <SelectItem value="lightly_active">Lightly Active</SelectItem>
                          <SelectItem value="moderately_active">Moderately Active</SelectItem>
                          <SelectItem value="very_active">Very Active</SelectItem>
                          <SelectItem value="extremely_active">Extremely Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="health_conditions">Health Conditions</Label>
                      <Textarea
                        id="health_conditions"
                        value={formData.health_conditions.join(', ')}
                        onChange={(e) => handleArrayInput("health_conditions", e.target.value)}
                        placeholder="Any health conditions or medical considerations"
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>

                {/* Nutrition Preferences */}
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <div className="flex items-center mb-6">
                    <Settings className="w-5 h-5 text-fitness-primary mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Nutrition Preferences</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="allergies">Food Allergies</Label>
                      <Input
                        id="allergies"
                        value={formData.allergies.join(', ')}
                        onChange={(e) => handleArrayInput("allergies", e.target.value)}
                        placeholder="e.g., nuts, dairy, gluten"
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferred_foods">Preferred Foods</Label>
                      <Textarea
                        id="preferred_foods"
                        value={formData.preferred_foods.join(', ')}
                        onChange={(e) => handleArrayInput("preferred_foods", e.target.value)}
                        placeholder="Foods you enjoy eating"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
                      <Input
                        id="dietary_restrictions"
                        value={formData.dietary_restrictions.join(', ')}
                        onChange={(e) => handleArrayInput("dietary_restrictions", e.target.value)}
                        placeholder="e.g., vegetarian, vegan, keto"
                      />
                    </div>
                  </div>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="bg-fitness-gradient hover:opacity-90 text-white px-8"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </>
            )}

            {activeTab === "account" && (
              <>
                {/* Email Settings */}
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <div className="flex items-center mb-6">
                    <Mail className="w-5 h-5 text-fitness-primary mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Email Settings</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current_email">Current Email</Label>
                      <Input
                        id="current_email"
                        value={user?.email || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new_email">New Email Address</Label>
                      <Input
                        id="new_email"
                        type="email"
                        value={emailData.newEmail}
                        onChange={(e) => setEmailData({ newEmail: e.target.value })}
                        placeholder="Enter new email address"
                      />
                    </div>
                    <Button
                      onClick={handleEmailUpdate}
                      disabled={emailLoading || !emailData.newEmail}
                      className="bg-fitness-gradient hover:opacity-90 text-white"
                    >
                      {emailLoading ? 'Updating...' : 'Update Email'}
                    </Button>
                    <p className="text-sm text-gray-600">
                      You'll receive confirmation emails at both your current and new email addresses.
                    </p>
                  </div>
                </Card>

                {/* Password Settings */}
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <div className="flex items-center mb-6">
                    <Lock className="w-5 h-5 text-fitness-primary mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Password Settings</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new_password">New Password</Label>
                      <Input
                        id="new_password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm_password">Confirm New Password</Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button
                      onClick={handlePasswordUpdate}
                      disabled={passwordLoading || !passwordData.newPassword || !passwordData.confirmPassword}
                      className="bg-fitness-gradient hover:opacity-90 text-white"
                    >
                      {passwordLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                    <p className="text-sm text-gray-600">
                      Password must be at least 6 characters long.
                    </p>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
