
export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): ValidationError | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { field: 'email', message: 'Email is required' };
  if (!emailRegex.test(email)) return { field: 'email', message: 'Invalid email format' };
  return null;
};

export const validatePassword = (password: string): ValidationError | null => {
  if (!password) return { field: 'password', message: 'Password is required' };
  if (password.length < 6) return { field: 'password', message: 'Password must be at least 6 characters' };
  return null;
};

export const validateName = (name: string, fieldName: string): ValidationError | null => {
  if (!name || name.trim().length === 0) {
    return { field: fieldName, message: `${fieldName} is required` };
  }
  if (name.trim().length < 2) {
    return { field: fieldName, message: `${fieldName} must be at least 2 characters` };
  }
  return null;
};

export const validateAge = (age: number): ValidationError | null => {
  if (!age || age < 13) return { field: 'age', message: 'Age must be at least 13' };
  if (age > 120) return { field: 'age', message: 'Age must be less than 120' };
  return null;
};

export const validateWeight = (weight: number): ValidationError | null => {
  if (!weight || weight < 30) return { field: 'weight', message: 'Weight must be at least 30kg' };
  if (weight > 300) return { field: 'weight', message: 'Weight must be less than 300kg' };
  return null;
};

export const validateHeight = (height: number): ValidationError | null => {
  if (!height || height < 100) return { field: 'height', message: 'Height must be at least 100cm' };
  if (height > 250) return { field: 'height', message: 'Height must be less than 250cm' };
  return null;
};
