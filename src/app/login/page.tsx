'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/lib/registry';
import { Navigation } from '@/components/Navigation';

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [hasForgottenPassword, setHasForgottenPassword] = useState(false);
  const [isPasswordResetSent, setIsPasswordResetSent] = useState(false);
  const { username, setUsername } = useAppContext();

  const onSubmit = async (data: { name: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: data.name, password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError('signin', { type: 'custom', message: result.error || 'Invalid credentials' });
        return;
      }

      setUsername(result.username);
      router.push('/dashboard');
    } catch (error) {
      setError('signin', { type: 'custom', message: 'An error occurred' });
    }
  };

  const onSubmitForgotPassword = (data: { name: string }) => {
    setUsername(data.name);
    setIsPasswordResetSent(true);
  };

  return (
    <div style={{ overflowY: 'hidden', height: '100vh' }}>
      <Navigation />
      <div style={{ paddingLeft: '2em', paddingRight: '2em' }}>
        {!hasForgottenPassword ? (
          <form onSubmit={handleSubmit(onSubmit)} className="sign-in">
            <h2>Sign In</h2>
            <h5>Sign in to use WhoDo project management and billing</h5>
            <label htmlFor="name">Username or Email</label>
            <input
              {...register('name', { required: true })}
              id="name"
              onClick={() => clearErrors('signin')}
            />
            <label htmlFor="password">Password</label>
            <input
              {...register('password', { required: true })}
              id="password"
              type="password"
              onClick={() => clearErrors('signin')}
            />
            {errors.name && (
              <span className="login-error">Username or email is required</span>
            )}
            {errors.password && (
              <span className="login-error">Password is required</span>
            )}
            {errors.signin && (
              <span className="login-error">Username or Password is incorrect</span>
            )}
            <input type="submit" className="submit-btn" value="SIGN IN" />
            <button
              type="button"
              onClick={() => setHasForgottenPassword(true)}
              style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', marginTop: '-20px' }}
            >
              Forgot Password?
            </button>
            <p style={{ marginTop: '-10px', fontSize: '12pt' }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" style={{ color: 'blue' }}>
                Sign up
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmitForgotPassword)} className="sign-in">
            <h2>Forgot Password</h2>
            <label htmlFor="reset-name">Username or Email</label>
            {!isPasswordResetSent && username === '' ? (
              <>
                <input {...register('name', { required: true })} id="reset-name" />
                {errors.name && (
                  <span className="login-error">Username or email is required</span>
                )}
                <input type="submit" className="submit-btn" value="SEND RESET EMAIL" />
              </>
            ) : (
              <>
                <h3>{username}</h3>
                <p style={{ textAlign: 'left' }}>
                  Thank you! If user/email &quot;{username}&quot; is in our systems we have
                  sent you an email with instructions on how to reset your
                  password! Please reach out to{' '}
                  <a href="mailto:whodo-support@gmail.com">whodo-support@gmail.com</a>{' '}
                  if there are any issues.
                </p>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
