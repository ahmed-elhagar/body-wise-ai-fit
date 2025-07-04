// Performance Monitoring Utility
// Track and monitor app performance across features

import React from 'react';

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  category: 'render' | 'api' | 'user-interaction' | 'navigation';
}

export interface PerformanceData {
  metrics: PerformanceMetric[];
  summary: {
    averageRenderTime: number;
    totalApiCalls: number;
    errorRate: number;
  };
}

export interface PerformanceSummary {
  averageRenderTime: number;
  totalApiCalls: number;
  errorRate: number;
  slowestComponents: Array<{
    componentName: string;
    renderTime: number;
  }>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: ((data: PerformanceData) => void)[] = [];
  private componentMetrics = new Map<string, number[]>();

  startTimer(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.addMetric({
        name,
        value: duration,
        timestamp: Date.now(),
        category: 'render'
      });
    };
  }

  addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
    
    this.notifyObservers();
  }

  trackComponentRender(componentName: string, startTime: number, propsCount?: number): void {
    const renderTime = performance.now() - startTime;
    
    if (!this.componentMetrics.has(componentName)) {
      this.componentMetrics.set(componentName, []);
    }
    
    const metrics = this.componentMetrics.get(componentName)!;
    metrics.push(renderTime);
    
    // Keep only last 10 renders per component
    if (metrics.length > 10) {
      metrics.splice(0, metrics.length - 10);
    }
    
    this.addMetric({
      name: `component_${componentName}`,
      value: renderTime,
      timestamp: Date.now(),
      category: 'render'
    });
  }

  recordMetric(metric: { name: string; value: number; unit: string; feature?: string }): void {
    this.addMetric({
      name: metric.name,
      value: metric.value,
      timestamp: Date.now(),
      category: 'api'
    });
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getSummary(): PerformanceData['summary'] {
    const renderMetrics = this.metrics.filter(m => m.category === 'render');
    const apiMetrics = this.metrics.filter(m => m.category === 'api');
    
    return {
      averageRenderTime: renderMetrics.length > 0 
        ? renderMetrics.reduce((sum, m) => sum + m.value, 0) / renderMetrics.length 
        : 0,
      totalApiCalls: apiMetrics.length,
      errorRate: 0 // Placeholder for error tracking
    };
  }

  getPerformanceSummary(): PerformanceSummary {
    const summary = this.getSummary();
    const slowestComponents: Array<{ componentName: string; renderTime: number }> = [];
    
    this.componentMetrics.forEach((times, componentName) => {
      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      slowestComponents.push({ componentName, renderTime: avgTime });
    });
    
    slowestComponents.sort((a, b) => b.renderTime - a.renderTime);
    
    return {
      ...summary,
      slowestComponents: slowestComponents.slice(0, 5)
    };
  }

  subscribe(callback: (data: PerformanceData) => void): () => void {
    this.observers.push(callback);
    
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  private notifyObservers(): void {
    const data: PerformanceData = {
      metrics: this.getMetrics(),
      summary: this.getSummary()
    };
    
    this.observers.forEach(callback => callback(data));
  }

  clear(): void {
    this.metrics = [];
    this.componentMetrics.clear();
    this.notifyObservers();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  const [data, setData] = React.useState<PerformanceData>({
    metrics: [],
    summary: {
      averageRenderTime: 0,
      totalApiCalls: 0,
      errorRate: 0
    }
  });

  React.useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe(setData);
    return unsubscribe;
  }, []);

  return {
    data,
    startTimer: performanceMonitor.startTimer.bind(performanceMonitor),
    addMetric: performanceMonitor.addMetric.bind(performanceMonitor),
    clear: performanceMonitor.clear.bind(performanceMonitor)
  };
};

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
