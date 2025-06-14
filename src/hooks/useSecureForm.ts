
import { useState, useCallback } from 'react';
import { z } from 'zod';
import { sanitizeInput, rateLimiter } from '@/components/security/InputValidator';
import { toast } from 'sonner';

interface UseSecureFormOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void>;
  rateLimitKey?: string;
  maxAttempts?: number;
  sanitizeFields?: string[];
}

export const useSecureForm = <T extends Record<string, any>>({
  schema,
  onSubmit,
  rateLimitKey,
  maxAttempts = 5,
  sanitizeFields = []
}: UseSecureFormOptions<T>) => {
  const [data, setData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: string, value: any) => {
    // Sanitize if field is in sanitize list
    const sanitizedValue = sanitizeFields.includes(field) && typeof value === 'string'
      ? sanitizeInput(value)
      : value;

    setData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, [sanitizeFields]);

  const validateForm = useCallback((): boolean => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  }, [data, schema]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    if (rateLimitKey && !rateLimiter.isAllowed(rateLimitKey, maxAttempts)) {
      toast.error('Too many attempts. Please wait before trying again.');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data as T);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [data, validateForm, onSubmit, rateLimitKey, maxAttempts]);

  return {
    data,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    validateForm
  };
};
