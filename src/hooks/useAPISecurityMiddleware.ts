
import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SecurityService } from '@/services/securityService';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { toast } from 'sonner';

export const useAPISecurityMiddleware = () => {
  const { user } = useAuth();
  const { reportSuspiciousActivity } = useSecurityMonitor();

  const secureApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    endpoint: string,
    data?: any
  ): Promise<T | null> => {
    try {
      // Rate limiting check
      const userId = user?.id || 'anonymous';
      if (!SecurityService.checkRateLimit(userId)) {
        toast.error('Too many requests. Please wait before trying again.');
        return null;
      }

      // Input validation
      if (data) {
        const validation = SecurityService.validateRequest(data, endpoint);
        if (!validation.isValid) {
          toast.error('Invalid input detected. Please check your data.');
          reportSuspiciousActivity(
            `Invalid input in ${endpoint}: ${validation.errors.join(', ')}`,
            'medium'
          );
          return null;
        }
      }

      // Execute the API call
      const result = await apiCall();
      return result;
    } catch (error) {
      console.error(`Secure API call failed for ${endpoint}:`, error);
      
      // Log security-relevant errors
      if (error instanceof Error) {
        if (error.message.includes('unauthorized') || error.message.includes('403')) {
          reportSuspiciousActivity(
            `Unauthorized access attempt to ${endpoint}`,
            'high'
          );
        }
      }
      
      throw error;
    }
  }, [user?.id, reportSuspiciousActivity]);

  return { secureApiCall };
};
