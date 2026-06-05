'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/lib/registry';
import Navigation from '../page';

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const { setUsername } = useAppContext();
  const [apiError, setApiError] = useState('');

  const password = watch('password');

  const onSubmit = async (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setApiError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email || undefined,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.error || 'Registration failed');
        return;
      }

      // Auto-login after registration
      setUsername(data.username);
      window.location.href = '/dashboard';
    } catch (error) {
      setApiError('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ overflowY: 'hidden', height: '100vh' }}>
      <Navigation />
      <div style={{ paddingLeft: '2em', paddingRight: '2em' }}>
        <form onSubmit={handleSubmit(onSubmit)} className="sign-in">
          <h2>Create Account</h2>
          <h5>Sign up to start using WhoDo project management</h5>

          <label htmlFor="username">Username *</label>
          <input
            {...register('username', {
              required: true,
              minLength: { value: 3, message: 'Username must be at least 3 characters' },
            })}
            id="username"
            placeholder="Choose a username"
          />
          {errors.username && (
            <span className="login-error">
              {errors.username.type === 'required'
                ? 'Username is required'
                : 'Username must be at least 3 characters'}
            </span>
          )}

          <label htmlFor="email">Email (optional)</label>
          <input
            {...register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            id="email"
            type="email"
            placeholder="your@email.com"
          />
          {errors.email && (
            <span className="login-error">Invalid email address</span>
          )}

          <label htmlFor="password">Password *</label>
          <input
            {...register('password', {
              required: true,
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
            id="password"
            type="password"
            placeholder="Create a password"
          />
          {errors.password && (
            <span className="login-error">
              {errors.password.type === 'required'
                ? 'Password is required'
                : 'Password must be at least 6 characters'}
            </span>
          )}

          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input
            {...register('confirmPassword', {
              required: true,
              validate: (value) => value === password || 'Passwords do not match',
            })}
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <span className="login-error">Passwords do not match</span>
          )}

          {apiError && <span className="login-error">{apiError}</span>}

          <input type="submit" className="submit-btn" value="CREATE ACCOUNT" />

          <p style={{ marginTop: '-10px', fontSize: '12pt' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'blue' }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
