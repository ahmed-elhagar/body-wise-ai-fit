
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSecureForm } from '@/hooks/useSecureForm';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { SecuritySchemas } from '@/components/security/InputValidator';
import { SecureFormField } from '@/components/security/SecureFormField';
import { z } from 'zod';

const authSchema = z.object({
  email: SecuritySchemas.email,
  password: SecuritySchemas.password
});

type AuthFormData = z.infer<typeof authSchema>;

interface SecureAuthFormProps {
  onSubmit: (data: AuthFormData) => Promise<void>;
  isSignup?: boolean;
  isLoading?: boolean;
}

const SecureAuthForm: React.FC<SecureAuthFormProps> = ({
  onSubmit,
  isSignup = false,
  isLoading = false
}) => {
  const { reportSuspiciousActivity } = useSecurityMonitor();
  
  const {
    data,
    errors,
    isSubmitting,
    updateField,
    handleSubmit
  } = useSecureForm({
    schema: authSchema,
    onSubmit: async (formData) => {
      try {
        await onSubmit(formData);
      } catch (error) {
        reportSuspiciousActivity(
          `Failed ${isSignup ? 'signup' : 'login'} attempt for ${formData.email}`,
          'medium'
        );
        throw error;
      }
    },
    rateLimitKey: `auth_${isSignup ? 'signup' : 'login'}`,
    maxAttempts: 3,
    sanitizeFields: ['email']
  });

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignup ? 'Create Account' : 'Sign In'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isSignup 
              ? 'Join FitFatta to start your fitness journey'
              : 'Welcome back to FitFatta'
            }
          </p>
        </div>

        <SecureFormField
          label="Email"
          type="email"
          value={data.email || ''}
          onChange={(value) => updateField('email', value)}
          error={errors.email}
          placeholder="Enter your email"
          required
          autoComplete="email"
        />

        <SecureFormField
          label="Password"
          type="password"
          value={data.password || ''}
          onChange={(value) => updateField('password', value)}
          error={errors.password}
          placeholder="Enter your password"
          required
          showPasswordToggle
          autoComplete={isSignup ? "new-password" : "current-password"}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading 
            ? (isSignup ? 'Creating Account...' : 'Signing In...') 
            : (isSignup ? 'Create Account' : 'Sign In')
          }
        </Button>

        <div className="text-center text-sm text-gray-600 mt-4">
          <p>
            Protected by advanced security measures. Your data is encrypted and secure.
          </p>
        </div>
      </form>
    </Card>
  );
};

export default SecureAuthForm;
