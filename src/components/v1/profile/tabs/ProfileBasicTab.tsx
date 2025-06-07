import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const ProfileBasicTab = () => {
  const { profile, updateProfile } = useProfile();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [basicData, setBasicData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    age: profile?.age || '',
    gender: profile?.gender || '',
    height: profile?.height || '',
    weight: profile?.weight || '',
    nationality: profile?.nationality || '',
    body_shape: profile?.body_shape || ''
  });

  const updateField = (field: string, value: any) => {
    setBasicData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const updateData = {
        ...basicData,
        age: basicData.age ? parseInt(basicData.age.toString()) : null,
        height: basicData.height ? parseFloat(basicData.height.toString()) : null,
        weight: basicData.weight ? parseFloat(basicData.weight.toString()) : null,
      };
      
      await updateProfile(updateData);
      toast.success("Basic information updated successfully!");
    } catch (error) {
      toast.error("Failed to update basic information");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Update your personal details and physical measurements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Your name and basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={basicData.first_name}
                  onChange={(e) => updateField('first_name', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={basicData.last_name}
                  onChange={(e) => updateField('last_name', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={basicData.age}
                  onChange={(e) => updateField('age', e.target.value)}
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={basicData.gender} onValueChange={(value) => updateField('gender', value)}>
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
            </div>

            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={basicData.nationality}
                onChange={(e) => updateField('nationality', e.target.value)}
                placeholder="Your nationality"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Physical Measurements</CardTitle>
            <CardDescription>Your height, weight, and body type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={basicData.height}
                  onChange={(e) => updateField('height', e.target.value)}
                  placeholder="Enter your height"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={basicData.weight}
                  onChange={(e) => updateField('weight', e.target.value)}
                  placeholder="Enter your weight"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="body_shape">Body Shape</Label>
              <Select value={basicData.body_shape} onValueChange={(value) => updateField('body_shape', value)}>
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
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileBasicTab;
