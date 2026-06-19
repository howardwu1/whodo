'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';
import { useAppContext } from '@/lib/registry';
import { Navigation } from '@/components/Navigation';

export default function Login() {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [hasForgottenPassword, setHasForgottenPassword] = useState(false);
  const [isPasswordResetSent, setIsPasswordResetSent] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const { username, setUsername } = useAppContext();

  const onSubmit = async (data: { name: string; password: string }) => {
    setGlobalError('');
    try {
      // Get CSRF token from cookie (not HttpOnly, so JS can read it)
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('whodo_csrf='))
        ?.split('=')[1] ?? '';

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({ username: data.name, password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setGlobalError(result.error || 'Invalid credentials');
        return;
      }

      setUsername(result.username);
      router.push('/dashboard');
    } catch {
      setGlobalError('An error occurred');
    }
  };

  const onSubmitForgotPassword = (data: { name: string }) => {
    setUsername(data.name);
    setIsPasswordResetSent(true);
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
            <LoginIcon style={{ color: 'white', fontSize: '40px', marginBottom: '10px' }} />
            <h1 style={{
              color: 'white',
              margin: 0,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: '28px',
            }}>
              {hasForgottenPassword ? 'Reset Password' : 'Welcome Back'}
            </h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '10px 0 0 0',
              fontSize: '14px',
            }}>
              {hasForgottenPassword
                ? 'Enter your username or email to receive reset instructions'
                : 'Sign in to use WhoDo project management and billing'}
            </p>
          </div>

          {/* Form */}
          <div style={{ padding: '30px' }}>
            {!hasForgottenPassword ? (
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
                    Username or Email
                  </label>
                  <input
                    {...register('name', { required: true })}
                    placeholder="Enter your username or email"
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    onClick={() => { clearErrors('signin'); setGlobalError(''); }}
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
                  {errors.name && (
                    <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                      Username or email is required
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
                    {...register('password', { required: true })}
                    type="password"
                    placeholder="Enter your password"
                    onClick={() => { clearErrors('signin'); setGlobalError(''); }}
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
                      Password is required
                    </span>
                  )}
                </div>

                {globalError && (
                  <div style={{
                    padding: '12px',
                    background: '#ffebee',
                    borderRadius: '8px',
                    color: '#d32f2f',
                    fontSize: '14px',
                    marginBottom: '20px',
                  }}>
                    {globalError}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-gradient-pill"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #191970 0%, #FF69B4 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  <LoginIcon style={{ fontSize: '18px' }} />
                  Sign In
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setHasForgottenPassword(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#191970',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <p style={{
                  textAlign: 'center',
                  marginTop: '24px',
                  color: '#666',
                  fontSize: '14px',
                }}>
                  Don't have an account?{' '}
                  <Link href="/register" style={{
                    color: '#191970',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}>
                    Sign up
                  </Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSubmit(onSubmitForgotPassword)}>
                {!isPasswordResetSent && username === '' ? (
                  <>
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
                        <EmailIcon style={{ fontSize: '18px', color: '#191970' }} />
                        Username or Email
                      </label>
                      <input
                        {...register('name', { required: true })}
                        placeholder="Enter your username or email"
                        spellCheck={false}
                        autoCapitalize="off"
                        autoCorrect="off"
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
                      {errors.name && (
                        <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                          Username or email is required
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn-gradient-pill"
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: 'linear-gradient(135deg, #191970 0%, #FF69B4 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      <EmailIcon style={{ fontSize: '18px' }} />
                      Send Reset Email
                    </button>
                  </>
                ) : (
                  <div style={{
                    padding: '16px',
                    background: '#e8f5e9',
                    borderRadius: '12px',
                    marginBottom: '20px',
                  }}>
                    <p style={{ color: '#2e7d32', fontSize: '14px', margin: 0 }}>
                      <strong>Success!</strong> If user/email "{username}" is in our systems we have sent you an email with instructions on how to reset your password!
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => { setHasForgottenPassword(false); setIsPasswordResetSent(false); }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    border: '2px solid #191970',
                    borderRadius: '12px',
                    color: '#191970',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Back to Sign In
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&display=swap');
      `}</style>
    </div>
  );
}
