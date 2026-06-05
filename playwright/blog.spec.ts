import { test, expect } from '@playwright/test';

test.describe('Blog Page', () => {
  test('should display blog page', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('heading', { name: 'WhoDo Blog' })).toBeVisible();
    await expect(page.getByText('All things WhoDo - Updates/News/Random Musings')).toBeVisible();
  });

  test('should display blog article', async ({ page }) => {
    await page.goto('/blog');
    // Should show blog content
    await expect(page.getByRole('heading', { name: 'What is WhoDo' })).toBeVisible();
    await expect(page.getByText(/Written by:/)).toBeVisible();
  });

  test('should have author link', async ({ page }) => {
    await page.goto('/blog');
    // Should have link to author page
    const authorLink = page.getByRole('link', { name: 'Howard Lorum Wu' });
    await expect(authorLink).toBeVisible();
    await expect(authorLink).toHaveAttribute('href', '/author/howard-lorum-wu');
  });

  test('should display blog navigation links', async ({ page }) => {
    await page.goto('/blog');
    // Should show navigation sections
    await expect(page.getByText('New To WhoDo')).toBeVisible();
    await expect(page.getByText('Blog Posts')).toBeVisible();
  });

  test('should navigate to getting started link', async ({ page }) => {
    await page.goto('/blog');
    // Should have working links
    const gettingStartedLink = page.getByRole('link', { name: 'How To Get Set Up' });
    await expect(gettingStartedLink).toBeVisible();
  });
});
