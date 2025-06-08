
export const admin = {
  // Admin Panel Header
  title: "لوحة الإدارة",
  subtitle: "إدارة المستخدمين والاشتراكات وإعدادات النظام",
  description: "إدارة النظام والإشراف",
  
  // Navigation & Tabs
  tabs: {
    dashboard: "لوحة التحكم",
    users: "المستخدمين",
    subscriptions: "الاشتراكات",
    analytics: "التحليلات",
    system: "النظام",
    aiModels: "نماذج الذكاء الاصطناعي",
    coaches: "المدربين",
    logs: "سجلات التوليد"
  },
  
  // Dashboard Stats
  stats: {
    totalUsers: "إجمالي المستخدمين",
    activeUsers: "المستخدمين النشطين",
    proSubscribers: "مشتركي برو",
    aiGenerations: "التوليدات الذكية",
    systemHealth: "صحة النظام",
    todayRevenue: "إيرادات اليوم",
    monthlyRevenue: "الإيرادات الشهرية",
    conversionRate: "معدل التحويل",
    userGrowth: "نمو المستخدمين",
    retentionRate: "معدل الاحتفاظ"
  },
  
  // User Management
  users: {
    title: "إدارة المستخدمين",
    subtitle: "إدارة أدوار المستخدمين والاشتراكات والتوليدات الذكية",
    searchPlaceholder: "البحث عن المستخدمين...",
    filters: {
      all: "جميع المستخدمين",
      online: "متصل",
      offline: "غير متصل",
      pro: "أعضاء برو",
      free: "أعضاء مجانيين",
      admins: "المديرين",
      coaches: "المدربين"
    },
    table: {
      user: "المستخدم",
      role: "الدور",
      status: "الحالة",
      subscription: "الاشتراك",
      aiCredits: "رصيد الذكاء الاصطناعي",
      lastSeen: "آخر ظهور",
      actions: "الإجراءات"
    },
    roles: {
      admin: "مدير",
      coach: "مدرب",
      normal: "مستخدم عادي"
    },
    status: {
      online: "متصل",
      offline: "غير متصل",
      active: "نشط",
      inactive: "غير نشط"
    },
    actions: {
      editRole: "تعديل الدور",
      editCredits: "تعديل الرصيد",
      viewProfile: "عرض الملف الشخصي",
      suspend: "تعليق",
      activate: "تفعيل",
      delete: "حذف",
      addSubscription: "إضافة اشتراك شهري",
      cancelSubscription: "إلغاء الاشتراك",
      setCustomLimit: "تعيين حد مخصص"
    }
  },
  
  // Subscription Management
  subscriptions: {
    title: "إدارة الاشتراكات",
    subtitle: "مراقبة وإدارة اشتراكات المستخدمين",
    filters: {
      all: "جميع الاشتراكات",
      active: "نشط",
      cancelled: "ملغي",
      expired: "منتهي الصلاحية",
      trial: "تجريبي"
    },
    table: {
      user: "المستخدم",
      plan: "الخطة",
      status: "الحالة",
      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      amount: "المبلغ",
      actions: "الإجراءات"
    },
    plans: {
      monthly: "شهري",
      yearly: "سنوي",
      trial: "تجريبي"
    },
    status: {
      active: "نشط",
      cancelled: "ملغي",
      expired: "منتهي الصلاحية",
      trial: "تجريبي",
      pastDue: "متأخر السداد"
    }
  },
  
  // AI Models & Configuration
  aiModels: {
    title: "إعدادات نماذج الذكاء الاصطناعي",
    subtitle: "تكوين نماذج الذكاء الاصطناعي وإعدادات التوليد",
    models: {
      openai: "أوبن إيه آي",
      google: "جوجل الذكي",
      anthropic: "أنثروبيك",
      primary: "النموذج الأساسي",
      fallback: "النموذج البديل",
      default: "النموذج الافتراضي"
    },
    settings: {
      enableFallback: "تفعيل السلسلة البديلة",
      maxTokens: "الحد الأقصى للرموز",
      temperature: "درجة الحرارة",
      rateLimits: "حدود المعدل",
      dailyLimit: "الحد اليومي",
      userLimit: "الحد لكل مستخدم"
    }
  },
  
  // Analytics
  analytics: {
    title: "تحليلات المنصة",
    subtitle: "رؤى ومقاييس الأداء",
    metrics: {
      userEngagement: "تفاعل المستخدمين",
      featureUsage: "استخدام الميزات",
      aiGenerations: "التوليدات الذكية",
      subscriptionMetrics: "مقاييس الاشتراكات",
      systemPerformance: "أداء النظام"
    },
    charts: {
      dailyActiveUsers: "المستخدمين النشطين يومياً",
      subscriptionGrowth: "نمو الاشتراكات",
      aiUsage: "اتجاهات استخدام الذكاء الاصطناعي",
      revenueChart: "مخطط الإيرادات"
    }
  },
  
  // System Settings
  system: {
    title: "إعدادات النظام",
    subtitle: "تكوين الإعدادات والميزات على مستوى النظام",
    sections: {
      general: "الإعدادات العامة",
      features: "أعلام الميزات",
      notifications: "الإشعارات",
      maintenance: "الصيانة",
      security: "الأمان",
      backup: "النسخ الاحتياطي والاستعادة"
    },
    features: {
      enableRegistration: "تفعيل التسجيل",
      enableAI: "تفعيل ميزات الذكاء الاصطناعي",
      enableCoaching: "تفعيل التدريب",
      maintenanceMode: "وضع الصيانة",
      debugMode: "وضع التشخيص"
    },
    actions: {
      forceLogoutAll: "إجبار تسجيل خروج جميع المستخدمين",
      clearCache: "مسح الذاكرة المؤقتة",
      generateBackup: "إنشاء نسخة احتياطية",
      restoreBackup: "استعادة نسخة احتياطية",
      runMaintenance: "تشغيل الصيانة"
    }
  },
  
  // Generation Logs
  logs: {
    title: "سجلات التوليد الذكي",
    subtitle: "مراقبة نشاط وأداء التوليد الذكي",
    filters: {
      all: "جميع التوليدات",
      success: "ناجح",
      failed: "فاشل",
      today: "اليوم",
      thisWeek: "هذا الأسبوع",
      thisMonth: "هذا الشهر"
    },
    table: {
      user: "المستخدم",
      type: "النوع",
      status: "الحالة",
      timestamp: "الوقت",
      duration: "المدة",
      tokens: "الرموز المستخدمة",
      model: "النموذج المستخدم",
      error: "الخطأ"
    },
    types: {
      mealPlan: "خطة وجبات",
      exercise: "خطة تمارين",
      recipe: "وصفة",
      snack: "وجبة خفيفة",
      chat: "رد المحادثة"
    }
  },
  
  // Dialogs & Modals
  dialogs: {
    editRole: {
      title: "تعديل دور المستخدم",
      description: "تغيير دور المستخدم والصلاحيات",
      currentRole: "الدور الحالي",
      newRole: "الدور الجديد",
      confirm: "تحديث الدور",
      cancel: "إلغاء"
    },
    editCredits: {
      title: "تحديث حد التوليد الذكي",
      description: "تعيين حد جديد للتوليد الذكي لهذا المستخدم",
      currentLimit: "الحد الحالي",
      newLimit: "الحد الجديد",
      unlimited: "غير محدود",
      confirm: "تحديث الحد",
      cancel: "إلغاء"
    },
    confirmAction: {
      title: "تأكيد الإجراء",
      deleteUser: "هل أنت متأكد من حذف هذا المستخدم؟",
      suspendUser: "هل أنت متأكد من تعليق هذا المستخدم؟",
      forceLogout: "هل أنت متأكد من إجبار تسجيل خروج جميع المستخدمين؟",
      clearCache: "هل أنت متأكد من مسح ذاكرة النظام المؤقتة؟",
      confirm: "تأكيد",
      cancel: "إلغاء"
    }
  },
  
  // Messages & Notifications
  messages: {
    success: {
      roleUpdated: "تم تحديث دور المستخدم بنجاح",
      creditsUpdated: "تم تحديث رصيد الذكاء الاصطناعي بنجاح",
      subscriptionCreated: "تم إنشاء الاشتراك بنجاح",
      subscriptionCancelled: "تم إلغاء الاشتراك بنجاح",
      userSuspended: "تم تعليق المستخدم بنجاح",
      userActivated: "تم تفعيل المستخدم بنجاح",
      settingsSaved: "تم حفظ الإعدادات بنجاح",
      cacheCleared: "تم مسح الذاكرة المؤقتة بنجاح",
      backupCreated: "تم إنشاء النسخة الاحتياطية بنجاح"
    },
    error: {
      updateFailed: "فشل التحديث. يرجى المحاولة مرة أخرى.",
      permissionDenied: "تم رفض الإذن",
      networkError: "خطأ في الشبكة. يرجى التحقق من الاتصال.",
      invalidInput: "إدخال غير صالح. يرجى التحقق من البيانات.",
      userNotFound: "لم يتم العثور على المستخدم",
      subscriptionError: "فشلت عملية الاشتراك",
      systemError: "خطأ في النظام. يرجى الاتصال بالدعم."
    },
    info: {
      maintenanceMode: "النظام في وضع الصيانة",
      debugMode: "وضع التشخيص مفعل",
      backupInProgress: "النسخ الاحتياطي قيد التقدم...",
      processingRequest: "جاري معالجة طلبك..."
    }
  },
  
  // Actions & Buttons
  actions: {
    refresh: "تحديث",
    export: "تصدير",
    import: "استيراد",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    view: "عرض",
    create: "إنشاء",
    update: "تحديث",
    enable: "تفعيل",
    disable: "تعطيل",
    activate: "تفعيل",
    deactivate: "إلغاء تفعيل",
    suspend: "تعليق",
    restore: "استعادة",
    backup: "نسخ احتياطي",
    clear: "مسح",
    reset: "إعادة تعيين"
  },
  
  // Status & States
  status: {
    loading: "جاري التحميل...",
    saving: "جاري الحفظ...",
    processing: "جاري المعالجة...",
    updating: "جاري التحديث...",
    deleting: "جاري الحذف...",
    success: "نجح",
    error: "خطأ",
    warning: "تحذير",
    info: "معلومات",
    healthy: "صحي",
    degraded: "متدهور",
    down: "معطل"
  }
} as const;
