
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Save, Settings } from "lucide-react";
import { useState, useEffect } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    healthConditions: "",
    fitnessGoal: "",
    activityLevel: "",
    allergies: "",
    preferredFoods: "",
    nationality: "",
    dietaryRestrictions: ""
  });

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    navigate('/dashboard');
  };

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="text-center">
              <div className="w-24 h-24 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {profile.name || "Your Name"}
              </h3>
              <p className="text-gray-600 mb-4">
                {profile.age ? `${profile.age} years old` : "Age not set"}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600">Height</p>
                  <p className="font-semibold">{profile.height || "—"} cm</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600">Weight</p>
                  <p className="font-semibold">{profile.weight || "—"} kg</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                  <p className="text-gray-600">Goal</p>
                  <p className="font-semibold capitalize">{profile.fitnessGoal?.replace('-', ' ') || "Not set"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center mb-6">
                <User className="w-5 h-5 text-fitness-primary mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => updateProfile("name", e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => updateProfile("age", e.target.value)}
                    placeholder="Enter your age"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height}
                    onChange={(e) => updateProfile("height", e.target.value)}
                    placeholder="Enter your height"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profile.weight}
                    onChange={(e) => updateProfile("weight", e.target.value)}
                    placeholder="Enter your weight"
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={profile.nationality}
                    onChange={(e) => updateProfile("nationality", e.target.value)}
                    placeholder="Your nationality"
                  />
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
                  <Label htmlFor="healthConditions">Health Conditions</Label>
                  <Textarea
                    id="healthConditions"
                    value={profile.healthConditions}
                    onChange={(e) => updateProfile("healthConditions", e.target.value)}
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
                    value={profile.allergies}
                    onChange={(e) => updateProfile("allergies", e.target.value)}
                    placeholder="e.g., nuts, dairy, gluten"
                  />
                </div>
                <div>
                  <Label htmlFor="preferredFoods">Preferred Foods</Label>
                  <Textarea
                    id="preferredFoods"
                    value={profile.preferredFoods}
                    onChange={(e) => updateProfile("preferredFoods", e.target.value)}
                    placeholder="Foods you enjoy eating"
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-fitness-gradient hover:opacity-90 text-white px-8"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
