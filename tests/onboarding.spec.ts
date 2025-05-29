
import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/onboarding');
  });

  test('should complete onboarding process', async ({ page }) => {
    // Step 1: Personal Info
    await page.fill('[data-testid="first-name"]', 'John');
    await page.fill('[data-testid="last-name"]', 'Doe');
    await page.fill('[data-testid="email"]', 'john.doe@example.com');
    await page.selectOption('[data-testid="gender"]', 'male');
    await page.fill('[data-testid="age"]', '30');
    await page.click('[data-testid="next-button"]');

    // Step 2: Physical Info
    await page.fill('[data-testid="height"]', '180');
    await page.fill('[data-testid="weight"]', '75');
    await page.selectOption('[data-testid="activity-level"]', 'moderately_active');
    await page.selectOption('[data-testid="fitness-goal"]', 'weight_loss');
    await page.click('[data-testid="next-button"]');

    // Step 3: Preferences
    await page.selectOption('[data-testid="nationality"]', 'American');
    await page.click('[data-testid="dietary-vegetarian"]');
    await page.click('[data-testid="submit-button"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('[data-testid="next-button"]');
    
    // Should show validation errors
    await expect(page.locator('[data-testid="error-first-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-email"]')).toBeVisible();
  });

  test('should navigate between steps', async ({ page }) => {
    // Fill first step and proceed
    await page.fill('[data-testid="first-name"]', 'John');
    await page.fill('[data-testid="email"]', 'john@example.com');
    await page.click('[data-testid="next-button"]');

    // Should be on step 2
    await expect(page.locator('[data-testid="step-indicator-2"]')).toHaveClass(/active/);

    // Go back to step 1
    await page.click('[data-testid="back-button"]');
    await expect(page.locator('[data-testid="step-indicator-1"]')).toHaveClass(/active/);
  });
});
