
export const errorCodes = {
  INVALID_USER_PROFILE: 'INVALID_USER_PROFILE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  AI_GENERATION_FAILED: 'AI_GENERATION_FAILED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
};

export class MealPlanError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'MealPlanError';
  }
}

export const createUserFriendlyError = (code: string, language: string = 'en') => {
  const messages = {
    en: {
      [errorCodes.INVALID_USER_PROFILE]: 'Please complete your profile before generating a meal plan.',
      [errorCodes.RATE_LIMIT_EXCEEDED]: 'You have reached your AI generation limit. Please upgrade or try again later.',
      [errorCodes.AI_GENERATION_FAILED]: 'Failed to generate meal plan. Please try again.',
      [errorCodes.VALIDATION_ERROR]: 'Invalid meal data generated. Please try again with different preferences.',
      [errorCodes.DATABASE_ERROR]: 'Database error occurred. Please try again.',
      [errorCodes.NETWORK_ERROR]: 'Network error. Please check your connection and try again.'
    },
    ar: {
      [errorCodes.INVALID_USER_PROFILE]: 'يرجى إكمال ملفك الشخصي قبل إنشاء خطة الوجبات.',
      [errorCodes.RATE_LIMIT_EXCEEDED]: 'لقد وصلت إلى حد الإنشاء بالذكاء الاصطناعي. يرجى الترقية أو المحاولة مرة أخرى لاحقاً.',
      [errorCodes.AI_GENERATION_FAILED]: 'فشل في إنشاء خطة الوجبات. يرجى المحاولة مرة أخرى.',
      [errorCodes.VALIDATION_ERROR]: 'بيانات وجبة غير صحيحة. يرجى المحاولة مرة أخرى بتفضيلات مختلفة.',
      [errorCodes.DATABASE_ERROR]: 'حدث خطأ في قاعدة البيانات. يرجى المحاولة مرة أخرى.',
      [errorCodes.NETWORK_ERROR]: 'خطأ في الشبكة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.'
    }
  };

  const langMessages = messages[language as keyof typeof messages] || messages.en;
  return new MealPlanError(
    langMessages[code] || 'An unexpected error occurred.',
    code,
    500,
    code !== errorCodes.INVALID_USER_PROFILE // Most errors are retryable except profile issues
  );
};

export const handleMealPlanError = (error: any, language: string = 'en') => {
  console.error('🚨 Meal Plan Error:', error);

  if (error instanceof MealPlanError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      isRetryable: error.isRetryable
    };
  }

  // Handle database constraint errors specifically
  if (error.message?.includes('daily_meals_meal_type_check')) {
    return {
      success: false,
      error: language === 'ar' 
        ? 'خطأ في نوع الوجبة. يرجى المحاولة مرة أخرى.'
        : 'Invalid meal type detected. Please try again.',
      code: errorCodes.VALIDATION_ERROR,
      statusCode: 400,
      isRetryable: true
    };
  }

  // Handle known error patterns
  if (error.message?.includes('JWT') || error.message?.includes('auth')) {
    return {
      success: false,
      error: language === 'ar' 
        ? 'خطأ في المصادقة. يرجى تسجيل الدخول مرة أخرى.'
        : 'Authentication error. Please log in again.',
      code: 'AUTH_ERROR',
      statusCode: 401,
      isRetryable: false
    };
  }

  if (error.message?.includes('timeout') || error.message?.includes('network')) {
    return {
      success: false,
      error: language === 'ar'
        ? 'انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.'
        : 'Request timeout. Please try again.',
      code: errorCodes.NETWORK_ERROR,
      statusCode: 408,
      isRetryable: true
    };
  }

  // Generic error
  return {
    success: false,
    error: language === 'ar'
      ? 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
      : 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
    isRetryable: true
  };
};
