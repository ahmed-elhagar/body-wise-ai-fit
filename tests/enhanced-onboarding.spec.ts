import { test, expect } from '@playwright/test';

test.describe('Enhanced Onboarding Flow', () => {
  test('should complete enhanced onboarding process', async ({ page }) => {
    await page.goto('/onboarding');

    // Step 1: Basic Information
    await page.fill('[data-testid="first-name"]', 'John');
    await page.fill('[data-testid="last-name"]', 'Doe');
    await page.fill('[data-testid="age"]', '30');
    await page.fill('[data-testid="height"]', '175');
    await page.fill('[data-testid="weight"]', '75');
    
    // Select gender using the visual selector
    await page.click('[data-testid="gender-male"]');
    
    await page.click('[data-testid="next-step"]');

    // Step 2: Body Shape and Motivation
    await page.click('[data-testid="body-shape-average"]');
    await page.click('[data-testid="motivation-look_better"]');
    await page.click('[data-testid="next-step"]');

    // Step 3: Goals and Health
    await page.click('[data-testid="goal-body-fit"]');
    await page.click('[data-testid="health-issue-no_issues"]');
    await page.click('[data-testid="activity-level-lightly_active"]');
    await page.click('[data-testid="next-step"]');

    // Step 4: Summary and Complete
    await page.click('[data-testid="finish-onboarding"]');

    // Should redirect to auth page after completing onboarding
    await expect(page).toHaveURL('/auth');
  });

  test('should validate required fields in each step', async ({ page }) => {
    await page.goto('/onboarding');
    
    // Try to proceed without filling required fields
    await page.click('[data-testid="next-step"]');
    
    // Should show validation error
    await expect(page.locator('text=Please fill in all required fields')).toBeVisible();
  });

  test('should allow multiple motivation selections', async ({ page }) => {
    await page.goto('/onboarding');
    
    // Fill step 1 first
    await page.fill('[data-testid="first-name"]', 'Jane');
    await page.fill('[data-testid="last-name"]', 'Doe');
    await page.fill('[data-testid="age"]', '25');
    await page.fill('[data-testid="height"]', '160');
    await page.fill('[data-testid="weight"]', '60');
    await page.click('[data-testid="gender-female"]');
    await page.click('[data-testid="next-step"]');
    
    // Select body shape
    await page.click('[data-testid="body-shape-slender"]');
    
    // Select multiple motivations
    await page.click('[data-testid="motivation-look_better"]');
    await page.click('[data-testid="motivation-feel_good"]');
    await page.click('[data-testid="motivation-be_fitter"]');
    
    // Should be able to proceed
    await page.click('[data-testid="next-step"]');
    await expect(page.locator('text=Goals & Health')).toBeVisible();
  });

  test('should handle health issues selection correctly', async ({ page }) => {
    await page.goto('/onboarding');
    
    // Navigate to step 3
    await page.fill('[data-testid="first-name"]', 'Test');
    await page.fill('[data-testid="last-name"]', 'User');
    await page.fill('[data-testid="age"]', '30');
    await page.fill('[data-testid="height"]', '170');
    await page.fill('[data-testid="weight"]', '70');
    await page.click('[data-testid="gender-male"]');
    await page.click('[data-testid="next-step"]');
    
    await page.click('[data-testid="body-shape-average"]');
    await page.click('[data-testid="motivation-improve_health"]');
    await page.click('[data-testid="next-step"]');
    
    // Test selecting specific health issues
    await page.click('[data-testid="health-issue-sensitive_back"]');
    await page.click('[data-testid="health-issue-sensitive_knees"]');
    
    // Should clear specific issues when selecting "No issues"
    await page.click('[data-testid="health-issue-no_issues"]');
    
    // Other health issues should be deselected
    await expect(page.locator('[data-testid="health-issue-sensitive_back"]')).not.toHaveClass(/ring-2 ring-blue-500/);
  });
});
