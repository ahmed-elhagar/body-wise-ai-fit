
// Shared Services Export
export { supabase } from '@/integrations/supabase/client';

// Base Service Classes and Types
export { BaseService } from './BaseService';
export type { ServiceOptions, QueryResult } from './BaseService';

// Common Types
export type { ApiResponse } from '@/shared/types/common';

// Performance Services
export { 
  performanceMonitor, 
  usePerformanceMonitor, 
  usePerformanceTracking,
  withPerformanceTracking,
  measureFunction
} from '@/shared/utils/performanceMonitor';
export type { PerformanceData, PerformanceMetric, PerformanceSummary } from '@/shared/utils/performanceMonitor';

// Performance Optimizer
export { default as performanceOptimizer } from '@/shared/utils/performanceOptimizer';

// Design System Services
export { useDesignSystem } from '@/shared/hooks/useDesignSystem';
export type { Theme, DesignSystemContext } from '@/shared/hooks/useDesignSystem';
