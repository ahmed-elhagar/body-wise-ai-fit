import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse } from '@/shared/types/common';

export interface ServiceOptions {
  cacheEnabled?: boolean;
  cacheTTL?: number; // milliseconds
  retryAttempts?: number;
  retryDelay?: number; // milliseconds
  enableLogging?: boolean;
}

export interface QueryResult<T> {
  data: T | null;
  error: Error | null;
  fromCache: boolean;
  queryTime: number;
  metadata?: {
    totalCount?: number;
    hasMore?: boolean;
    nextCursor?: string;
  };
}

export abstract class BaseService {
  protected static readonly DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  protected static readonly DEFAULT_RETRY_ATTEMPTS = 3;
  protected static readonly DEFAULT_RETRY_DELAY = 1000; // 1 second
  
  protected static queryCache = new Map<string, { data: any; timestamp: number }>();
  protected options: ServiceOptions;
  protected serviceName: string;

  constructor(serviceName: string, options: ServiceOptions = {}) {
    this.serviceName = serviceName;
    this.options = {
      cacheEnabled: true,
      cacheTTL: BaseService.DEFAULT_CACHE_TTL,
      retryAttempts: BaseService.DEFAULT_RETRY_ATTEMPTS,
      retryDelay: BaseService.DEFAULT_RETRY_DELAY,
      enableLogging: true,
      ...options
    };
  }

