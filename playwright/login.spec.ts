import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByLabel('Username or Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'SIGN IN' })).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: 'SIGN IN' }).click();
    await expect(page.getByText('Username or email is required')).toBeVisible();
  });

  test('should login with correct credentials', async ({ page }) => {
    await page.getByLabel('Username or Email').fill('asdf');
    await page.getByLabel('Password').fill('asdfdsamyrandompass');
    await page.getByRole('button', { name: 'SIGN IN' }).click();
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error for incorrect credentials', async ({ page }) => {
    await page.getByLabel('Username or Email').fill('wrong');
    await page.getByLabel('Password').fill('wrong');
    await page.getByRole('button', { name: 'SIGN IN' }).click();
    await expect(page.getByText('Username or Password is incorrect')).toBeVisible();
  });

  test('should show forgot password form', async ({ page }) => {
    await page.getByText('Forgot Password?').click();
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();
    await expect(page.getByLabel('Username or Email')).toBeVisible();
  });
});
