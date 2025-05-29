
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";

interface BasicInfoCardProps {
  formData: any;
  updateFormData: (field: string, value: string) => void;
}

const BasicInfoCard = ({ formData, updateFormData }: BasicInfoCardProps) => {
  return (
    <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center mb-4 sm:mb-6">
        <User className="w-5 h-5 text-fitness-primary mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name" className="text-sm font-medium">First Name</Label>
          <Input
            id="first_name"
            value={formData.first_name || ''}
            onChange={(e) => updateFormData("first_name", e.target.value)}
            placeholder="Enter your first name"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="last_name" className="text-sm font-medium">Last Name</Label>
          <Input
            id="last_name"
            value={formData.last_name || ''}
            onChange={(e) => updateFormData("last_name", e.target.value)}
            placeholder="Enter your last name"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="age" className="text-sm font-medium">Age</Label>
          <Input
            id="age"
            type="number"
            value={formData.age || ''}
            onChange={(e) => updateFormData("age", e.target.value)}
            placeholder="Enter your age"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
          <Select value={formData.gender || ''} onValueChange={(value) => updateFormData("gender", value)}>
            <SelectTrigger className="mt-1">
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
          <Label htmlFor="height" className="text-sm font-medium">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={formData.height || ''}
            onChange={(e) => updateFormData("height", e.target.value)}
            placeholder="Enter your height"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="weight" className="text-sm font-medium">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight || ''}
            onChange={(e) => updateFormData("weight", e.target.value)}
            placeholder="Enter your weight"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="nationality" className="text-sm font-medium">Nationality</Label>
          <Input
            id="nationality"
            value={formData.nationality || ''}
            onChange={(e) => updateFormData("nationality", e.target.value)}
            placeholder="Your nationality"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="body_shape" className="text-sm font-medium">Body Shape</Label>
          <Select value={formData.body_shape || ''} onValueChange={(value) => updateFormData("body_shape", value)}>
            <SelectTrigger className="mt-1">
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
  );
};

export default BasicInfoCard;
