
import { test, expect } from '@playwright/test';

test.describe('User Onboarding Flow', () => {
  test('should complete full onboarding process', async ({ page }) => {
    await page.goto('/onboarding');

    // Step 1: Basic Information
    await page.fill('[data-testid="first-name"]', 'John');
    await page.fill('[data-testid="last-name"]', 'Doe');
    await page.fill('[data-testid="age"]', '30');
    
    // Select gender using the new visual selector
    await page.click('[data-testid="gender-male"]');
    
    // Select nationality (optional)
    await page.click('[data-testid="nationality"]');
    await page.selectOption('[data-testid="nationality"]', 'american');
    
    await page.click('[data-testid="next-step"]');

    // Step 2: Physical Information
    await page.fill('[data-testid="height"]', '175');
    await page.fill('[data-testid="weight"]', '75');
    await page.selectOption('[data-testid="activity-level"]', 'moderate');
    await page.selectOption('[data-testid="fitness-goal"]', 'maintain');
    await page.click('[data-testid="next-step"]');

    // Step 3: Goals and Activity
    await page.click('[data-testid="next-step"]');

    // Step 4: Preferences
    await page.click('[data-testid="finish-onboarding"]');

    // Should redirect to auth page after completing onboarding
    await expect(page).toHaveURL('/auth');
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/onboarding');
    
    // Try to proceed without filling required fields
    await page.click('[data-testid="next-step"]');
    
    // Should show validation error (toast message)
    await expect(page.locator('text=Please fill in all required fields')).toBeVisible();
  });

  test('should save progress between steps', async ({ page }) => {
    await page.goto('/onboarding');
    
    // Fill step 1
    await page.fill('[data-testid="first-name"]', 'Jane');
    await page.fill('[data-testid="age"]', '25');
    await page.click('[data-testid="gender-female"]');
    await page.click('[data-testid="next-step"]');
    
    // Go back to step 1
    await page.click('[data-testid="previous-step"]');
    
    // Values should be preserved
    await expect(page.locator('[data-testid="first-name"]')).toHaveValue('Jane');
    await expect(page.locator('[data-testid="age"]')).toHaveValue('25');
    
    // Gender should still be selected
    await expect(page.locator('[data-testid="gender-female"]')).toHaveClass(/ring-2 ring-blue-500/);
  });

  test('should allow skipping optional nationality', async ({ page }) => {
    await page.goto('/onboarding');
    
    // Fill required fields only
    await page.fill('[data-testid="first-name"]', 'Test');
    await page.fill('[data-testid="last-name"]', 'User');
    await page.fill('[data-testid="age"]', '30');
    await page.click('[data-testid="gender-male"]');
    
    // Don't select nationality (it's optional)
    await page.click('[data-testid="next-step"]');
    
    // Should proceed to next step
    await expect(page.locator('text=Your physical profile')).toBeVisible();
  });
});
