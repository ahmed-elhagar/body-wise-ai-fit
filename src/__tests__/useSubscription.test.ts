
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';

// Mock dependencies
vi.mock('@/hooks/useAuth');
vi.mock('@/integrations/supabase/client');
vi.mock('@/lib/analytics');

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com'
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

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return ({ children }: { children: React.ReactNode }) => React.createElement(
    QueryClientProvider,
    { client: queryClient },
    children
  );
};

describe('useSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      session: null,
      loading: false,
      isAdmin: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      forceLogoutAllUsers: vi.fn()
    });
  });

  it('should fetch subscription data for authenticated user', async () => {
    // Mock Supabase response
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() => Promise.resolve({ data: mockSubscription, error: null }))
          }))
        }))
      }))
    };
    
    vi.doMock('@/integrations/supabase/client', () => ({
      supabase: mockSupabase
    }));

    const { result } = renderHook(() => useSubscription(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.subscription).toEqual(mockSubscription);
  });

  it('should handle subscription status changes', async () => {
    let subscriptionData = { ...mockSubscription, status: 'pending' };
    
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() => Promise.resolve({ data: subscriptionData, error: null }))
          }))
        }))
      }))
    };
    
    vi.doMock('@/integrations/supabase/client', () => ({
      supabase: mockSupabase
    }));

    const { result, rerender } = renderHook(() => useSubscription(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.subscription?.status).toBe('pending');
    });

    // Simulate subscription becoming active
    subscriptionData = { ...mockSubscription, status: 'active' };
    
    rerender();

    await waitFor(() => {
      expect(result.current.subscription?.status).toBe('active');
    });
  });

  it('should track analytics events on checkout creation', async () => {
    const mockTrackEvent = vi.fn();
    vi.doMock('@/lib/analytics', () => ({
      trackEvent: mockTrackEvent
    }));

    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: { role: 'normal' }, error: null })),
            maybeSingle: vi.fn(() => Promise.resolve({ data: mockSubscription, error: null }))
          }))
        }))
      })),
      functions: {
        invoke: vi.fn(() => Promise.resolve({ 
          data: { url: 'https://checkout.stripe.com/test' }, 
          error: null 
        }))
      }
    };
    
    vi.doMock('@/integrations/supabase/client', () => ({
      supabase: mockSupabase
    }));

    // Mock window.open
    const mockOpen = vi.fn();
    vi.stubGlobal('window', { open: mockOpen });

    const { result } = renderHook(() => useSubscription(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Trigger checkout creation
    result.current.createCheckoutSession({ planType: 'monthly' });

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith('upgrade_clicked', {
        plan_type: 'monthly',
        user_role: 'normal'
      });
    });

    expect(mockOpen).toHaveBeenCalledWith('https://checkout.stripe.com/test', '_blank');
  });

  it('should handle subscription cancellation', async () => {
    const mockTrackEvent = vi.fn();
    vi.doMock('@/lib/analytics', () => ({
      trackEvent: mockTrackEvent
    }));

    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: { role: 'pro' }, error: null })),
            maybeSingle: vi.fn(() => Promise.resolve({ data: mockSubscription, error: null }))
          }))
        }))
      })),
      functions: {
        invoke: vi.fn(() => Promise.resolve({ 
          data: { message: 'Subscription cancelled' }, 
          error: null 
        }))
      }
    };
    
    vi.doMock('@/integrations/supabase/client', () => ({
      supabase: mockSupabase
    }));

    const { result } = renderHook(() => useSubscription(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.subscription).toEqual(mockSubscription);
    });

    // Trigger cancellation
    result.current.cancelSubscription();

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith('cancel_subscription', {
        plan_type: 'monthly',
        user_id: 'test-user-id',
        user_role: 'pro'
      });
    });
  });
});
