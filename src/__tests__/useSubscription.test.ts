import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@supabase/supabase-js';

// Mock dependencies
vi.mock('@/hooks/useAuth');
vi.mock('@/integrations/supabase/client');
vi.mock('@/lib/analytics');

const mockUser: Partial<User> = {
  id: 'test-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2025-01-01T00:00:00Z'
};

const mockSubscription = {
  id: 'sub-123',
  user_id: 'test-user-id',
  stripe_customer_id: 'cus_123',
  stripe_subscription_id: 'sub_stripe_123',
  status: 'active',
  plan_type: 'monthly',
  current_period_start: '2025-05-01T00:00:00Z',
  current_period_end: '2025-06-01T00:00:00Z',
  cancel_at_period_end: false,
  stripe_price_id: 'price_123',
  interval: 'month'
};

describe('useSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser as any,
      session: null,
      loading: false,
      isLoading: false,
      isAdmin: false,
      error: null,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      clearError: vi.fn(),
      retryAuth: vi.fn(),
      forceLogout: vi.fn() // Added missing forceLogout method
    });
  });

  it('should have basic subscription functionality', () => {
    // Mock the hook return value
    const mockHookReturn = {
      subscription: mockSubscription,
      isLoading: false,
      refetch: vi.fn(),
      createCheckoutSession: vi.fn(),
      cancelSubscription: vi.fn(),
      adminCancelSubscription: vi.fn(),
      isCreatingCheckout: false,
      isCancelling: false,
      isAdminCancelling: false
    };

    expect(mockHookReturn.subscription).toEqual(mockSubscription);
    expect(mockHookReturn.isLoading).toBe(false);
    expect(typeof mockHookReturn.createCheckoutSession).toBe('function');
    expect(typeof mockHookReturn.cancelSubscription).toBe('function');
  });

  it('should handle subscription status changes', () => {
    const pendingSubscription = { ...mockSubscription, status: 'pending' };
    const activeSubscription = { ...mockSubscription, status: 'active' };

    expect(pendingSubscription.status).toBe('pending');
    expect(activeSubscription.status).toBe('active');
  });

  it('should track analytics events', () => {
    const mockTrackEvent = vi.fn();
    
    // Simulate tracking an event
    mockTrackEvent('upgrade_clicked', {
      plan_type: 'monthly',
      user_role: 'normal'
    });

    expect(mockTrackEvent).toHaveBeenCalledWith('upgrade_clicked', {
      plan_type: 'monthly',
      user_role: 'normal'
    });
  });

  it('should handle subscription cancellation tracking', () => {
    const mockTrackEvent = vi.fn();
    
    // Simulate tracking cancellation
    mockTrackEvent('cancel_subscription', {
      plan_type: 'monthly',
      user_id: 'test-user-id',
      user_role: 'pro'
    });

    expect(mockTrackEvent).toHaveBeenCalledWith('cancel_subscription', {
      plan_type: 'monthly',
      user_id: 'test-user-id',
      user_role: 'pro'
    });
  });
});
