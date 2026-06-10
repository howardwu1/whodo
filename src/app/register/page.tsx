'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useAppContext } from '@/lib/registry';
import { Navigation } from '@/components/Navigation';

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

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
      // Get CSRF token from cookie (not HttpOnly, so JS can read it)
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('whodo_csrf='))
        ?.split('=')[1] ?? '';

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
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

      setUsername(data.username);
      window.location.href = '/dashboard';
    } catch {
      setApiError('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navigation />
      <div style={{ maxWidth: '500px', margin: '60px auto 0', padding: '20px' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #191970 0%, #FF69B4 100%)',
            padding: '30px',
            textAlign: 'center',
          }}>
            <HowToRegIcon style={{ color: 'white', fontSize: '40px', marginBottom: '10px' }} />
            <h1 style={{
              color: 'white',
              margin: 0,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: '28px',
            }}>
              Create Account
            </h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '10px 0 0 0',
              fontSize: '14px',
            }}>
              Sign up to start using WhoDo project management
            </p>
          </div>

          {/* Form */}
          <div style={{ padding: '30px' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: 500,
                  fontSize: '14px',
                }}>
                  <PersonIcon style={{ fontSize: '18px', color: '#191970' }} />
                  Username
                </label>
                <input
                  {...register('username', {
                    required: true,
                    minLength: { value: 3, message: 'Username must be at least 3 characters' },
                  })}
                  placeholder="Choose a username"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #eee',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#191970')}
                  onBlur={(e) => (e.target.style.borderColor = '#eee')}
                />
                {errors.username && (
                  <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    {errors.username.type === 'required' ? 'Username is required' : 'Username must be at least 3 characters'}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: 500,
                  fontSize: '14px',
                }}>
                  <EmailIcon style={{ fontSize: '18px', color: '#191970' }} />
                  Email (optional)
                </label>
                <input
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #eee',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#191970')}
                  onBlur={(e) => (e.target.style.borderColor = '#eee')}
                />
                {errors.email && (
                  <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    Invalid email address
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: 500,
                  fontSize: '14px',
                }}>
                  <LockIcon style={{ fontSize: '18px', color: '#191970' }} />
                  Password
                </label>
                <input
                  {...register('password', {
                    required: true,
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  type="password"
                  placeholder="Create a password"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #eee',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#191970')}
                  onBlur={(e) => (e.target.style.borderColor = '#eee')}
                />
                {errors.password && (
                  <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    {errors.password.type === 'required' ? 'Password is required' : 'Password must be at least 6 characters'}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: 500,
                  fontSize: '14px',
                }}>
                  <LockIcon style={{ fontSize: '18px', color: '#191970' }} />
                  Confirm Password
                </label>
                <input
                  {...register('confirmPassword', {
                    required: true,
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  type="password"
                  placeholder="Confirm your password"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #eee',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#191970')}
                  onBlur={(e) => (e.target.style.borderColor = '#eee')}
                />
                {errors.confirmPassword && (
                  <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    Passwords do not match
                  </span>
                )}
              </div>

              {apiError && (
                <div style={{
                  padding: '12px',
                  background: '#ffebee',
                  borderRadius: '8px',
                  color: '#d32f2f',
                  fontSize: '14px',
                  marginBottom: '20px',
                }}>
                  {apiError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #191970 0%, #FF69B4 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                <HowToRegIcon style={{ fontSize: '18px' }} />
                {isSubmitting ? 'CREATING...' : 'CREATE ACCOUNT'}
              </button>

              <p style={{
                textAlign: 'center',
                marginTop: '20px',
                color: '#666',
                fontSize: '14px',
              }}>
                Already have an account?{' '}
                <Link href="/login" style={{
                  color: '#191970',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}>
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&display=swap');
      `}</style>
    </div>
  );
}
