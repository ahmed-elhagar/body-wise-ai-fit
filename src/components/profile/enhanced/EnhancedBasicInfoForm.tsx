
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BodyShapeSelector from "@/components/BodyShapeSelector";

interface EnhancedBasicInfoFormProps {
  formData: any;
  updateFormData: (field: string, value: string) => void;
  onSave: () => Promise<boolean>;
  isUpdating: boolean;
  validationErrors?: Record<string, string>;
}

const EnhancedBasicInfoForm = ({
  formData,
  updateFormData,
  onSave,
  isUpdating,
  validationErrors = {},
}: EnhancedBasicInfoFormProps) => {
  
  const handleSave = async () => {
    const success = await onSave();
    if (success) {
      // Form was saved successfully
    }
  };

  const getFieldError = (field: string) => validationErrors[field];
  const hasFieldError = (field: string) => !!validationErrors[field];

  return (
    <Card className="p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Basic Information</h2>
        <p className="text-sm lg:text-base text-gray-600">
          Tell us about yourself to personalize your experience
        </p>
      </div>

      {Object.keys(validationErrors).length > 0 && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Please fix the validation errors below before saving.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 lg:space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name" className={hasFieldError('first_name') ? 'text-red-600' : ''}>
              First Name *
            </Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => updateFormData("first_name", e.target.value)}
              placeholder="Enter your first name"
              className={`mt-1 ${hasFieldError('first_name') ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {hasFieldError('first_name') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('first_name')}</p>
            )}
          </div>
          <div>
            <Label htmlFor="last_name" className={hasFieldError('last_name') ? 'text-red-600' : ''}>
              Last Name *
            </Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => updateFormData("last_name", e.target.value)}
              placeholder="Enter your last name"
              className={`mt-1 ${hasFieldError('last_name') ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {hasFieldError('last_name') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('last_name')}</p>
            )}
          </div>
        </div>

        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="age" className={hasFieldError('age') ? 'text-red-600' : ''}>
              Age *
            </Label>
            <Input
              id="age"
              type="number"
              min="13"
              max="120"
              value={formData.age}
              onChange={(e) => updateFormData("age", e.target.value)}
              placeholder="Enter your age"
              className={`mt-1 ${hasFieldError('age') ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {hasFieldError('age') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('age')}</p>
            )}
          </div>
          <div>
            <Label htmlFor="gender" className={hasFieldError('gender') ? 'text-red-600' : ''}>
              Gender *
            </Label>
            <Select 
              value={formData.gender} 
              onValueChange={(value) => updateFormData("gender", value)}
            >
              <SelectTrigger className={`mt-1 ${hasFieldError('gender') ? 'border-red-300 focus:border-red-500' : ''}`}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {hasFieldError('gender') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('gender')}</p>
            )}
          </div>
          <div>
            <Label htmlFor="nationality" className={hasFieldError('nationality') ? 'text-red-600' : ''}>
              Nationality *
            </Label>
            <Input
              id="nationality"
              value={formData.nationality}
              onChange={(e) => updateFormData("nationality", e.target.value)}
              placeholder="Your nationality"
              className={`mt-1 ${hasFieldError('nationality') ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {hasFieldError('nationality') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('nationality')}</p>
            )}
          </div>
        </div>

        {/* Physical Measurements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="height" className={hasFieldError('height') ? 'text-red-600' : ''}>
              Height (cm) *
            </Label>
            <Input
              id="height"
              type="number"
              min="100"
              max="250"
              value={formData.height}
              onChange={(e) => updateFormData("height", e.target.value)}
              placeholder="Enter your height"
              className={`mt-1 ${hasFieldError('height') ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {hasFieldError('height') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('height')}</p>
            )}
          </div>
          <div>
            <Label htmlFor="weight" className={hasFieldError('weight') ? 'text-red-600' : ''}>
              Weight (kg) *
            </Label>
            <Input
              id="weight"
              type="number"
              min="30"
              max="300"
              value={formData.weight}
              onChange={(e) => updateFormData("weight", e.target.value)}
              placeholder="Enter your weight"
              className={`mt-1 ${hasFieldError('weight') ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {hasFieldError('weight') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('weight')}</p>
            )}
          </div>
        </div>

        {/* Body Shape Selector */}
        <div className="mt-6">
          <BodyShapeSelector
            value={formData.body_shape}
            onChange={(value) => updateFormData("body_shape", value)}
            gender={formData.gender}
            error={getFieldError('body_shape')}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-fitness-gradient hover:opacity-90 w-full md:w-auto"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Basic Info'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedBasicInfoForm;
