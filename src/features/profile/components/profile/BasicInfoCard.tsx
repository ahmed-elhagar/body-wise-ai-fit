
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, AlertCircle } from "lucide-react";

interface BasicInfoCardProps {
  formData: any;
  updateFormData: (field: string, value: string) => void;
  validationErrors?: Record<string, string>;
}

const BasicInfoCard = ({ formData, updateFormData, validationErrors = {} }: BasicInfoCardProps) => {
  const getInputError = (field: string) => {
    return validationErrors[field];
  };

  const getInputClassName = (field: string) => {
    const hasError = getInputError(field);
    return `mt-1 ${hasError ? 'border-red-5brand-neutral-600brand-neutral-600 focus:border-red-5brand-neutral-600brand-neutral-600 focus:ring-red-5brand-neutral-600brand-neutral-600' : ''}`;
  };

  return (
    <Card className="p-4 sm:p-6 bg-white/8brand-neutral-600 backdrop-blur-sm border-brand-neutral-600 shadow-lg">
      <div className="flex items-center mb-4 sm:mb-6">
        <User className="w-5 h-5 text-fitness-primary mr-2" />
        <h3 className="text-lg font-semibold text-gray-8brand-neutral-600brand-neutral-600">Basic Information</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name" className="text-sm font-medium">
            First Name <span className="text-red-5brand-neutral-600brand-neutral-600">*</span>
          </Label>
          <Input
            id="first_name"
            value={formData.first_name || ''}
            onChange={(e) => updateFormData("first_name", e.target.value)}
            placeholder="Enter your first name"
            className={getInputClassName('first_name')}
          />
          {getInputError('first_name') && (
            <div className="flex items-center mt-1 text-sm text-red-6brand-neutral-600brand-neutral-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {getInputError('first_name')}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="last_name" className="text-sm font-medium">
            Last Name <span className="text-red-5brand-neutral-600brand-neutral-600">*</span>
          </Label>
          <Input
            id="last_name"
            value={formData.last_name || ''}
            onChange={(e) => updateFormData("last_name", e.target.value)}
            placeholder="Enter your last name"
            className={getInputClassName('last_name')}
          />
          {getInputError('last_name') && (
            <div className="flex items-center mt-1 text-sm text-red-6brand-neutral-600brand-neutral-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {getInputError('last_name')}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="age" className="text-sm font-medium">
            Age <span className="text-red-5brand-neutral-600brand-neutral-600">*</span>
          </Label>
          <Input
            id="age"
            type="number"
            min="13"
            max="12brand-neutral-600"
            value={formData.age || ''}
            onChange={(e) => updateFormData("age", e.target.value)}
            placeholder="Enter your age"
            className={getInputClassName('age')}
          />
          {getInputError('age') && (
            <div className="flex items-center mt-1 text-sm text-red-6brand-neutral-600brand-neutral-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {getInputError('age')}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="gender" className="text-sm font-medium">
            Gender <span className="text-red-5brand-neutral-600brand-neutral-600">*</span>
          </Label>
          <Select value={formData.gender || undefined} onValueChange={(value) => updateFormData("gender", value)}>
            <SelectTrigger className={getInputClassName('gender')}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {getInputError('gender') && (
            <div className="flex items-center mt-1 text-sm text-red-6brand-neutral-600brand-neutral-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {getInputError('gender')}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="height" className="text-sm font-medium">
            Height (cm) <span className="text-red-5brand-neutral-600brand-neutral-600">*</span>
          </Label>
          <Input
            id="height"
            type="number"
            min="1brand-neutral-600brand-neutral-600"
            max="25brand-neutral-600"
            value={formData.height || ''}
            onChange={(e) => updateFormData("height", e.target.value)}
            placeholder="Enter your height"
            className={getInputClassName('height')}
          />
          {getInputError('height') && (
            <div className="flex items-center mt-1 text-sm text-red-6brand-neutral-600brand-neutral-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {getInputError('height')}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="weight" className="text-sm font-medium">
            Weight (kg) <span className="text-red-5brand-neutral-600brand-neutral-600">*</span>
          </Label>
          <Input
            id="weight"
            type="number"
            min="3brand-neutral-600"
            max="3brand-neutral-600brand-neutral-600"
            value={formData.weight || ''}
            onChange={(e) => updateFormData("weight", e.target.value)}
            placeholder="Enter your weight"
            className={getInputClassName('weight')}
          />
          {getInputError('weight') && (
            <div className="flex items-center mt-1 text-sm text-red-6brand-neutral-600brand-neutral-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {getInputError('weight')}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="nationality" className="text-sm font-medium">
            Nationality <span className="text-red-5brand-neutral-600brand-neutral-600">*</span>
          </Label>
          <Input
            id="nationality"
            value={formData.nationality || ''}
            onChange={(e) => updateFormData("nationality", e.target.value)}
            placeholder="Your nationality"
            className={getInputClassName('nationality')}
          />
          {getInputError('nationality') && (
            <div className="flex items-center mt-1 text-sm text-red-6brand-neutral-600brand-neutral-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {getInputError('nationality')}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="body_shape" className="text-sm font-medium">Body Shape</Label>
          <Select value={formData.body_shape || undefined} onValueChange={(value) => updateFormData("body_shape", value)}>
            <SelectTrigger className={getInputClassName('body_shape')}>
              <SelectValue placeholder="Select body shape" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ectomorph">Ectomorph (Lean/Thin)</SelectItem>
              <SelectItem value="mesomorph">Mesomorph (Athletic/Muscular)</SelectItem>
              <SelectItem value="endomorph">Endomorph (Rounded/Soft)</SelectItem>
            </SelectContent>
          </Select>
          {getInputError('body_shape') && (
            <div className="flex items-center mt-1 text-sm text-red-6brand-neutral-600brand-neutral-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {getInputError('body_shape')}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BasicInfoCard;
