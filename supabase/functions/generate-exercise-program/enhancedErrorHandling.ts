
// Enhanced error handling system for exercise program generation
export class ExerciseProgramError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isUserFriendly: boolean = false,
    public arabicMessage?: string
  ) {
    super(message);
    this.name = 'ExerciseProgramError';
  }
}

export const errorCodes = {
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_USER_PROFILE: 'INVALID_USER_PROFILE',
  AI_GENERATION_FAILED: 'AI_GENERATION_FAILED',
  DATABASE_ERROR: 'DATABASE_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  OPENAI_API_ERROR: 'OPENAI_API_ERROR',
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  WORKOUT_TYPE_INVALID: 'WORKOUT_TYPE_INVALID'
} as const;

export const createUserFriendlyError = (code: string, language: string = 'en'): ExerciseProgramError => {
  const errorMessages = {
    en: {
      [errorCodes.RATE_LIMIT_EXCEEDED]: 'You have reached your daily exercise program generation limit. Please try again tomorrow or upgrade your plan.',
      [errorCodes.INVALID_USER_PROFILE]: 'Your profile information is incomplete. Please update your fitness goals and try again.',
      [errorCodes.AI_GENERATION_FAILED]: 'Our AI service is temporarily unavailable. Please try again in a few minutes.',
      [errorCodes.DATABASE_ERROR]: 'A temporary database error occurred. Please try again.',
      [errorCodes.VALIDATION_ERROR]: 'The exercise program data is invalid. Please check your preferences and try again.',
      [errorCodes.OPENAI_API_ERROR]: 'AI service is temporarily overloaded. Please try again in a few minutes.',
      [errorCodes.INSUFFICIENT_CREDITS]: 'You have insufficient AI generation credits. Please upgrade your plan or wait for your credits to reset.',
      [errorCodes.WORKOUT_TYPE_INVALID]: 'Invalid workout type selected. Please choose either home or gym workout.'
    },
    ar: {
      [errorCodes.RATE_LIMIT_EXCEEDED]: 'لقد وصلت إلى الحد اليومي لتوليد برامج التمارين. يرجى المحاولة غداً أو ترقية خطتك.',
      [errorCodes.INVALID_USER_PROFILE]: 'معلومات ملفك الشخصي غير مكتملة. يرجى تحديث أهدافك الرياضية والمحاولة مرة أخرى.',
      [errorCodes.AI_GENERATION_FAILED]: 'خدمة الذكاء الاصطناعي غير متاحة مؤقتاً. يرجى المحاولة خلال دقائق قليلة.',
      [errorCodes.DATABASE_ERROR]: 'حدث خطأ مؤقت في قاعدة البيانات. يرجى المحاولة مرة أخرى.',
      [errorCodes.VALIDATION_ERROR]: 'بيانات برنامج التمارين غير صالحة. يرجى التحقق من تفضيلاتك والمحاولة مرة أخرى.',
      [errorCodes.OPENAI_API_ERROR]: 'خدمة الذكاء الاصطناعي محملة بشكل مؤقت. يرجى المحاولة خلال دقائق قليلة.',
      [errorCodes.INSUFFICIENT_CREDITS]: 'ليس لديك رصيد كافٍ لتوليد الذكاء الاصطناعي. يرجى ترقية خطتك أو انتظار إعادة تعيين الرصيد.',
      [errorCodes.WORKOUT_TYPE_INVALID]: 'نوع التمرين المختار غير صالح. يرجى اختيار تمارين منزلية أو صالة ألعاب رياضية.'
    }
  };

  const messages = errorMessages[language] || errorMessages.en;
  const message = messages[code] || 'An unexpected error occurred. Please try again.';
  const arabicMessage = language === 'ar' ? message : errorMessages.ar[code];

  return new ExerciseProgramError(message, code, 400, true, arabicMessage);
};

export const handleExerciseProgramError = (error: any, language: string = 'en') => {
  console.error('=== EXERCISE PROGRAM ERROR ===', {
    error: error.message,
    stack: error.stack,
    code: error.code,
    timestamp: new Date().toISOString()
  });

  // Handle known error types
  if (error instanceof ExerciseProgramError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      arabicMessage: error.arabicMessage,
      statusCode: error.statusCode
    };
  }

  // Handle OpenAI API errors
  if (error.message?.includes('overloaded') || error.message?.includes('429')) {
    const userError = createUserFriendlyError(errorCodes.OPENAI_API_ERROR, language);
    return {
      success: false,
      error: userError.message,
      code: userError.code,
      arabicMessage: userError.arabicMessage,
      statusCode: 429
    };
  }

  // Handle rate limiting
  if (error.message?.includes('limit reached') || error.message?.includes('limit exceeded')) {
    const userError = createUserFriendlyError(errorCodes.RATE_LIMIT_EXCEEDED, language);
    return {
      success: false,
      error: userError.message,
      code: userError.code,
      arabicMessage: userError.arabicMessage,
      statusCode: 429
    };
  }

  // Default error response
  const defaultMessage = language === 'ar' 
    ? 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
    : 'An unexpected error occurred. Please try again.';

  return {
    success: false,
    error: defaultMessage,
    code: 'UNKNOWN_ERROR',
    statusCode: 500
  };
};
