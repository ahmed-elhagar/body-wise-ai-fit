import React from 'react';

// Enhanced performance utilities for bundle optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Enhanced lazy loading helper for images
export const createLazyImageLoader = () => {
  const imageCache = new Map<string, HTMLImageElement>();
  
  return (src: string): Promise<HTMLImageElement> => {
    if (imageCache.has(src)) {
      return Promise.resolve(imageCache.get(src)!);
    }
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        imageCache.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  };
};

// Performance monitoring with better metrics
export const performanceUtils = {
  measurePerformance: async <T>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    if (import.meta.env.DEV) {
      performance.mark(`${name}-start`);
      const result = await fn();
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      // Log performance metrics
      const measure = performance.getEntriesByName(name)[0];
      if (measure) {
        console.log(`⚡ ${name}: ${measure.duration.toFixed(2)}ms`);
      }
      
      return result;
    } else {
      return await fn();
    }
  },

  // Memory usage monitoring
  getMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  },

  // Bundle size monitoring
  trackBundleLoad: (chunkName: string) => {
    const startTime = performance.now();
    return () => {
      const loadTime = performance.now() - startTime;
      console.log(`📦 Chunk "${chunkName}" loaded in ${loadTime.toFixed(2)}ms`);
    };
  },

  // Component render optimization
  optimizeRender: <T extends React.ComponentType<any>>(
    Component: T,
    shouldUpdate?: (prevProps: any, nextProps: any) => boolean
  ): React.MemoExoticComponent<T> => {
    const OptimizedComponent = React.memo(Component, shouldUpdate);
    OptimizedComponent.displayName = `Optimized(${Component.displayName || Component.name})`;
    return OptimizedComponent;
  }
};

// Resource preloading
export const resourcePreloader = {
  preloadImage: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  },

  preloadFont: (fontFamily: string, weight: string = 'normal'): void => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.crossOrigin = 'anonymous';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${weight}`;
    document.head.appendChild(link);
  },

  preloadRoute: async (routePath: string): Promise<void> => {
    try {
      const module = await import(/* webpackChunkName: "route-[request]" */ `@/pages${routePath}`);
      console.log(`🚀 Route "${routePath}" preloaded`);
    } catch (error) {
      console.warn(`Failed to preload route "${routePath}":`, error);
    }
  }
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null => {
  if (typeof IntersectionObserver !== 'undefined') {
    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    });
  }
  return null;
};
