
export const admin = {
  // Admin Panel Header
  title: "Admin Panel",
  subtitle: "Manage users, subscriptions, and system settings",
  description: "System administration and management",
  
  // Navigation & Tabs
  tabs: {
    dashboard: "Dashboard",
    users: "Users",
    subscriptions: "Subscriptions",
    analytics: "Analytics",
    system: "System",
    aiModels: "AI Models",
    coaches: "Coaches",
    logs: "Generation Logs"
  },
  
  // Dashboard Stats
  stats: {
    totalUsers: "Total Users",
    activeUsers: "Active Users",
    proSubscribers: "Pro Subscribers",
    aiGenerations: "AI Generations",
    systemHealth: "System Health",
    todayRevenue: "Today's Revenue",
    monthlyRevenue: "Monthly Revenue",
    conversionRate: "Conversion Rate",
    userGrowth: "User Growth",
    retentionRate: "Retention Rate"
  },
  
  // User Management
  users: {
    title: "User Management",
    subtitle: "Manage user roles, subscriptions, and AI generations",
    searchPlaceholder: "Search users...",
    filters: {
      all: "All Users",
      online: "Online",
      offline: "Offline",
      pro: "Pro Members",
      free: "Free Members",
      admins: "Admins",
      coaches: "Coaches"
    },
    table: {
      user: "User",
      role: "Role",
      status: "Status",
      subscription: "Subscription",
      aiCredits: "AI Credits",
      lastSeen: "Last Seen",
      actions: "Actions"
    },
    roles: {
      admin: "Admin",
      coach: "Coach",
      normal: "Normal User"
    },
    status: {
      online: "Online",
      offline: "Offline",
      active: "Active",
      inactive: "Inactive"
    },
    actions: {
      editRole: "Edit Role",
      editCredits: "Edit Credits",
      viewProfile: "View Profile",
      suspend: "Suspend",
      activate: "Activate",
      delete: "Delete",
      addSubscription: "Add 1M Sub",
      cancelSubscription: "Cancel Sub",
      setCustomLimit: "Set custom limit"
    }
  },
  
  // Subscription Management
  subscriptions: {
    title: "Subscription Management",
    subtitle: "Monitor and manage user subscriptions",
    filters: {
      all: "All Subscriptions",
      active: "Active",
      cancelled: "Cancelled",
      expired: "Expired",
      trial: "Trial"
    },
    table: {
      user: "User",
      plan: "Plan",
      status: "Status",
      startDate: "Start Date",
      endDate: "End Date",
      amount: "Amount",
      actions: "Actions"
    },
    plans: {
      monthly: "Monthly",
      yearly: "Annual",
      trial: "Trial"
    },
    status: {
      active: "Active",
      cancelled: "Cancelled",
      expired: "Expired",
      trial: "Trial",
      pastDue: "Past Due"
    }
  },
  
  // AI Models & Configuration
  aiModels: {
    title: "AI Models Configuration",
    subtitle: "Configure AI models and generation settings",
    models: {
      openai: "OpenAI",
      google: "Google AI",
      anthropic: "Anthropic",
      primary: "Primary Model",
      fallback: "Fallback Model",
      default: "Default Model"
    },
    settings: {
      enableFallback: "Enable Fallback Chain",
      maxTokens: "Max Tokens",
      temperature: "Temperature",
      rateLimits: "Rate Limits",
      dailyLimit: "Daily Limit",
      userLimit: "Per User Limit"
    }
  },
  
  // Analytics
  analytics: {
    title: "Platform Analytics",
    subtitle: "Insights and performance metrics",
    metrics: {
      userEngagement: "User Engagement",
      featureUsage: "Feature Usage",
      aiGenerations: "AI Generations",
      subscriptionMetrics: "Subscription Metrics",
      systemPerformance: "System Performance"
    },
    charts: {
      dailyActiveUsers: "Daily Active Users",
      subscriptionGrowth: "Subscription Growth",
      aiUsage: "AI Usage Trends",
      revenueChart: "Revenue Chart"
    }
  },
  
  // System Settings
  system: {
    title: "System Settings",
    subtitle: "Configure system-wide settings and features",
    sections: {
      general: "General Settings",
      features: "Feature Flags",
      notifications: "Notifications",
      maintenance: "Maintenance",
      security: "Security",
      backup: "Backup & Recovery"
    },
    features: {
      enableRegistration: "Enable Registration",
      enableAI: "Enable AI Features",
      enableCoaching: "Enable Coaching",
      maintenanceMode: "Maintenance Mode",
      debugMode: "Debug Mode"
    },
    actions: {
      forceLogoutAll: "Force Logout All Users",
      clearCache: "Clear Cache",
      generateBackup: "Generate Backup",
      restoreBackup: "Restore Backup",
      runMaintenance: "Run Maintenance"
    }
  },
  
  // Generation Logs
  logs: {
    title: "AI Generation Logs",
    subtitle: "Monitor AI generation activity and performance",
    filters: {
      all: "All Generations",
      success: "Successful",
      failed: "Failed",
      today: "Today",
      thisWeek: "This Week",
      thisMonth: "This Month"
    },
    table: {
      user: "User",
      type: "Type",
      status: "Status",
      timestamp: "Timestamp",
      duration: "Duration",
      tokens: "Tokens Used",
      model: "Model Used",
      error: "Error"
    },
    types: {
      mealPlan: "Meal Plan",
      exercise: "Exercise Plan",
      recipe: "Recipe",
      snack: "Snack",
      chat: "Chat Response"
    }
  },
  
  // Dialogs & Modals
  dialogs: {
    editRole: {
      title: "Edit User Role",
      description: "Change the user's role and permissions",
      currentRole: "Current Role",
      newRole: "New Role",
      confirm: "Update Role",
      cancel: "Cancel"
    },
    editCredits: {
      title: "Update AI Generation Limit",
      description: "Set a new AI generation limit for this user",
      currentLimit: "Current Limit",
      newLimit: "New Limit",
      unlimited: "Unlimited",
      confirm: "Update Limit",
      cancel: "Cancel"
    },
    confirmAction: {
      title: "Confirm Action",
      deleteUser: "Are you sure you want to delete this user?",
      suspendUser: "Are you sure you want to suspend this user?",
      forceLogout: "Are you sure you want to force logout all users?",
      clearCache: "Are you sure you want to clear the system cache?",
      confirm: "Confirm",
      cancel: "Cancel"
    }
  },
  
  // Messages & Notifications
  messages: {
    success: {
      roleUpdated: "User role updated successfully",
      creditsUpdated: "AI credits updated successfully",
      subscriptionCreated: "Subscription created successfully",
      subscriptionCancelled: "Subscription cancelled successfully",
      userSuspended: "User suspended successfully",
      userActivated: "User activated successfully",
      settingsSaved: "Settings saved successfully",
      cacheCleared: "Cache cleared successfully",
      backupCreated: "Backup created successfully"
    },
    error: {
      updateFailed: "Update failed. Please try again.",
      permissionDenied: "Permission denied",
      networkError: "Network error. Please check your connection.",
      invalidInput: "Invalid input. Please check your data.",
      userNotFound: "User not found",
      subscriptionError: "Subscription operation failed",
      systemError: "System error. Please contact support."
    },
    info: {
      maintenanceMode: "System is in maintenance mode",
      debugMode: "Debug mode is enabled",
      backupInProgress: "Backup in progress...",
      processingRequest: "Processing your request..."
    }
  },
  
  // Actions & Buttons
  actions: {
    refresh: "Refresh",
    export: "Export",
    import: "Import",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    create: "Create",
    update: "Update",
    enable: "Enable",
    disable: "Disable",
    activate: "Activate",
    deactivate: "Deactivate",
    suspend: "Suspend",
    restore: "Restore",
    backup: "Backup",
    clear: "Clear",
    reset: "Reset"
  },
  
  // Status & States
  status: {
    loading: "Loading...",
    saving: "Saving...",
    processing: "Processing...",
    updating: "Updating...",
    deleting: "Deleting...",
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
    healthy: "Healthy",
    degraded: "Degraded",
    down: "Down"
  }
} as const;
