
import { z } from 'zod';

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const bodyStatsSchema = z.object({
  age: z.number().min(13).max(120),
  height: z.number().min(100).max(250),
  weight: z.number().min(30).max(300),
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']),
});

export const mapBodyFatToBodyShape = (bodyFatPercentage: number, gender: 'male' | 'female'): string => {
  if (gender === 'male') {
    if (bodyFatPercentage < 6) return 'athletic';
    if (bodyFatPercentage < 14) return 'fit';
    if (bodyFatPercentage < 18) return 'average';
    if (bodyFatPercentage < 25) return 'above_average';
    return 'high';
  } else {
    if (bodyFatPercentage < 16) return 'athletic';
    if (bodyFatPercentage < 21) return 'fit';
    if (bodyFatPercentage < 25) return 'average';
    if (bodyFatPercentage < 32) return 'above_average';
    return 'high';
  }
};

export const isValidBodyShape = (shape: string): boolean => {
  const validShapes = ['athletic', 'fit', 'average', 'above_average', 'high'];
  return validShapes.includes(shape);
};

export const calculateBMI = (weight: number, height: number): number => {
  return weight / Math.pow(height / 100, 2);
};

export const validatePersonalInfo = (data: any) => {
  return personalInfoSchema.safeParse(data);
};

export const validateBodyStats = (data: any) => {
  return bodyStatsSchema.safeParse(data);
};
