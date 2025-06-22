// Shared Service Layer Exports
// Centralized exports for all service-related functionality

export { BaseService, type ServiceOptions, type QueryResult } from './BaseService';
export type { ApiResponse } from '@/shared/types/common';

// Service Utilities
export { PerformanceMonitor } from '@/shared/utils/performanceMonitor'; 