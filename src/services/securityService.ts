
import { securityMonitor } from '@/hooks/useSecurityMonitor';
import { sanitizeInput } from '@/components/security/InputValidator';

export interface SecurityValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: any;
}

export class SecurityService {
  static validateRequest(data: any, endpoint: string): SecurityValidationResult {
    const errors: string[] = [];
    let sanitizedData = { ...data };

    // Check for common attack patterns
    if (this.detectXSSAttempt(data)) {
      errors.push('Invalid characters detected in input');
      securityMonitor.logEvent({
        type: 'xss_attempt',
        details: `XSS attempt detected in ${endpoint}`,
        severity: 'high'
      });
    }

    // Check for SQL injection patterns
    if (this.detectSQLInjection(data)) {
      errors.push('Invalid input format detected');
      securityMonitor.logEvent({
        type: 'suspicious_activity',
        details: `Potential SQL injection attempt in ${endpoint}`,
        severity: 'high'
      });
    }

    // Sanitize string inputs
    sanitizedData = this.sanitizeObjectInputs(sanitizedData);

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData
    };
  }

  private static detectXSSAttempt(data: any): boolean {
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];

    const dataString = JSON.stringify(data).toLowerCase();
    return xssPatterns.some(pattern => pattern.test(dataString));
  }

  private static detectSQLInjection(data: any): boolean {
    const sqlPatterns = [
      /(\b(select|insert|update|delete|drop|union|exec)\b)/i,
      /(--|\#|\/\*|\*\/)/,
      /(\bor\b.*=.*\bor\b)/i,
      /(\band\b.*=.*\band\b)/i
    ];

    const dataString = JSON.stringify(data).toLowerCase();
    return sqlPatterns.some(pattern => pattern.test(dataString));
  }

  private static sanitizeObjectInputs(obj: any): any {
    if (typeof obj === 'string') {
      return sanitizeInput(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObjectInputs(item));
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeObjectInputs(value);
      }
      return sanitized;
    }
    
    return obj;
  }

  static validateCSRFToken(token: string, expectedToken: string): boolean {
    if (!token || !expectedToken) {
      securityMonitor.logEvent({
        type: 'csrf_attempt',
        details: 'Missing CSRF token',
        severity: 'high'
      });
      return false;
    }

    if (token !== expectedToken) {
      securityMonitor.logEvent({
        type: 'csrf_attempt',
        details: 'Invalid CSRF token',
        severity: 'high'
      });
      return false;
    }

    return true;
  }

  static checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 3600000): boolean {
    // Implementation would connect to a rate limiting service
    // For now, we'll use a simple in-memory approach
    const now = Date.now();
    const key = `rate_limit_${identifier}`;
    
    // In production, this would use Redis or similar
    const requests = this.getStoredRequests(key, windowMs);
    
    if (requests.length >= maxRequests) {
      securityMonitor.logEvent({
        type: 'rate_limit',
        details: `Rate limit exceeded for ${identifier}`,
        severity: 'medium'
      });
      return false;
    }

    this.storeRequest(key, now);
    return true;
  }

  private static getStoredRequests(key: string, windowMs: number): number[] {
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    
    const requests: number[] = JSON.parse(stored);
    const cutoff = Date.now() - windowMs;
    
    return requests.filter(timestamp => timestamp > cutoff);
  }

  private static storeRequest(key: string, timestamp: number): void {
    const existing = this.getStoredRequests(key, 3600000);
    existing.push(timestamp);
    localStorage.setItem(key, JSON.stringify(existing));
  }
}
