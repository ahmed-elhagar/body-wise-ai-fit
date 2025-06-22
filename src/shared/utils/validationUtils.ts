// Shared Validation Utilities
// Common validation functions used across all features

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRule {
  test: (value: any) => boolean;
  message: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

// Nutrition validation
export const validateNutritionValue = (value: number, min = 0, max = 10000): ValidationResult => {
  const errors: string[] = [];
  
  if (typeof value !== 'number' || isNaN(value)) {
    errors.push('Value must be a valid number');
  } else if (value < min) {
    errors.push(`Value must be at least ${min}`);
  } else if (value > max) {
    errors.push(`Value cannot exceed ${max}`);
  }
  
  return { isValid: errors.length === 0, errors };
};

// Phone number validation
export const validatePhoneNumber = (phone: string): ValidationResult => {
  const errors: string[] = [];
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
  
  if (!phone) {
    errors.push('Phone number is required');
  } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    errors.push('Please enter a valid phone number');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Name validation
export const validateName = (name: string, fieldName = 'Name'): ValidationResult => {
  const errors: string[] = [];
  
  if (!name || name.trim().length === 0) {
    errors.push(`${fieldName} is required`);
  } else if (name.trim().length < 2) {
    errors.push(`${fieldName} must be at least 2 characters long`);
  } else if (name.trim().length > 50) {
    errors.push(`${fieldName} cannot exceed 50 characters`);
  } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(name)) {
    errors.push(`${fieldName} can only contain letters and spaces`);
  }
  
  return { isValid: errors.length === 0, errors };
};

// Age validation
export const validateAge = (age: number): ValidationResult => {
  const errors: string[] = [];
  
  if (typeof age !== 'number' || isNaN(age)) {
    errors.push('Age must be a valid number');
  } else if (age < 13) {
    errors.push('Age must be at least 13 years');
  } else if (age > 120) {
    errors.push('Age must be less than 120 years');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Weight validation
export const validateWeight = (weight: number, unit = 'kg'): ValidationResult => {
  const errors: string[] = [];
  const minWeight = unit === 'kg' ? 30 : 66; // 30kg or 66lbs
  const maxWeight = unit === 'kg' ? 300 : 660; // 300kg or 660lbs
  
  if (typeof weight !== 'number' || isNaN(weight)) {
    errors.push('Weight must be a valid number');
  } else if (weight < minWeight) {
    errors.push(`Weight must be at least ${minWeight}${unit}`);
  } else if (weight > maxWeight) {
    errors.push(`Weight cannot exceed ${maxWeight}${unit}`);
  }
  
  return { isValid: errors.length === 0, errors };
};

// Height validation
export const validateHeight = (height: number, unit = 'cm'): ValidationResult => {
  const errors: string[] = [];
  const minHeight = unit === 'cm' ? 100 : 39; // 100cm or 39in
  const maxHeight = unit === 'cm' ? 250 : 98; // 250cm or 98in
  
  if (typeof height !== 'number' || isNaN(height)) {
    errors.push('Height must be a valid number');
  } else if (height < minHeight) {
    errors.push(`Height must be at least ${minHeight}${unit}`);
  } else if (height > maxHeight) {
    errors.push(`Height cannot exceed ${maxHeight}${unit}`);
  }
  
  return { isValid: errors.length === 0, errors };
};

// URL validation
export const validateUrl = (url: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!url) {
    errors.push('URL is required');
  } else {
    try {
      new URL(url);
    } catch {
      errors.push('Please enter a valid URL');
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

// File validation
export const validateFile = (file: File, options?: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  required?: boolean;
}): ValidationResult => {
  const errors: string[] = [];
  const { maxSize = 5 * 1024 * 1024, allowedTypes = [], required = false } = options || {};
  
  if (!file) {
    if (required) {
      errors.push('File is required');
    }
    return { isValid: !required, errors };
  }
  
  if (maxSize && file.size > maxSize) {
    errors.push(`File size cannot exceed ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }
  
  return { isValid: errors.length === 0, errors };
};

// Generic field validation
export const validateField = (value: any, rules: ValidationRule[]): ValidationResult => {
  const errors: string[] = [];
  
  for (const rule of rules) {
    if (!rule.test(value)) {
      errors.push(rule.message);
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

// Form validation
export const validateForm = (data: Record<string, any>, schema: Record<string, ValidationRule[]>): ValidationResult => {
  const errors: string[] = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const fieldResult = validateField(data[field], rules);
    if (!fieldResult.isValid) {
      errors.push(...fieldResult.errors.map(error => `${field}: ${error}`));
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

// Common validation rules
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: (value) => value !== null && value !== undefined && value !== '',
    message
  }),
  
  minLength: (length: number, message?: string): ValidationRule => ({
    test: (value) => typeof value === 'string' && value.length >= length,
    message: message || `Must be at least ${length} characters`
  }),
  
  maxLength: (length: number, message?: string): ValidationRule => ({
    test: (value) => typeof value === 'string' && value.length <= length,
    message: message || `Cannot exceed ${length} characters`
  }),
  
  pattern: (regex: RegExp, message: string): ValidationRule => ({
    test: (value) => typeof value === 'string' && regex.test(value),
    message
  }),
  
  range: (min: number, max: number, message?: string): ValidationRule => ({
    test: (value) => typeof value === 'number' && value >= min && value <= max,
    message: message || `Must be between ${min} and ${max}`
  })
}; 