  /**
   * Execute a database query with error handling, caching, and retry logic
   */
  protected async executeQuery<T>(
    queryName: string,
    queryFn: () => Promise<{ data: T | null; error: any }>,
    cacheKey?: string
  ): Promise<QueryResult<T>> {
    const startTime = Date.now();
    
    if (this.options.enableLogging) {
      console.log(`🔍 ${this.serviceName}.${queryName} starting...`);
    }

    // Check cache if enabled and cache key provided
    if (this.options.cacheEnabled && cacheKey) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) {
        if (this.options.enableLogging) {
          console.log(`📦 ${this.serviceName}.${queryName} returning cached data`);
        }
        return {
          data: cached,
          error: null,
          fromCache: true,
          queryTime: Date.now() - startTime
        };
      }
    }

    // Execute query with retry logic
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= (this.options.retryAttempts || 1); attempt++) {
      try {
        const result = await queryFn();
        
        if (result.error) {
          throw new Error(result.error.message || 'Database query failed');
        }

        // Cache successful result
        if (this.options.cacheEnabled && cacheKey && result.data) {
          this.setCache(cacheKey, result.data);
        }

        if (this.options.enableLogging) {
          console.log(`✅ ${this.serviceName}.${queryName} completed successfully`, {
            queryTime: Date.now() - startTime,
            attempt,
            fromCache: false
          });
        }

        return {
          data: result.data,
          error: null,
          fromCache: false,
          queryTime: Date.now() - startTime
        };

      } catch (error) {
        lastError = error as Error;
        
        if (this.options.enableLogging) {
          console.warn(`⚠️ ${this.serviceName}.${queryName} attempt ${attempt} failed:`, lastError.message);
        }

        // If not the last attempt, wait before retrying
        if (attempt < (this.options.retryAttempts || 1)) {
          await this.delay(this.options.retryDelay || BaseService.DEFAULT_RETRY_DELAY);
        }
      }
    }

    // All attempts failed
    if (this.options.enableLogging) {
      console.error(`❌ ${this.serviceName}.${queryName} failed after ${this.options.retryAttempts} attempts:`, lastError?.message);
    }

    return {
      data: null,
      error: lastError,
      fromCache: false,
      queryTime: Date.now() - startTime
    };
  }

  /**
   * Execute a Supabase Edge Function with error handling and retry logic
   */
  protected async executeFunction<T>(
    functionName: string,
    params: any = {},
    retryOnError = true
  ): Promise<QueryResult<T>> {
    const startTime = Date.now();
    
    if (this.options.enableLogging) {
      console.log(`🔍 ${this.serviceName}.${functionName} Edge Function starting...`);
    }

    let lastError: Error | null = null;
    const attempts = retryOnError ? (this.options.retryAttempts || 1) : 1;
    
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const { data, error } = await supabase.functions.invoke(functionName, {
          body: params
        });

        if (error) {
          throw new Error(error.message || `Edge function ${functionName} failed`);
        }

        if (this.options.enableLogging) {
          console.log(`✅ ${this.serviceName}.${functionName} Edge Function completed successfully`, {
            queryTime: Date.now() - startTime,
            attempt
          });
        }

        return {
          data,
          error: null,
          fromCache: false,
          queryTime: Date.now() - startTime
        };

      } catch (error) {
        lastError = error as Error;
        
        if (this.options.enableLogging) {
          console.warn(`⚠️ ${this.serviceName}.${functionName} Edge Function attempt ${attempt} failed:`, lastError.message);
        }

        // If not the last attempt, wait before retrying
        if (attempt < attempts) {
          await this.delay(this.options.retryDelay || BaseService.DEFAULT_RETRY_DELAY);
        }
      }
    }

    // All attempts failed
    if (this.options.enableLogging) {
      console.error(`❌ ${this.serviceName}.${functionName} Edge Function failed after ${attempts} attempts:`, lastError?.message);
    }

    return {
      data: null,
      error: lastError,
      fromCache: false,
      queryTime: Date.now() - startTime
    };
  }

  /**
   * Transform query result to API response format
   */
  protected toApiResponse<T>(result: QueryResult<T>, successMessage?: string): ApiResponse<T> {
    if (result.error) {
      return {
        success: false,
        error: result.error.message,
        message: `Failed to execute ${this.serviceName} operation`
      };
    }

    return {
      success: true,
      data: result.data || undefined,
      message: successMessage
    };
  }

  /**
   * Generate cache key with service namespace
   */
  protected generateCacheKey(...parts: (string | number)[]): string {
    return `${this.serviceName}:${parts.join(':')}`;
  }

  /**
   * Get data from cache
   */
  private getFromCache<T>(key: string): T | null {
    try {
      const cached = BaseService.queryCache.get(key);
      if (cached && Date.now() - cached.timestamp < (this.options.cacheTTL || BaseService.DEFAULT_CACHE_TTL)) {
        return cached.data as T;
      }
      BaseService.queryCache.delete(key);
      return null;
    } catch (error) {
      if (this.options.enableLogging) {
        console.error(`❌ ${this.serviceName} cache retrieval error:`, error);
      }
      return null;
    }
  }

  /**
   * Set data in cache
   */
  private setCache<T>(key: string, data: T): void {
    try {
      BaseService.queryCache.set(key, { data, timestamp: Date.now() });
    } catch (error) {
      if (this.options.enableLogging) {
        console.error(`❌ ${this.serviceName} cache storage error:`, error);
      }
    }
  }

  /**
   * Delay utility for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clear cache for this service
   */
  protected clearServiceCache(): void {
    const keys = Array.from(BaseService.queryCache.keys());
    const serviceKeys = keys.filter(key => key.startsWith(`${this.serviceName}:`));
    
    serviceKeys.forEach(key => BaseService.queryCache.delete(key));
    
    if (this.options.enableLogging) {
      console.log(`🧹 ${this.serviceName} cache cleared (${serviceKeys.length} entries)`);
    }
  }

  /**
   * Get cache stats for this service
   */
  protected getCacheStats(): { totalEntries: number; serviceEntries: number; cacheSize: string } {
    const keys = Array.from(BaseService.queryCache.keys());
    const serviceKeys = keys.filter(key => key.startsWith(`${this.serviceName}:`));
    
    // Estimate cache size
    const cacheSize = JSON.stringify(Array.from(BaseService.queryCache.values())).length;
    
    return {
      totalEntries: keys.length,
      serviceEntries: serviceKeys.length,
      cacheSize: `${(cacheSize / 1024).toFixed(2)} KB`
    };
  }
} 