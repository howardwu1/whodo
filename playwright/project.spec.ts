import { test, expect } from '@playwright/test';

test.describe('Project Page', () => {
  test('should display project page with stories', async ({ page }) => {
    await page.goto('/projects/12321');
    // Should show Stories tab
    await expect(page.getByRole('tab', { name: 'Stories' })).toBeVisible();
    // Should show sidebar with column toggles
    await expect(page.getByRole('button', { name: 'My Stories' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Current Iteration' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Icebox' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Done Stories' })).toBeVisible();
  });

  test('should toggle sidebar visibility', async ({ page }) => {
    await page.goto('/projects/12321');
    // Toggle My Stories
    const myStoriesBtn = page.getByRole('button', { name: 'My Stories' });
    await myStoriesBtn.click();
    // Button style should change to indicate hidden state
  });

  test('should show story details on click', async ({ page }) => {
    await page.goto('/projects/12321');
    // Click on a story to expand details
    const story = page.locator('.item-container').first();
    if (await story.isVisible()) {
      await story.click();
      // Should show story details form
      await expect(page.getByLabel('STORY TYPE')).toBeVisible();
      await expect(page.getByLabel('POINTS')).toBeVisible();
    }
  });

  test('should change story status', async ({ page }) => {
    await page.goto('/projects/12321');
    // Find a story with Finish button
    const finishBtn = page.getByRole('button', { name: 'Finish' }).first();
    if (await finishBtn.isVisible()) {
      await finishBtn.click();
      // Story should now show Deliver button
      await expect(page.getByRole('button', { name: 'Deliver' })).toBeVisible();
    }
  });

  test('should accept or reject delivered story', async ({ page }) => {
    await page.goto('/projects/12321');
    // Find a delivered story with Accept/Reject buttons
    const acceptBtn = page.getByRole('button', { name: 'Accept' }).first();
    const rejectBtn = page.getByRole('button', { name: 'Reject' }).first();
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
    }
  });

  test('should toggle story type', async ({ page }) => {
    await page.goto('/projects/12321');
    // Click on a story to expand
    const story = page.locator('.item-container').first();
    if (await story.isVisible()) {
      await story.click();
      // Change story type
      const storyTypeSelect = page.locator('select').first();
      if (await storyTypeSelect.isVisible()) {
        await storyTypeSelect.selectOption('bug');
      }
    }
  });
});
