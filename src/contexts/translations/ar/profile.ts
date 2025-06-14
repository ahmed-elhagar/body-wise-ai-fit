
export const profile = {
  // Profile page specific translations
  title: "الملف الشخصي",
  editProfile: "تعديل الملف الشخصي",
  profileOverview: "نظرة عامة على الملف الشخصي",
  personalInformation: "المعلومات الشخصية",
  physicalStats: "الإحصائيات الجسدية",
  healthGoals: "الصحة والأهداف",
  accountSettings: "إعدادات الحساب",
  saveChanges: "حفظ التغييرات",
  viewPersonalInfo: "عرض معلوماتك الشخصية وتفضيلاتك",
  updatePersonalInfo: "تحديث معلوماتك الشخصية وتفضيلاتك",
  
  // Profile tabs
  overview: "نظرة عامة",
  basic: "المعلومات الأساسية",
  health: "الصحة",
  goals: "الأهداف",
  settings: "الإعدادات",
  
  // Profile completion
  profileCompletion: "اكتمال الملف الشخصي",
  nextStep: "الخطوة التالية",
  continue: "متابعة",
  completeNow: "أكمل الآن",
  profileComplete: "الملف الشخصي مكتمل!",
  allSectionsCompleted: "جميع الأقسام مكتملة",
  sectionsCompleted: "أقسام مكتملة",
  
  // Profile header messages
  unsavedChanges: "لديك تغييرات غير محفوظة. يرجى الحفظ قبل المغادرة.",
  unsavedChangesSignOut: "لديك تغييرات غير محفوظة. هل أنت متأكد من تسجيل الخروج؟",
  signOutFailed: "فشل في تسجيل الخروج. يرجى المحاولة مرة أخرى.",
  admin: "مدير",
  signOut: "تسجيل الخروج",
  
  // Enhanced profile
  enhancedProfile: "ملف شخصي محسن",
  completeProfileForPersonalization: "أكمل ملفك الشخصي للحصول على توصيات ذكية شخصية",
  basicInformation: "المعلومات الأساسية",
  personalDetailsAndMeasurements: "التفاصيل الشخصية والقياسات الجسدية",
  healthAssessment: "التقييم الصحي",
  healthConditionsLifestyleData: "الحالات الصحية وبيانات نمط الحياة والعافية",
  goalsObjectives: "الأهداف والغايات",
  fitnessGoalsTargetAchievements: "أهداف اللياقة البدنية والإنجازات المستهدفة",
  preferences: "التفضيلات",
  appSettingsNotificationPreferences: "إعدادات التطبيق وتفضيلات الإشعارات",
  profileReview: "مراجعة الملف الشخصي",
  finalReviewConfirmation: "المراجعة النهائية والتأكيد",
  allSetForFitnessJourney: "أنت مستعد للاستفادة القصوى من رحلة اللياقة البدنية.",
  preferencesSettings: "التفضيلات والإعدادات",
  configureAppPreferences: "تكوين تفضيلات التطبيق وإعدادات الإشعارات وخيارات الخصوصية.",
  
  // Life phase
  lifePhase: {
    title: "مرحلة الحياة والظروف الخاصة",
    none: "لا يوجد",
    fasting: {
      title: "نوع الصيام",
      placeholder: "اختر نوع الصيام",
      ramadan: "رمضان",
      intermittent168: "صيام متقطع 16:8",
      sunMon: "الأحد والإثنين"
    },
    pregnancy: {
      title: "الحمل",
      placeholder: "اختر الثلث",
      trimester1: "الثلث الأول (1-12 أسبوع)",
      trimester2: "الثلث الثاني (13-26 أسبوع) +340 سعرة",
      trimester3: "الثلث الثالث (27-40 أسبوع) +450 سعرة"
    },
    breastfeeding: {
      title: "الرضاعة الطبيعية",
      placeholder: "اختر المستوى",
      exclusive: "رضاعة طبيعية حصرية +400 سعرة",
      partial: "رضاعة طبيعية جزئية +250 سعرة"
    },
    startDate: "تاريخ بداية الحالة",
    selectDate: "اختر تاريخ البداية",
    calorieAdjustment: "تعديل السعرات اليومية",
    kcalPerDay: "سعرة/يوم",
    mealLabels: {
      suhoor: "السحور",
      iftar: "الإفطار",
      nightSnack: "وجبة خفيفة ليلية"
    },
    hydrationReminder: "💧 تذكري شرب الماء",
    ramadanSchedule: "جدول وجبات رمضان",
    nutritionBoost: "تعزيز التغذية لمرحلة حياتك"
  }
} as const;
