
import { useState, useCallback } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { SecuritySchemas, sanitizeInput, rateLimiter } from '@/components/security/InputValidator';

interface UseSecureFormOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  rateLimitKey?: string;
  maxAttempts?: number;
  sanitizeFields?: (keyof T)[];
}

export function useSecureForm<T extends Record<string, any>>({
  schema,
  onSubmit,
  rateLimitKey,
  maxAttempts = 5,
  sanitizeFields = []
}: UseSecureFormOptions<T>) {
  const [data, setData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((field: keyof T, value: any) => {
    try {
      const fieldSchema = schema.shape?.[field as string];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => ({ ...prev, [field]: undefined }));
        return true;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ 
          ...prev, 
          [field]: error.errors[0]?.message || 'Invalid input'
        }));
      }
      return false;
    }
    return true;
  }, [schema]);

  const updateField = useCallback((field: keyof T, value: any) => {
    // Sanitize input if field is in sanitizeFields array
    const processedValue = sanitizeFields.includes(field) && typeof value === 'string'
      ? sanitizeInput(value)
      : value;

    setData(prev => ({ ...prev, [field]: processedValue }));
    validateField(field, processedValue);
  }, [validateField, sanitizeFields]);

  const validateAll = useCallback(() => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof T] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [data, schema]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Rate limiting check
    if (rateLimitKey && !rateLimiter.isAllowed(rateLimitKey, maxAttempts)) {
      toast.error('Too many attempts. Please wait before trying again.');
      return;
    }

    if (!validateAll()) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data as T);
      // Reset rate limiter on successful submission
      if (rateLimitKey) {
        rateLimiter.reset(rateLimitKey);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [data, validateAll, onSubmit, rateLimitKey, maxAttempts]);

  const reset = useCallback(() => {
    setData({});
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
    data,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    validateField,
    validateAll,
    reset,
    hasErrors: Object.keys(errors).length > 0
  };
}
