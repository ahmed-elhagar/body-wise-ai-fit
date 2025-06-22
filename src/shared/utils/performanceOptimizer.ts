// Advanced Performance Optimization Utilities
// Building on existing performanceMonitor.ts for Phase 3A optimizations

import React, { ComponentType, memo, useMemo, useCallback } from 'react';
import { performanceMonitor } from './performanceMonitor';

export interface OptimizationConfig {
  enableMemo?: boolean;
  enablePerformanceTracking?: boolean;
  enableVirtualization?: boolean;
  enableImageOptimization?: boolean;
  enableBundleOptimization?: boolean;
}

export interface ComponentOptimizationOptions {
  displayName?: string;
  shouldUpdate?: (prevProps: any, nextProps: any) => boolean;
  trackPerformance?: boolean;
  enableProfiling?: boolean;
}

// Enhanced React.memo with performance tracking
export const createOptimizedComponent = <P extends object>(
  Component: ComponentType<P>,
  options: ComponentOptimizationOptions = {}
) => {
  const {
    displayName,
    shouldUpdate,
    trackPerformance = true,
    enableProfiling = process.env.NODE_ENV === 'development'
  } = options;

  const OptimizedComponent = memo(Component, shouldUpdate);
  
  if (displayName) {
    OptimizedComponent.displayName = displayName;
  }

  // Add performance tracking wrapper if enabled
  if (trackPerformance) {
    return (props: P) => {
      const renderStart = performance.now();
      
      React.useEffect(() => {
        if (enableProfiling) {
          const renderTime = performance.now() - renderStart;
          performanceMonitor.trackComponentRender(
            displayName || Component.displayName || Component.name || 'Unknown',
            renderStart,
            Object.keys(props).length
          );
        }
      });

      return React.createElement(OptimizedComponent, props as any);
    };
  }

  return OptimizedComponent;
};

// Optimized hook factory for expensive computations
export const createOptimizedHook = <T, P extends any[]>(
  computeFn: (...args: P) => T,
  dependencies?: React.DependencyList
) => {
  return (...args: P): T => {
    return useMemo(() => {
      const start = performance.now();
      const result = computeFn(...args);
      const duration = performance.now() - start;
      
      if (duration > 16) { // More than one frame
        console.warn(`Expensive computation detected: ${duration.toFixed(2)}ms`);
      }
      
      return result;
    }, dependencies || args);
  };
};

// Bundle size optimization utilities
export class BundleOptimizer {
  private static instance: BundleOptimizer;
  private loadedChunks = new Set<string>();
  private preloadQueue = new Map<string, Promise<any>>();

  static getInstance(): BundleOptimizer {
    if (!this.instance) {
      this.instance = new BundleOptimizer();
    }
    return this.instance;
  }

  // Intelligent preloading based on user behavior
  preloadChunk(chunkName: string, importFn: () => Promise<any>, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<any> {
    if (this.loadedChunks.has(chunkName)) {
      return Promise.resolve();
    }

    if (this.preloadQueue.has(chunkName)) {
      return this.preloadQueue.get(chunkName)!;
    }

    const preloadPromise = this.schedulePreload(importFn, priority);
    this.preloadQueue.set(chunkName, preloadPromise);

    preloadPromise.then(() => {
      this.loadedChunks.add(chunkName);
      this.preloadQueue.delete(chunkName);
    });

    return preloadPromise;
  }

  private schedulePreload(importFn: () => Promise<any>, priority: 'high' | 'medium' | 'low'): Promise<any> {
    const delay = priority === 'high' ? 0 : priority === 'medium' ? 100 : 500;
    
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const module = await importFn();
          resolve(module);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }

  // Monitor bundle performance
  getBundleMetrics() {
    return {
      loadedChunks: Array.from(this.loadedChunks),
      pendingPreloads: this.preloadQueue.size,
      memoryUsage: this.getMemoryUsage()
    };
  }

  private getMemoryUsage() {
    if ('memory' in performance) {
      return {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      };
    }
    return null;
  }
}

// Virtualization helper for large lists
export const createVirtualizedList = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  return useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2; // Buffer
    const totalHeight = items.length * itemHeight;
    
