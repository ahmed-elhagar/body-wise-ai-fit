
import { test, expect } from '@playwright/test';

test.describe('Credit System', () => {
  test('should track AI generation credits', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Check initial credits
    await page.goto('/dashboard');
    const initialCredits = await page.locator('[data-testid="ai-credits"]').textContent();
    
    // Generate meal plan (uses 1 credit)
    await page.goto('/meal-plan');
    await page.click('[data-testid="generate-meal-plan"]');
    await page.click('[data-testid="generate-button"]');
    
    // Wait for generation to complete
    await page.waitForSelector('[data-testid="meal-card"]', { timeout: 30000 });
    
    // Check credits decreased
    await page.goto('/dashboard');
    const newCredits = await page.locator('[data-testid="ai-credits"]').textContent();
    
    expect(parseInt(newCredits || '0')).toBeLessThan(parseInt(initialCredits || '0'));
  });

  test('should prevent generation when credits exhausted', async ({ page }) => {
    // This test would need a user with 0 credits
    // Could be set up through test data seeding
    await page.goto('/meal-plan');
    
    // Try to generate with 0 credits
    await page.click('[data-testid="generate-meal-plan"]');
    
    // Should show error message
    await expect(page.locator('[data-testid="no-credits-error"]')).toBeVisible();
    
    // Generate button should be disabled
    await expect(page.locator('[data-testid="generate-button"]')).toBeDisabled();
  });
});
