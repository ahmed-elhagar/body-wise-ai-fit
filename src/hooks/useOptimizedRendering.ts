
import { useCallback, useMemo, useRef } from 'react';
import { debounce, throttle } from '@/utils/performanceUtils';

export const useOptimizedRendering = () => {
  const renderCountRef = useRef(0);
  
  // Memoized debounced functions
  const createDebouncedCallback = useCallback(
    (fn: (...args: any[]) => void, delay: number = 300) => {
      return debounce(fn, delay);
    },
    []
  );

  const createThrottledCallback = useCallback(
    (fn: (...args: any[]) => void, limit: number = 100) => {
      return throttle(fn, limit);
    },
    []
  );

  // Render optimization utilities
  const trackRender = useCallback(() => {
    renderCountRef.current += 1;
    if (import.meta.env.DEV) {
      console.log(`Component rendered ${renderCountRef.current} times`);
    }
  }, []);

  const memoizeProps = useCallback(
    <T extends Record<string, any>>(props: T): T => {
      return useMemo(() => props, [JSON.stringify(props)]);
    },
    []
  );

  return {
    createDebouncedCallback,
    createThrottledCallback,
    trackRender,
    memoizeProps,
    renderCount: renderCountRef.current
  };
};

// Hook for optimizing list rendering
export const useVirtualizedList = <T>(
  items: T[],
  itemHeight: number = 60,
  containerHeight: number = 400
) => {
  const visibleItemsCount = Math.ceil(containerHeight / itemHeight) + 2; // Buffer
  
  return useMemo(() => {
    const startIndex = 0; // Could be calculated based on scroll position
    const endIndex = Math.min(startIndex + visibleItemsCount, items.length);
    
    return {
      visibleItems: items.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      totalHeight: items.length * itemHeight,
      containerStyle: {
        height: containerHeight,
        overflow: 'auto'
      }
    };
  }, [items, itemHeight, containerHeight, visibleItemsCount]);
};
