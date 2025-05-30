
import posthog from 'posthog-js'

// Initialize PostHog
if (typeof window !== 'undefined') {
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY
  
  if (posthogHost && posthogKey) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      autocapture: false, // Disable automatic capture for privacy
      capture_pageview: false, // We'll manually handle pageviews
      disable_session_recording: true, // Respect privacy
      respect_dnt: true, // Respect Do Not Track headers
    })
  }
}

// Analytics event types
export interface AnalyticsEvent {
  upgrade_clicked: { plan_type: string; user_role: string }
  checkout_completed: { plan_type: string; user_id: string; user_role: string }
  cancel_subscription: { plan_type: string; user_id: string; user_role: string }
  add_snack: { user_id: string; user_role: string; calories: number }
  meal_exchanged: { user_id: string; user_role: string; meal_type: string }
}

export const trackEvent = <T extends keyof AnalyticsEvent>(
  event: T,
  properties: AnalyticsEvent[T]
) => {
  if (typeof window === 'undefined') return
  
  // Check if user has opted out of tracking
  if (navigator.doNotTrack === '1') return
  
  try {
    posthog.capture(event, properties)
  } catch (error) {
    console.warn('Analytics tracking failed:', error)
  }
}

export const identifyUser = (userId: string, traits: Record<string, any> = {}) => {
  if (typeof window === 'undefined') return
  if (navigator.doNotTrack === '1') return
  
  try {
    posthog.identify(userId, traits)
  } catch (error) {
    console.warn('User identification failed:', error)
  }
}

export const resetAnalytics = () => {
  if (typeof window === 'undefined') return
  
  try {
    posthog.reset()
  } catch (error) {
    console.warn('Analytics reset failed:', error)
  }
}
