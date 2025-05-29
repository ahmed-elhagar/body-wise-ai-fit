
import { test, expect } from '@playwright/test';

test.describe('Meal Plan Features', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    await page.goto('/meal-plan');
  });

  test('should generate meal plan skeleton', async ({ page }) => {
    // Click generate meal plan
    await page.click('[data-testid="generate-meal-plan"]');
    
    // Configure preferences
    await page.selectOption('[data-testid="cuisine-select"]', 'italian');
    await page.selectOption('[data-testid="prep-time"]', '30');
    await page.check('[data-testid="include-snacks"]');
    
    // Generate
    await page.click('[data-testid="generate-button"]');
    
    // Should show loading state
    await expect(page.locator('[data-testid="generating-indicator"]')).toBeVisible();
    
    // Wait for completion (may take a while)
    await page.waitForSelector('[data-testid="meal-card"]', { timeout: 30000 });
    
    // Should show 5 meals per day (with snacks)
    const mealCards = await page.locator('[data-testid="meal-card"]').count();
    expect(mealCards).toBeGreaterThanOrEqual(5);
  });

  test('should generate recipe on demand', async ({ page }) => {
    // Assuming meal plan exists, click on a meal
    await page.click('[data-testid="meal-card"]:first-child');
    
    // Click recipe button
    await page.click('[data-testid="recipe-button"]');
    
    // Should show recipe dialog
    await expect(page.locator('[data-testid="recipe-dialog"]')).toBeVisible();
    
    // Generate detailed recipe
    await page.click('[data-testid="generate-recipe"]');
    
    // Should show loading
    await expect(page.locator('[data-testid="recipe-loading"]')).toBeVisible();
    
    // Should show ingredients and instructions
    await page.waitForSelector('[data-testid="ingredients-list"]', { timeout: 20000 });
    await expect(page.locator('[data-testid="instructions-list"]')).toBeVisible();
  });

  test('should respect snack preference', async ({ page }) => {
    // Generate without snacks
    await page.click('[data-testid="generate-meal-plan"]');
    await page.uncheck('[data-testid="include-snacks"]');
    await page.click('[data-testid="generate-button"]');
    
    await page.waitForSelector('[data-testid="meal-card"]', { timeout: 30000 });
    
    // Should show 3 meals per day (no snacks)
    const todayMeals = await page.locator('[data-testid="today-meals"] [data-testid="meal-card"]').count();
    expect(todayMeals).toBe(3);
  });
});
