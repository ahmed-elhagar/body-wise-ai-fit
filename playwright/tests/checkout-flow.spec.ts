
import { test, expect, Page } from '@playwright/test';

// Mock Stripe responses for CI environment
const mockStripeResponses = async (page: Page) => {
  // Mock checkout session creation
  await page.route('**/functions/v1/create-subscription', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        url: 'https://checkout.stripe.com/c/pay/test_session_123'
      })
    });
  });

  // Mock webhook responses
  await page.route('**/functions/v1/stripe-webhook-handler', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ received: true, processed: true })
    });
  });

  // Mock Stripe checkout page
  await page.route('https://checkout.stripe.com/**', async (route) => {
    // Redirect back to success page after a short delay
    const url = new URL(route.request().url());
    const successUrl = url.searchParams.get('success_url') || 'http://localhost:3000/pro?subscription=success';
    
    await route.fulfill({
      status: 302,
      headers: {
        'Location': successUrl
      }
    });
  });
};

test.describe('Subscription Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Stripe responses in CI environment
    if (process.env.CI) {
      await mockStripeResponses(page);
    }

    // Setup authenticated user
    await page.goto('/auth');
    
    // Sign up with test credentials
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'testpass123');
    await page.click('[data-testid="signup-button"]');
    
    // Wait for authentication to complete
    await page.waitForURL('/dashboard');
  });

  test('should complete checkout flow and upgrade user to pro', async ({ page }) => {
    // Navigate to Pro page
    await page.goto('/pro');
    
    // Verify user is not pro initially
    await expect(page.locator('[data-testid="user-role-badge"]')).not.toContainText('PRO');
    
    // Click monthly plan upgrade button
    await page.click('[data-testid="monthly-plan-button"]');
    
    // In local development with Stripe CLI, this would open actual Stripe checkout
    // In CI, we mock the response to simulate successful payment
    
    if (process.env.CI) {
      // Wait for redirect to success page
      await page.waitForURL('**/pro?subscription=success');
    } else {
      // For local testing, assume Stripe CLI webhook forwarding is active
      // Wait for new tab to open (Stripe checkout)
      const [checkoutPage] = await Promise.all([
        page.waitForEvent('popup'),
        page.click('[data-testid="monthly-plan-button"]')
      ]);
      
      // Fill test card details in Stripe checkout
      await checkoutPage.fill('[data-testid="cardNumber"]', '4242424242424242');
      await checkoutPage.fill('[data-testid="cardExpiry"]', '12/25');
      await checkoutPage.fill('[data-testid="cardCvc"]', '123');
      await checkoutPage.click('[data-testid="submit-button"]');
      
      // Wait for checkout completion and redirect
      await page.waitForURL('**/pro?subscription=success');
    }
    
    // Verify success toast appears
    await expect(page.locator('.sonner-toast')).toContainText('Welcome to FitGenius Pro');
    
    // Wait for role update (may take a few seconds due to webhook processing)
    await page.waitForTimeout(3000);
    
    // Verify user role is now PRO
    await expect(page.locator('[data-testid="user-role-badge"]')).toContainText('PRO');
    
    // Verify AI generations are unlimited
    await expect(page.locator('[data-testid="ai-generations-remaining"]')).toContainText('∞');
    
    // Verify subscription status in debug panel
    await expect(page.locator('[data-testid="subscription-status"]')).toContainText('active');
  });

  test('should handle subscription cancellation', async ({ page }) => {
    // First, upgrade user to pro (reuse setup from previous test)
    await page.goto('/pro');
    await page.click('[data-testid="monthly-plan-button"]');
    
    if (process.env.CI) {
      await page.waitForURL('**/pro?subscription=success');
    } else {
      // Simulate successful checkout for local testing
      await page.goto('/pro?subscription=success');
    }
    
    await page.waitForTimeout(3000); // Wait for webhook processing
    
    // Navigate to customer portal and cancel
    await page.click('[data-testid="manage-subscription-button"]');
    
    if (process.env.CI) {
      // Mock cancellation in CI
      await page.route('**/customer-portal', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            url: 'http://localhost:3000/pro?subscription=cancelled'
          })
        });
      });
    }
    
    // Wait for cancellation to process
    await page.waitForURL('**/pro?subscription=cancelled', { timeout: 10000 });
    
    // Verify user role returns to normal
    await expect(page.locator('[data-testid="user-role-badge"]')).not.toContainText('PRO');
    
    // Verify AI generations are limited again
    await expect(page.locator('[data-testid="ai-generations-remaining"]')).not.toContainText('∞');
  });

  test('should track analytics events during checkout', async ({ page }) => {
    // Mock PostHog capture calls
    const analyticsEvents: string[] = [];
    
    await page.addInitScript(() => {
      (window as any).posthog = {
        capture: (event: string, properties: any) => {
          (window as any).analyticsEvents = (window as any).analyticsEvents || [];
          (window as any).analyticsEvents.push(event);
        },
        identify: () => {},
        reset: () => {}
      };
    });
    
    await page.goto('/pro');
    
    // Click upgrade button
    await page.click('[data-testid="monthly-plan-button"]');
    
    // Verify upgrade_clicked event was tracked
    const events = await page.evaluate(() => (window as any).analyticsEvents || []);
    expect(events).toContain('upgrade_clicked');
  });
});
