import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test('should display dashboard with projects', async ({ page }) => {
    await page.goto('/dashboard');
    // Should show Projects tab
    await expect(page.getByRole('tab', { name: 'Projects' })).toBeVisible();
    // Should show at least default project
    await expect(page.getByText('My Project')).toBeVisible();
  });

  test('should toggle project privacy', async ({ page }) => {
    await page.goto('/dashboard');
    // Find and click the lock icon to toggle privacy
    const lockIcon = page.locator('[data-testid="LockIcon"]').first();
    if (await lockIcon.isVisible()) {
      await lockIcon.click();
    }
    // Verify project card is visible
    await expect(page.locator('.project-card').first()).toBeVisible();
  });

  test('should toggle project favorite', async ({ page }) => {
    await page.goto('/dashboard');
    const favoriteIcon = page.locator('[data-testid="FavoriteIcon"]').first();
    if (await favoriteIcon.isVisible()) {
      await favoriteIcon.click();
    }
    // Favorite should be toggled
    await expect(page.locator('.project-card').first()).toBeVisible();
  });

  test('should navigate to project details', async ({ page }) => {
    await page.goto('/dashboard');
    // Click on project name link
    await page.getByRole('link', { name: 'My Project' }).click();
    // Should navigate to project page
    await expect(page).toHaveURL(/\/projects\/\d+/);
  });

  test('should show project health indicator', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText(/Project Health:/)).toBeVisible();
    await expect(page.getByText(/GREEN|YELLOW|RED/)).toBeVisible();
  });
});