    return {
      totalHeight,
      visibleCount,
      getVisibleItems: (scrollTop: number) => {
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(startIndex + visibleCount, items.length);
        
        return {
          startIndex,
          endIndex,
          items: items.slice(startIndex, endIndex),
          offsetY: startIndex * itemHeight
        };
      }
    };
  }, [items, itemHeight, containerHeight]);
};

// Debounce utility for performance optimization
export const createDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle utility for performance optimization
export const createThrottle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Performance-optimized event handlers
export const createOptimizedEventHandler = <T extends any[]>(
  handler: (...args: T) => void,
  dependencies: React.DependencyList,
  debounceMs?: number
) => {
  const optimizedHandler = useCallback(handler, dependencies);
  
  if (debounceMs) {
    return useCallback(
      (...args: T) => {
        const timeoutId = setTimeout(() => optimizedHandler(...args), debounceMs);
        return () => clearTimeout(timeoutId);
      },
      [optimizedHandler, debounceMs]
    );
  }
  
  return optimizedHandler;
};

// Component size analyzer
export const analyzeComponentSize = (componentPath: string): Promise<{
  lineCount: number;
  complexity: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}> => {
  return new Promise((resolve) => {
    // Simulate component analysis
    fetch(componentPath)
      .then(response => response.text())
      .then(content => {
        const lineCount = content.split('\n').length;
        let complexity: 'low' | 'medium' | 'high' | 'critical';
        const recommendations: string[] = [];

        if (lineCount < 100) {
          complexity = 'low';
        } else if (lineCount < 250) {
          complexity = 'medium';
          recommendations.push('Consider splitting into smaller components');
        } else if (lineCount < 400) {
          complexity = 'high';
          recommendations.push('Component is getting large - refactor recommended');
          recommendations.push('Extract sub-components and custom hooks');
        } else {
          complexity = 'critical';
          recommendations.push('URGENT: Component exceeds 400 lines');
          recommendations.push('Split into multiple components immediately');
          recommendations.push('Extract business logic into custom hooks');
          recommendations.push('Consider using compound component pattern');
        }

        resolve({ lineCount, complexity, recommendations });
      })
      .catch(() => {
        resolve({ 
          lineCount: 0, 
          complexity: 'low', 
          recommendations: ['Unable to analyze component'] 
        });
      });
  });
};

// Global performance optimization instance
export const performanceOptimizer = {
  bundleOptimizer: BundleOptimizer.getInstance(),
  
  // Initialize optimization features
  initialize(config: OptimizationConfig = {}) {
    console.log('🚀 Performance Optimizer initialized', config);
    
    // Set up intersection observer for lazy loading
    if (config.enableImageOptimization) {
      this.setupImageOptimization();
    }
    
    // Monitor bundle performance
    if (config.enableBundleOptimization) {
      this.monitorBundlePerformance();
    }
  },

  setupImageOptimization() {
    // Implement intersection observer for images
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // Auto-observe images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  },

  monitorBundlePerformance() {
    // Monitor bundle loading performance
    setInterval(() => {
      const metrics = this.bundleOptimizer.getBundleMetrics();
      if (metrics.memoryUsage) {
        const memoryUsagePercent = (metrics.memoryUsage.usedJSHeapSize / metrics.memoryUsage.jsHeapSizeLimit) * 100;
        if (memoryUsagePercent > 80) {
          console.warn('🚨 High memory usage detected:', memoryUsagePercent.toFixed(2) + '%');
        }
      }
    }, 30000); // Check every 30 seconds
  },

  // Get optimization recommendations
  getOptimizationRecommendations() {
    const summary = performanceMonitor.getPerformanceSummary();
    const recommendations: string[] = [];

    // Analyze render performance
    if (summary.averageRenderTime > 16) {
      recommendations.push(`Average render time (${summary.averageRenderTime.toFixed(2)}ms) exceeds 16ms target`);
    }

    // Check for slow components
    summary.slowestComponents.forEach(component => {
      if (component.renderTime > 50) {
        recommendations.push(`${component.componentName} renders slowly (${component.renderTime.toFixed(2)}ms)`);
      }
    });

    // Bundle size recommendations
    const bundleMetrics = this.bundleOptimizer.getBundleMetrics();
    if (bundleMetrics.pendingPreloads > 5) {
      recommendations.push('Too many pending preloads - consider lazy loading strategy');
    }

    return recommendations;
  }
};

export default performanceOptimizer; 