
import { useState, useEffect, useCallback } from 'react';
import { DatabaseSecurityService, SecurityAuditResult } from '@/services/databaseSecurityService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useDatabaseSecurity = () => {
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const { user } = useAuth();

  const runSecurityAudit = useCallback(async () => {
    if (!user) return;

    setIsAuditing(true);
    try {
      const result = await DatabaseSecurityService.auditRLSPolicies();
      setAuditResult(result);
      
      if (result.critical_issues.length > 0) {
        toast.error(`Security audit found ${result.critical_issues.length} critical issues`);
      } else if (result.warnings.length > 0) {
        toast.warning(`Security audit found ${result.warnings.length} warnings`);
      } else {
        toast.success('Security audit completed successfully');
      }
    } catch (error) {
      console.error('Security audit failed:', error);
      toast.error('Security audit failed');
    } finally {
      setIsAuditing(false);
    }
  }, [user]);

  const validateAccess = useCallback(async (resourceType: string, resourceId: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      return await DatabaseSecurityService.validateUserAccess(user.id, resourceType, resourceId);
    } catch (error) {
      console.error('Access validation failed:', error);
      return false;
    }
  }, [user]);

  const logSecurityEvent = useCallback(async (action: string, resourceType: string, details?: any) => {
    if (!user?.id) return;
    
    await DatabaseSecurityService.logSecurityEvent(user.id, action, resourceType, details);
  }, [user]);

  // Auto-run audit on mount for admin users
  useEffect(() => {
    if (user?.id) {
      // Only run for admin users to avoid unnecessary load
      // runSecurityAudit();
    }
  }, [user, runSecurityAudit]);

  return {
    auditResult,
    isAuditing,
    runSecurityAudit,
    validateAccess,
    logSecurityEvent,
    hasSecurityIssues: auditResult ? auditResult.critical_issues.length > 0 : false,
    securityScore: auditResult?.overall_score || 0
  };
};
