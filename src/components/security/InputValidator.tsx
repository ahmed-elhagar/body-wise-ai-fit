
import { z } from 'zod';

// Comprehensive input validation schemas
export const SecuritySchemas = {
  // Text inputs with XSS protection
  safeText: z.string()
    .min(1, 'This field is required')
    .max(500, 'Text too long')
    .refine(
      (value) => !/<script|javascript:|on\w+=/i.test(value),
      'Invalid characters detected'
    ),

  // Email validation
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .refine(
      (value) => !/<script|javascript:/i.test(value),
      'Invalid email format'
    ),

  // Password with strength requirements
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .refine(
      (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value),
      'Password must contain uppercase, lowercase, and number'
    ),

  // Numeric inputs
  positiveNumber: z.number()
    .positive('Must be a positive number')
    .max(9999999, 'Number too large'),

  // File upload validation
  imageFile: z.object({
    size: z.number().max(10 * 1024 * 1024, 'File too large (max 10MB)'),
    type: z.string().refine(
      (type) => ['image/jpeg', 'image/png', 'image/webp'].includes(type),
      'Invalid file type'
    )
  }),

  // URL validation
  url: z.string()
    .url('Invalid URL format')
    .refine(
      (value) => /^https?:\/\//.test(value),
      'Only HTTP/HTTPS URLs allowed'
    ),

  // User input for names
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name too long')
    .refine(
      (value) => /^[a-zA-Z\s\u0600-\u06FF\u0750-\u077F]+$/.test(value),
      'Name contains invalid characters'
    )
};

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

// Rate limiting tracker for client-side
class RateLimiter {
  private attempts = new Map<string, number[]>();

  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// Security headers checker
export const checkSecurityHeaders = () => {
  const requiredHeaders = [
    'x-frame-options',
    'x-content-type-options',
    'x-xss-protection'
  ];

  const missingHeaders = requiredHeaders.filter(header => 
    !document.querySelector(`meta[http-equiv="${header}"]`)
  );

  if (missingHeaders.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Missing security headers:', missingHeaders);
  }
};
