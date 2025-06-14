
import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDatabaseSecurity } from '@/hooks/useDatabaseSecurity';
import { useAPISecurityMiddleware } from '@/hooks/useAPISecurityMiddleware';
import { toast } from 'sonner';

export const useSecureDataAccess = () => {
  const { user } = useAuth();
  const { validateAccess, logSecurityEvent } = useDatabaseSecurity();
  const { secureApiCall } = useAPISecurityMiddleware();

  const secureGet = useCallback(async <T>(
    table: string,
    query: any,
    resourceId?: string
  ): Promise<T | null> => {
    if (!user?.id) {
      toast.error('Authentication required');
      return null;
    }

    // Validate access if resourceId provided
    if (resourceId) {
      const hasAccess = await validateAccess(table, resourceId);
      if (!hasAccess) {
        toast.error('Access denied');
        logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', table, { resourceId });
        return null;
      }
    }

    return secureApiCall(
      () => query,
      `GET_${table.toUpperCase()}`,
      { table, resourceId }
    );
  }, [user, validateAccess, logSecurityEvent, secureApiCall]);

  const secureUpdate = useCallback(async <T>(
    table: string,
    resourceId: string,
    updateData: any,
    updateQuery: () => Promise<T>
  ): Promise<T | null> => {
    if (!user?.id) {
      toast.error('Authentication required');
      return null;
    }

    // Validate access
    const hasAccess = await validateAccess(table, resourceId);
    if (!hasAccess) {
      toast.error('Access denied');
      logSecurityEvent('UNAUTHORIZED_UPDATE_ATTEMPT', table, { resourceId, updateData });
      return null;
    }

    // Log the update
    logSecurityEvent('UPDATE', table, { resourceId, fields: Object.keys(updateData) });

    return secureApiCall(
      updateQuery,
      `UPDATE_${table.toUpperCase()}`,
      { table, resourceId, updateData }
    );
  }, [user, validateAccess, logSecurityEvent, secureApiCall]);

  const secureDelete = useCallback(async <T>(
    table: string,
    resourceId: string,
    deleteQuery: () => Promise<T>
  ): Promise<T | null> => {
    if (!user?.id) {
      toast.error('Authentication required');
      return null;
    }

    // Validate access
    const hasAccess = await validateAccess(table, resourceId);
    if (!hasAccess) {
      toast.error('Access denied');
      logSecurityEvent('UNAUTHORIZED_DELETE_ATTEMPT', table, { resourceId });
      return null;
    }

    // Confirm deletion
    if (!confirm('Are you sure you want to delete this item?')) {
      return null;
    }

    // Log the deletion
    logSecurityEvent('DELETE', table, { resourceId });

    return secureApiCall(
      deleteQuery,
      `DELETE_${table.toUpperCase()}`,
      { table, resourceId }
    );
  }, [user, validateAccess, logSecurityEvent, secureApiCall]);

  return {
    secureGet,
    secureUpdate,
    secureDelete,
    isAuthenticated: !!user?.id
  };
};
