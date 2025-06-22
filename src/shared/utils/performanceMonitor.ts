// Performance Monitoring Utility
// Track and monitor app performance across features

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percent';
  feature?: string;
  timestamp: number;
}

export interface RenderMetric {
  componentName: string;
  renderTime: number;
  propsCount: number;
  rerenderCount: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private renderMetrics: Map<string, RenderMetric> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.setupObservers();
  }

  // Setup performance observers
  private setupObservers() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    try {
      // Long Task Observer
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric({
            name: 'long_task',
            value: entry.duration,
            unit: 'ms',
            timestamp: entry.startTime
          });
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);

      // Largest Contentful Paint Observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.recordMetric({
            name: 'largest_contentful_paint',
            value: lastEntry.startTime,
            unit: 'ms',
            timestamp: performance.now()
          });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // First Input Delay Observer
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric({
            name: 'first_input_delay',
            value: (entry as any).processingStart - entry.startTime,
            unit: 'ms',
            timestamp: entry.startTime
          });
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

    } catch (error) {
      console.warn('Performance observers not fully supported:', error);
    }
  }

  // Record a custom metric
  recordMetric(metric: Omit<PerformanceMetric, 'timestamp'> & { timestamp?: number }) {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: metric.timestamp || performance.now()
    };
    
    this.metrics.push(fullMetric);
    
    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Send to analytics if available
    this.sendToAnalytics(fullMetric);
  }

  // Track React component render performance
  trackComponentRender(componentName: string, renderStart: number, propsCount = 0) {
    const renderTime = performance.now() - renderStart;
    
    const existing = this.renderMetrics.get(componentName);
    if (existing) {
      existing.renderTime = (existing.renderTime + renderTime) / 2; // Average
      existing.rerenderCount++;
    } else {
      this.renderMetrics.set(componentName, {
        componentName,
        renderTime,
        propsCount,
        rerenderCount: 1
      });
    }

    this.recordMetric({
      name: 'component_render',
      value: renderTime,
      unit: 'ms',
      feature: componentName
    });
  }

  // Track API call performance
  trackAPICall(endpoint: string, duration: number, success: boolean) {
    this.recordMetric({
      name: success ? 'api_success' : 'api_error',
      value: duration,
      unit: 'ms',
      feature: endpoint
    });
  }

  // Track memory usage
  trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      
      this.recordMetric({
        name: 'memory_used',
        value: memory.usedJSHeapSize,
        unit: 'bytes'
      });

      this.recordMetric({
        name: 'memory_total',
        value: memory.totalJSHeapSize,
        unit: 'bytes'
      });

      this.recordMetric({
        name: 'memory_limit',
        value: memory.jsHeapSizeLimit,
        unit: 'bytes'
      });
    }
  }

  // Track bundle size and loading
  trackBundleLoad(bundleName: string, size: number, loadTime: number) {
    this.recordMetric({
      name: 'bundle_size',
      value: size,
      unit: 'bytes',
      feature: bundleName
    });

    this.recordMetric({
      name: 'bundle_load_time',
      value: loadTime,
      unit: 'ms',
      feature: bundleName
    });
  }

  // Get performance summary
  getPerformanceSummary() {
    const summary = {
      totalMetrics: this.metrics.length,
      componentMetrics: Array.from(this.renderMetrics.values()),
      averageRenderTime: 0,
      slowestComponents: [] as RenderMetric[],
      recentMetrics: this.metrics.slice(-10)
    };

    // Calculate average render time
    const renderTimes = Array.from(this.renderMetrics.values()).map(m => m.renderTime);
    if (renderTimes.length > 0) {
      summary.averageRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
    }

    // Find slowest components
    summary.slowestComponents = Array.from(this.renderMetrics.values())
      .sort((a, b) => b.renderTime - a.renderTime)
      .slice(0, 5);

    return summary;
  }

  // Send metrics to analytics service
  private sendToAnalytics(metric: PerformanceMetric) {
    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_unit: metric.unit,
        feature: metric.feature
      });
    }

    // Send to custom analytics endpoint
    if (process.env.NODE_ENV === 'production') {
      // Only send critical metrics in production
      const criticalMetrics = [
        'largest_contentful_paint',
        'first_input_delay',
        'long_task'
      ];

      if (criticalMetrics.includes(metric.name)) {
        this.sendToCustomAnalytics(metric);
      }
    }
  }

  // Send to custom analytics service
  private async sendToCustomAnalytics(metric: PerformanceMetric) {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metric)
      });
    } catch (error) {
      console.warn('Failed to send performance metric:', error);
    }
  }

  // Clear old metrics
  clearMetrics() {
    this.metrics = [];
    this.renderMetrics.clear();
  }

  // Dispose of observers
  dispose() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.clearMetrics();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React Hook for component performance tracking
export const usePerformanceTracking = (componentName: string) => {
  const renderStart = performance.now();
  
  return {
    trackRender: (propsCount?: number) => {
      performanceMonitor.trackComponentRender(componentName, renderStart, propsCount);
    }
  };
};

// Higher-order component for automatic performance tracking
export const withPerformanceTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name;
  
  return (props: P) => {
    const { trackRender } = usePerformanceTracking(displayName);
    
    // Track render on mount and updates
    React.useEffect(() => {
      trackRender(Object.keys(props).length);
    });

    return React.createElement(WrappedComponent, props);
  };
};

// Performance measurement utilities
export const measureFunction = async <T>(
  fn: () => Promise<T> | T,
  name: string,
  feature?: string
): Promise<T> => {
  const start = performance.now();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    performanceMonitor.recordMetric({
      name: `function_${name}`,
      value: duration,
      unit: 'ms',
      feature
    });
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    
    performanceMonitor.recordMetric({
      name: `function_${name}_error`,
      value: duration,
      unit: 'ms',
      feature
    });
    
    throw error;
  }
}; 