
interface ErrorMetrics {
  errorCount: number;
  lastError: Date | null;
  errorTypes: Record<string, number>;
  features: Record<string, number>;
}

class ErrorMonitoring {
  private metrics: ErrorMetrics = {
    errorCount: 0,
    lastError: null,
    errorTypes: {},
    features: {}
  };

  logError(error: Error, feature?: string, context?: string) {
    this.metrics.errorCount++;
    this.metrics.lastError = new Date();
    
    // Track error types
    const errorType = error.name || 'Unknown';
    this.metrics.errorTypes[errorType] = (this.metrics.errorTypes[errorType] || 0) + 1;
    
    // Track feature errors
    if (feature) {
      this.metrics.features[feature] = (this.metrics.features[feature] || 0) + 1;
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error in ${feature || 'Unknown Feature'}`);
      console.error('Error:', error);
      console.log('Context:', context);
      console.log('Current Metrics:', this.metrics);
      console.groupEnd();
    }
  }

  getMetrics(): ErrorMetrics {
    return { ...this.metrics };
  }

  resetMetrics() {
    this.metrics = {
      errorCount: 0,
      lastError: null,
      errorTypes: {},
      features: {}
    };
  }

  // Get error rate for a specific time window
  getErrorRate(windowMinutes: number = 10): number {
    if (!this.metrics.lastError) return 0;
    
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);
    
    // This is a simplified calculation - in a real app you'd track errors over time
    return this.metrics.lastError > windowStart ? this.metrics.errorCount : 0;
  }
}

export const errorMonitoring = new ErrorMonitoring();

// Global error handler for unhandled errors
window.addEventListener('error', (event) => {
  errorMonitoring.logError(event.error, 'Global', 'Unhandled Error');
});

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
  errorMonitoring.logError(error, 'Global', 'Unhandled Promise Rejection');
});

export default errorMonitoring;
