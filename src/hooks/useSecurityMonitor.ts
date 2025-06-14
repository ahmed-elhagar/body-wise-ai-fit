import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface SecurityEvent {
  type: 'suspicious_activity' | 'rate_limit' | 'csrf_attempt' | 'xss_attempt';
  details: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private listeners: Set<(event: SecurityEvent) => void> = new Set();

  logEvent(event: Omit<SecurityEvent, 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    };

    this.events.push(securityEvent);
    
    // Keep only last 100 events
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(securityEvent));

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('🛡️ Security Event:', securityEvent);
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportToMonitoringService(securityEvent);
    }
  }

  private async reportToMonitoringService(event: SecurityEvent) {
    try {
      // In production, this would send to your monitoring service
      console.log('📊 Security event reported:', event);
    } catch (error) {
      console.error('Failed to report security event:', error);
    }
  }

  addListener(listener: (event: SecurityEvent) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getEvents(): SecurityEvent[] {
    return [...this.events];
  }

  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  getRecentEvents(minutes: number = 10): SecurityEvent[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.events.filter(event => event.timestamp > cutoff);
  }
}

export const securityMonitor = new SecurityMonitor();

export const useSecurityMonitor = () => {
  const reportSuspiciousActivity = useCallback((details: string, severity: SecurityEvent['severity'] = 'medium') => {
    securityMonitor.logEvent({
      type: 'suspicious_activity',
      details,
      severity
    });

    if (severity === 'high' || severity === 'critical') {
      toast.error('Suspicious activity detected. Please contact support if this continues.');
    }
  }, []);

  const reportRateLimit = useCallback((resource: string) => {
    securityMonitor.logEvent({
      type: 'rate_limit',
      details: `Rate limit exceeded for ${resource}`,
      severity: 'medium'
    });
  }, []);

  const reportCSRFAttempt = useCallback((details: string) => {
    securityMonitor.logEvent({
      type: 'csrf_attempt',
      details,
      severity: 'high'
    });
    
    toast.error('Security validation failed. Please refresh the page.');
  }, []);

  const reportXSSAttempt = useCallback((input: string) => {
    securityMonitor.logEvent({
      type: 'xss_attempt',
      details: `Potential XSS attempt blocked: ${input.substring(0, 100)}...`,
      severity: 'high'
    });
    
    toast.error('Invalid input detected. Please check your input and try again.');
  }, []);

  // Monitor for suspicious patterns
  useEffect(() => {
    const removeListener = securityMonitor.addListener((event) => {
      // Check for patterns that might indicate an attack
      const recentEvents = securityMonitor.getRecentEvents(5);
      
      if (recentEvents.length > 10) {
        console.warn('🚨 High frequency of security events detected');
      }

      const rateLimitEvents = recentEvents.filter(e => e.type === 'rate_limit');
      if (rateLimitEvents.length > 3) {
        console.warn('🚨 Multiple rate limit violations detected');
      }
    });

    return removeListener;
  }, []);

  return {
    reportSuspiciousActivity,
    reportRateLimit,
    reportCSRFAttempt,
    reportXSSAttempt,
    getEvents: securityMonitor.getEvents.bind(securityMonitor),
    getRecentEvents: securityMonitor.getRecentEvents.bind(securityMonitor)
  };
};
