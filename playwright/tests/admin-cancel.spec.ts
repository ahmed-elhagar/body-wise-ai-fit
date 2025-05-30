
import { test, expect } from '@playwright/test';

test.describe('Admin Subscription Management', () => {
  test.beforeEach(async ({ page }) => {
    // Create admin user
    await page.goto('/auth');
    await page.fill('[data-testid="email-input"]', 'admin@fitgenius.com');
    await page.fill('[data-testid="password-input"]', 'admin2025');
    await page.click('[data-testid="signin-button"]');
    
    // Wait for authentication and admin access
    await page.waitForURL('/dashboard');
  });

  test('should allow admin to cancel user subscription', async ({ page }) => {
    // Navigate to admin panel
    await page.goto('/admin');
    
    // Click on Subscriptions tab
    await page.click('[data-testid="subscriptions-tab"]');
    
    // Wait for subscriptions to load
    await page.waitForSelector('[data-testid="subscriptions-table"]');
    
    // Find an active subscription to cancel
    const activeSubscriptionRow = page.locator('[data-testid="subscription-row"]').filter({
      has: page.locator('[data-testid="subscription-status"]', { hasText: 'active' })
    }).first();
    
    // Get the user email before cancellation for verification
    const userEmail = await activeSubscriptionRow.locator('[data-testid="user-email"]').textContent();
    
    // Click cancel button
    await activeSubscriptionRow.locator('[data-testid="cancel-subscription-button"]').click();
    
    // Confirm cancellation in modal
    await page.click('[data-testid="confirm-cancel-button"]');
    
    // Wait for cancellation to process
    await expect(page.locator('.sonner-toast')).toContainText('Subscription cancelled successfully');
    
    // Verify subscription status changed to cancelled
    await expect(activeSubscriptionRow.locator('[data-testid="subscription-status"]')).toContainText('cancelled');
    
    // Navigate to audit logs to verify the action was logged
    await page.click('[data-testid="audit-logs-tab"]');
    
    // Verify audit log entry exists
    const auditLogRow = page.locator('[data-testid="audit-log-row"]').first();
    await expect(auditLogRow.locator('[data-testid="audit-action"]')).toContainText('cancel_subscription');
    await expect(auditLogRow.locator('[data-testid="audit-target"]')).toContainText(userEmail || '');
  });

  test('should show subscription statistics', async ({ page }) => {
    await page.goto('/admin');
    await page.click('[data-testid="subscriptions-tab"]');
    
    // Verify stats cards are displayed
    await expect(page.locator('[data-testid="active-subscriptions-count"]')).toBeVisible();
    await expect(page.locator('[data-testid="cancelled-subscriptions-count"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-subscriptions-count"]')).toBeVisible();
    
    // Verify the numbers are reasonable (at least 0)
    const activeCount = await page.locator('[data-testid="active-subscriptions-count"]').textContent();
    const cancelledCount = await page.locator('[data-testid="cancelled-subscriptions-count"]').textContent();
    const totalCount = await page.locator('[data-testid="total-subscriptions-count"]').textContent();
    
    expect(parseInt(activeCount || '0')).toBeGreaterThanOrEqual(0);
    expect(parseInt(cancelledCount || '0')).toBeGreaterThanOrEqual(0);
    expect(parseInt(totalCount || '0')).toBeGreaterThanOrEqual(0);
  });
});
