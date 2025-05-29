
import { test, expect } from '@playwright/test';

test.describe('User Onboarding Flow', () => {
  test('should complete full onboarding process', async ({ page }) => {
    await page.goto('/onboarding');

    // Step 1: Basic Information
    await page.fill('[data-testid="first-name"]', 'John');
    await page.fill('[data-testid="last-name"]', 'Doe');
    await page.fill('[data-testid="age"]', '30');
    await page.selectOption('[data-testid="gender"]', 'male');
    await page.click('[data-testid="next-step"]');

    // Step 2: Physical Information
    await page.fill('[data-testid="height"]', '175');
    await page.fill('[data-testid="weight"]', '75');
    await page.selectOption('[data-testid="activity-level"]', 'moderate');
    await page.selectOption('[data-testid="fitness-goal"]', 'maintain');
    await page.click('[data-testid="next-step"]');

    // Step 3: Preferences
    await page.selectOption('[data-testid="nationality"]', 'international');
    await page.click('[data-testid="dietary-restriction-vegetarian"]');
    await page.click('[data-testid="finish-onboarding"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/onboarding');
    
    // Try to proceed without filling required fields
    await page.click('[data-testid="next-step"]');
    
    // Should show validation errors
    await expect(page.locator('[data-testid="error-first-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-age"]')).toBeVisible();
  });

  test('should save progress between steps', async ({ page }) => {
    await page.goto('/onboarding');
    
    // Fill step 1
    await page.fill('[data-testid="first-name"]', 'Jane');
    await page.fill('[data-testid="age"]', '25');
    await page.selectOption('[data-testid="gender"]', 'female');
    await page.click('[data-testid="next-step"]');
    
    // Go back to step 1
    await page.click('[data-testid="previous-step"]');
    
    // Values should be preserved
    await expect(page.locator('[data-testid="first-name"]')).toHaveValue('Jane');
    await expect(page.locator('[data-testid="age"]')).toHaveValue('25');
  });
});
