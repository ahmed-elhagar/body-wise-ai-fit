
export const pro = {
  // Pro Subscription Page
  title: "FitFatta Pro",
  subtitle: "Unlock Your Full Fitness Potential",
  description: "Get unlimited AI generations, premium features, and personalized coaching to achieve your fitness goals faster.",
  
  // Features
  features: {
    title: "What You Get",
    unlimited: {
      title: "Unlimited AI Generations",
      description: "Generate unlimited meal plans, exercise programs, and get AI coaching without limits"
    },
    priority: {
      title: "Priority Support",
      description: "Get faster response times and priority customer support"
    },
    advanced: {
      title: "Advanced Analytics",
      description: "Detailed progress tracking, body composition analysis, and performance insights"
    },
    coaching: {
      title: "Personal AI Coach",
      description: "24/7 AI coaching with personalized recommendations and motivation"
    },
    nutrition: {
      title: "Advanced Nutrition",
      description: "Macro tracking, supplement recommendations, and meal timing optimization"
    },
    exclusive: {
      title: "Exclusive Content",
      description: "Access to premium workouts, recipes, and fitness challenges"
    }
  },
  
  // Pricing
  pricing: {
    monthly: {
      title: "Monthly Plan",
      price: "$9.99",
      period: "/month",
      description: "Perfect for getting started"
    },
    yearly: {
      title: "Annual Plan",
      price: "$99.99",
      period: "/year",
      description: "Best value - 2 months free!",
      savings: "Save 17%"
    }
  },
  
  // Actions
  actions: {
    subscribe: "Subscribe Now",
    subscribing: "Subscribing...",
    cancel: "Cancel Subscription",
    cancelling: "Cancelling...",
    upgrade: "Upgrade to Pro",
    manageSubscription: "Manage Subscription"
  },
  
  // Status
  status: {
    active: "Pro Member",
    expired: "Subscription Expired",
    cancelled: "Subscription Cancelled",
    trial: "Free Trial",
    free: "Free Plan"
  },
  
  // Messages
  messages: {
    upgradeSuccess: "Successfully upgraded to Pro!",
    cancelSuccess: "Subscription cancelled successfully",
    error: "Something went wrong. Please try again.",
    confirmCancel: "Are you sure you want to cancel your Pro subscription?",
    benefits: "You'll lose access to all Pro features immediately."
  },
  
  // FAQ
  faq: {
    title: "Frequently Asked Questions",
    cancel: {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll retain Pro access until the end of your billing period."
    },
    refund: {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all new subscriptions."
    },
    features: {
      question: "What happens to my data if I cancel?",
      answer: "Your data remains safe and accessible. You'll just lose access to Pro features."
    }
  }
} as const;
