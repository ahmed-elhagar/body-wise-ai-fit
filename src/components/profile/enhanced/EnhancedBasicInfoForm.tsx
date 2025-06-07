
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save, AlertCircle } from "lucide-react";

interface EnhancedBasicInfoFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onSave: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors: Record<string, string>;
}

const EnhancedBasicInfoForm = ({
  formData,
  updateFormData,
  onSave,
  isUpdating,
  validationErrors
}: EnhancedBasicInfoFormProps) => {
  const getInputClassName = (field: string) => {
    const hasError = validationErrors[field];
    return hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
  };

  const renderFieldError = (field: string) => {
    const error = validationErrors[field];
    if (!error) return null;
    
    return (
      <div className="flex items-center mt-1 text-sm text-red-600">
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="first_name"
              value={formData.first_name || ''}
              onChange={(e) => updateFormData('first_name', e.target.value)}
              placeholder="Enter your first name"
              className={getInputClassName('first_name')}
            />
            {renderFieldError('first_name')}
          </div>

          <div>
            <Label htmlFor="last_name">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="last_name"
              value={formData.last_name || ''}
              onChange={(e) => updateFormData('last_name', e.target.value)}
              placeholder="Enter your last name"
              className={getInputClassName('last_name')}
            />
            {renderFieldError('last_name')}
          </div>

          <div>
            <Label htmlFor="age">
              Age <span className="text-red-500">*</span>
            </Label>
            <Input
              id="age"
              type="number"
              min="13"
              max="120"
              value={formData.age || ''}
              onChange={(e) => updateFormData('age', e.target.value)}
              placeholder="Enter your age"
              className={getInputClassName('age')}
            />
            {renderFieldError('age')}
          </div>

          <div>
            <Label htmlFor="gender">
              Gender <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.gender || undefined} onValueChange={(value) => updateFormData('gender', value)}>
              <SelectTrigger className={getInputClassName('gender')}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {renderFieldError('gender')}
          </div>

          <div>
            <Label htmlFor="height">
              Height (cm) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="height"
              type="number"
              min="100"
              max="250"
              value={formData.height || ''}
              onChange={(e) => updateFormData('height', e.target.value)}
              placeholder="Enter your height in cm"
              className={getInputClassName('height')}
            />
            {renderFieldError('height')}
          </div>

          <div>
            <Label htmlFor="weight">
              Weight (kg) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="weight"
              type="number"
              min="30"
              max="300"
              value={formData.weight || ''}
              onChange={(e) => updateFormData('weight', e.target.value)}
              placeholder="Enter your weight in kg"
              className={getInputClassName('weight')}
            />
            {renderFieldError('weight')}
          </div>

          <div>
            <Label htmlFor="nationality">
              Nationality <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nationality"
              value={formData.nationality || ''}
              onChange={(e) => updateFormData('nationality', e.target.value)}
              placeholder="Enter your nationality"
              className={getInputClassName('nationality')}
            />
            {renderFieldError('nationality')}
          </div>

          <div>
            <Label htmlFor="body_shape">Body Shape</Label>
            <Select value={formData.body_shape || undefined} onValueChange={(value) => updateFormData('body_shape', value)}>
              <SelectTrigger className={getInputClassName('body_shape')}>
                <SelectValue placeholder="Select body shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ectomorph">Ectomorph (Lean/Thin)</SelectItem>
                <SelectItem value="mesomorph">Mesomorph (Athletic/Muscular)</SelectItem>
                <SelectItem value="endomorph">Endomorph (Rounded/Soft)</SelectItem>
              </SelectContent>
            </Select>
            {renderFieldError('body_shape')}
          </div>
        </div>

        <Button 
          onClick={onSave} 
          disabled={isUpdating}
          className="w-full md:w-auto"
        >
          <Save className="w-4 h-4 mr-2" />
          {isUpdating ? 'Saving...' : 'Save Basic Information'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedBasicInfoForm;
