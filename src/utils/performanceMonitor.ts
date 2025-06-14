
import { toast } from 'sonner';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  type: 'navigation' | 'resource' | 'paint' | 'custom';
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private thresholds = {
    firstContentfulPaint: 2000, // 2 seconds
    largestContentfulPaint: 4000, // 4 seconds
    firstInputDelay: 100, // 100ms
    cumulativeLayoutShift: 0.1,
    timeToInteractive: 5000, // 5 seconds
    customOperation: 3000 // 3 seconds for custom operations
  };

  startPerformanceMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.observeWebVitals();
    
    // Monitor navigation timing
    this.observeNavigationTiming();
    
    // Monitor resource loading
    this.observeResourceTiming();
    
    // Monitor long tasks
    this.observeLongTasks();
  }

  private observeWebVitals() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.recordMetric('First Contentful Paint', entry.startTime, 'paint');
          if (entry.startTime > this.thresholds.firstContentfulPaint) {
            console.warn('⚠️ Slow First Contentful Paint:', entry.startTime + 'ms');
          }
        }
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.recordMetric('Largest Contentful Paint', lastEntry.startTime, 'paint');
      if (lastEntry.startTime > this.thresholds.largestContentfulPaint) {
        console.warn('⚠️ Slow Largest Contentful Paint:', lastEntry.startTime + 'ms');
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let cumulativeScore = 0;
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          cumulativeScore += (entry as any).value;
        }
      }
      if (cumulativeScore > 0) {
        this.recordMetric('Cumulative Layout Shift', cumulativeScore, 'custom');
        if (cumulativeScore > this.thresholds.cumulativeLayoutShift) {
          console.warn('⚠️ High Cumulative Layout Shift:', cumulativeScore);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = (entry as any).processingStart - entry.startTime;
        this.recordMetric('First Input Delay', fid, 'custom');
        if (fid > this.thresholds.firstInputDelay) {
          console.warn('⚠️ Slow First Input Delay:', fid + 'ms');
        }
      }
    }).observe({ entryTypes: ['first-input'] });
  }

  private observeNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navTiming) {
        const domContentLoaded = navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart;
        const loadComplete = navTiming.loadEventEnd - navTiming.loadEventStart;
        
        this.recordMetric('DOM Content Loaded', domContentLoaded, 'navigation');
        this.recordMetric('Load Complete', loadComplete, 'navigation');
      }
    }
  }

  private observeResourceTiming() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        const loadTime = resource.responseEnd - resource.startTime;
        
        // Track slow resources
        if (loadTime > 1000) { // 1 second threshold
          console.warn('⚠️ Slow resource:', resource.name, loadTime + 'ms');
          this.recordMetric(`Resource: ${resource.name.split('/').pop()}`, loadTime, 'resource');
        }
      }
    }).observe({ entryTypes: ['resource'] });
  }

  private observeLongTasks() {
    if ('PerformanceObserver' in window) {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn('⚠️ Long task detected:', entry.duration + 'ms');
          this.recordMetric('Long Task', entry.duration, 'custom');
          
          // Show user notification for very long tasks
          if (entry.duration > 500) { // 500ms threshold
            toast.warning('The page is experiencing performance issues...');
          }
        }
      }).observe({ entryTypes: ['longtask'] });
    }
  }

  recordMetric(name: string, value: number, type: PerformanceMetric['type']) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      type
    };

    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Performance Metric:', metric);
    }
  }

  measureCustomOperation<T>(name: string, operation: () => T | Promise<T>): T | Promise<T> {
    const startTime = performance.now();
    
    const result = operation();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - startTime;
        this.recordMetric(name, duration, 'custom');
        if (duration > this.thresholds.customOperation) {
          console.warn(`⚠️ Slow operation: ${name} took ${duration.toFixed(2)}ms`);
        }
      });
    } else {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration, 'custom');
      if (duration > this.thresholds.customOperation) {
        console.warn(`⚠️ Slow operation: ${name} took ${duration.toFixed(2)}ms`);
      }
      return result;
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getMetricsByType(type: PerformanceMetric['type']): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.type === type);
  }

  getMetricSummary() {
    const summary = {
      totalMetrics: this.metrics.length,
      averagesByType: {} as Record<string, number>,
      slowOperations: this.metrics.filter(m => m.value > 1000)
    };

    // Calculate averages by type
    const typeGroups = this.metrics.reduce((groups, metric) => {
      if (!groups[metric.type]) groups[metric.type] = [];
      groups[metric.type].push(metric.value);
      return groups;
    }, {} as Record<string, number[]>);

    Object.entries(typeGroups).forEach(([type, values]) => {
      summary.averagesByType[type] = values.reduce((a, b) => a + b, 0) / values.length;
    });

    return summary;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.startPerformanceMonitoring();
}
