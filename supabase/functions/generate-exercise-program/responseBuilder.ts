
export const buildSuccessResponse = (
  corsHeaders: any,
  weeklyProgram: any,
  workoutType: string,
  userLanguage: string,
  generationsRemaining: number
) => {
  const successMessage = userLanguage === 'ar'
    ? `تم إنشاء وحفظ برنامج تمارين ${workoutType === 'gym' ? 'الصالة الرياضية' : 'المنزل'} بنجاح`
    : `${workoutType === 'gym' ? 'Gym' : 'Home'} exercise program generated successfully`;

  return new Response(JSON.stringify({ 
    success: true,
    programId: weeklyProgram.id,
    workoutType,
    programName: weeklyProgram.program_name,
    weekStartDate: weeklyProgram.week_start_date,
    workoutsCreated: weeklyProgram.workoutsCreated,
    exercisesCreated: weeklyProgram.exercisesCreated,
    userLanguage: userLanguage,
    generationsRemaining: generationsRemaining,
    message: successMessage
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
};

export const buildErrorResponse = (corsHeaders: any, error: any) => {
  console.error('❌ Error generating exercise program:', error);
  
  let errorMessage = 'Failed to generate exercise program';
  if (error.message.includes('OpenAI')) {
    errorMessage = 'AI service error - please try again';
  } else if (error.message.includes('parse')) {
    errorMessage = 'Failed to process AI response - please try again';
  } else if (error.message.includes('validation')) {
    errorMessage = 'Generated program validation failed - please try again';
  } else if (error.message.includes('database') || error.message.includes('Supabase')) {
    errorMessage = 'Database error - please try again';
  } else if (error.message.includes('User ID')) {
    errorMessage = 'Authentication required - please sign in';
  } else if (error.message.includes('limit')) {
    errorMessage = 'AI generation limit reached';
  }
  
  return new Response(JSON.stringify({ 
    error: errorMessage,
    details: error.message,
    timestamp: new Date().toISOString()
  }), {
    status: 500,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
};

export const buildLimitReachedResponse = (corsHeaders: any, remaining: number) => {
  return new Response(JSON.stringify({
    error: 'AI generation limit reached',
    remaining: remaining,
    limitReached: true
  }), {
    status: 429,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
};
