import { useState, useEffect, useCallback, useRef } from 'react';

export interface DataFetcherOptions<T> {
  /**
   * Function to fetch the data
   */
  fetchFn: () => Promise<T>;
  
  /**
   * Dependencies that trigger a refetch when changed
   */
  deps?: any[];
  
  /**
   * Whether to fetch immediately on mount
   */
  immediate?: boolean;
  
  /**
   * Enable automatic retry on error
   */
  retry?: boolean;
  
  /**
   * Number of retry attempts
   */
  maxRetries?: number;
  
  /**
   * Retry delay in milliseconds
   */
  retryDelay?: number;
  
  /**
   * Enable cache to avoid refetching same dependencies
   */
  enableCache?: boolean;
  
  /**
   * Cache key function for custom cache keys
   */
  cacheKeyFn?: (deps: any[]) => string;
  
  /**
   * Custom error handler
   */
  onError?: (error: any) => void;
  
  /**
   * Custom success handler
   */
  onSuccess?: (data: T) => void;
}

export interface DataFetcherState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: any;
  isRefetching: boolean;
  retryCount: number;
}

const defaultOptions: Partial<DataFetcherOptions<any>> = {
  immediate: true,
  retry: true,
  maxRetries: 3,
  retryDelay: 1000,
  enableCache: true,
  deps: []
};

/**
 * Generic data fetching hook that consolidates common patterns
 * Used to replace repetitive useState/useEffect patterns across the app
 */
export const useDataFetcher = <T>(
  options: DataFetcherOptions<T>
) => {
  const opts = { ...defaultOptions, ...options } as Required<DataFetcherOptions<T>>;
  
  const [state, setState] = useState<DataFetcherState<T>>({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
    isRefetching: false,
    retryCount: 0
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  const lastDepsRef = useRef<any[]>([]);

  // Generate cache key
  const getCacheKey = useCallback(() => {
    if (opts.cacheKeyFn) {
      return opts.cacheKeyFn(opts.deps);
    }
    return JSON.stringify(opts.deps);
  }, [opts.deps, opts.cacheKeyFn]);

  // Check if deps have changed
  const depsChanged = useCallback(() => {
    if (opts.deps.length !== lastDepsRef.current.length) return true;
    return opts.deps.some((dep, index) => dep !== lastDepsRef.current[index]);
  }, [opts.deps]);

  // Fetch data function
  const fetchData = useCallback(async (isRetry = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      // Check cache first
      if (opts.enableCache && !isRetry) {
        const cacheKey = getCacheKey();
        const cached = cacheRef.current.get(cacheKey);
        if (cached) {
          setState(prev => ({
            ...prev,
            data: cached.data,
            isLoading: false,
            isError: false,
            error: null,
            isRefetching: false
          }));
          opts.onSuccess?.(cached.data);
          return cached.data;
        }
      }

      setState(prev => ({
        ...prev,
        isLoading: !isRetry,
        isRefetching: isRetry,
        isError: false,
        error: null
      }));

      const data = await opts.fetchFn();

      // Cache the result
      if (opts.enableCache) {
        const cacheKey = getCacheKey();
        cacheRef.current.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      setState(prev => ({
        ...prev,
        data,
        isLoading: false,
        isError: false,
        error: null,
        isRefetching: false,
        retryCount: 0
      }));

      opts.onSuccess?.(data);
      return data;

    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }

      const shouldRetry = opts.retry && state.retryCount < opts.maxRetries;

      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error,
        isRefetching: false,
        retryCount: shouldRetry ? prev.retryCount + 1 : prev.retryCount
      }));

      opts.onError?.(error);

      if (shouldRetry) {
        retryTimeoutRef.current = setTimeout(() => {
          fetchData(true);
        }, opts.retryDelay);
      }

      throw error;
    }
  }, [opts, state.retryCount, getCacheKey]);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    if (!opts.immediate && !depsChanged()) {
      return;
    }

    lastDepsRef.current = [...opts.deps];
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, opts.deps);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Manual refetch function
  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Reset function
  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      isRefetching: false,
      retryCount: 0
    });
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    ...state,
    refetch,
    reset,
    clearCache,
    // Computed states
    hasData: state.data !== null,
    isInitialLoading: state.isLoading && !state.data,
    isFetching: state.isLoading || state.isRefetching
  };
}; 