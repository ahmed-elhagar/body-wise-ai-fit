
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, User, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SignupFormData } from "../types";

interface AccountCreationStepProps {
  formData: SignupFormData;
  updateField: (field: keyof SignupFormData, value: any) => void;
  onNext: () => Promise<void>;
  isLoading: boolean;
  accountCreated: boolean;
}

const AccountCreationStep = ({ 
  formData, 
  updateField, 
  onNext, 
  isLoading, 
  accountCreated 
}: AccountCreationStepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isValid = !!(
    formData.firstName && 
    formData.lastName && 
    formData.email && 
    formData.password &&
    formData.password.length >= 6
  );

  const handleSubmit = async () => {
    if (!isValid) return;
    
    setError(null);
    try {
      await onNext();
    } catch (err: any) {
      if (err.message?.includes('already registered') || err.message?.includes('already exists')) {
        setError('account_exists');
      } else {
        setError(err.message || 'Account creation failed');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
        <p className="text-gray-600">Let's start with your basic information</p>
      </div>

      {error === 'account_exists' && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="space-y-3 text-amber-800">
            <div>
              <p className="font-medium text-base mb-2">
                Account Already Exists
              </p>
              <p className="text-sm">
                An account with <strong>{formData.email}</strong> is already registered.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/auth')}
                className="text-sm border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                Sign In Instead
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  updateField('email', '');
                  setError(null);
                }}
                className="text-sm border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                Try Different Email
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {error && error !== 'account_exists' && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
            First Name *
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            placeholder="Enter your first name"
            className="h-12"
            disabled={accountCreated}
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2 block">
            Last Name *
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            placeholder="Enter your last name"
            className="h-12"
            disabled={accountCreated}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
          Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="Enter your email"
          className="h-12"
          disabled={accountCreated}
        />
      </div>

      <div>
        <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
          Password *
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder="Create a password (min 6 characters)"
            className="h-12 pr-10"
            disabled={accountCreated}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            disabled={accountCreated}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {accountCreated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-green-800 font-medium">Account Created Successfully!</p>
          <p className="text-green-600 text-sm">Continue to complete your profile</p>
        </div>
      )}
    </div>
  );
};

export default AccountCreationStep;
