'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
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
    } catch {
      setError('signin', { type: 'custom', message: 'An error occurred' });
    }
  };

  const onSubmitForgotPassword = (data: { name: string }) => {
    setUsername(data.name);
    setIsPasswordResetSent(true);
  };

  return (
    <div className="h-screen overflow-hidden">
      <Navigation />
      <Box className="flex justify-center items-center py-20">
        <Paper className="!p-8 !rounded-2xl !max-w-md !w-full !shadow-lg">
          {!hasForgottenPassword ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography variant="h4" className="!font-semibold !mb-2 !text-gray-800">
                Welcome Back
              </Typography>
              <Typography variant="body2" className="!text-gray-500 !mb-6">
                Sign in to use WhoDo project management and billing
              </Typography>

              <TextField
                {...register('name', { required: true })}
                id="name"
                label="Username or Email"
                variant="outlined"
                fullWidth
                className="!mb-4"
                onClick={() => clearErrors('signin')}
                error={!!errors.name || !!errors.signin}
                size="medium"
              />
              {errors.name && (
                <Alert severity="error" className="!mb-3">{(errors.name as any).message || 'Username or email is required'}</Alert>
              )}

              <TextField
                {...register('password', { required: true })}
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                className="!mb-4"
                onClick={() => clearErrors('signin')}
                error={!!errors.password || !!errors.signin}
                size="medium"
              />
              {errors.password && (
                <Alert severity="error" className="!mb-3">{(errors.password as any).message || 'Password is required'}</Alert>
              )}
              {errors.signin && (
                <Alert severity="error" className="!mb-3">{(errors.signin as any).message as string}</Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                className="!mt-2 !mb-4 !bg-indigo-600 hover:!bg-indigo-700 !text-white !rounded-lg !py-3"
              >
                Sign In
              </Button>

              <Box className="flex justify-between items-center">
                <Button
                  type="button"
                  onClick={() => setHasForgottenPassword(true)}
                  className="!text-indigo-600 !normal-case"
                >
                  Forgot Password?
                </Button>
              </Box>

              <Typography variant="body2" className="!mt-6 !text-center !text-gray-500">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="!text-indigo-600 !font-medium hover:!underline">
                  Sign up
                </Link>
              </Typography>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onSubmitForgotPassword)}>
              <Typography variant="h4" className="!font-semibold !mb-2 !text-gray-800">
                Reset Password
              </Typography>
              <Typography variant="body2" className="!text-gray-500 !mb-6">
                Enter your username or email to receive reset instructions
              </Typography>

              {!isPasswordResetSent && username === '' ? (
                <>
                  <TextField
                    {...register('name', { required: true })}
                    id="reset-name"
                    label="Username or Email"
                    variant="outlined"
                    fullWidth
                    className="!mb-4"
                    error={!!errors.name}
                    size="medium"
                  />
                  {errors.name && (
                    <Alert severity="error" className="!mb-3">{(errors.name as any).message || 'Username or email is required'}</Alert>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    className="!mt-2 !bg-indigo-600 hover:!bg-indigo-700 !text-white !rounded-lg !py-3"
                  >
                    Send Reset Email
                  </Button>
                </>
              ) : (
                <Box>
                  <Typography variant="h6" className="!mb-4 !font-medium">{username}</Typography>
                  <Alert severity="success" className="!mb-4">
                    If user/email &quot;{username}&quot; is in our systems we have sent you an email with instructions on how to reset your password!
                  </Alert>
                  <Typography variant="body2" className="!text-gray-500">
                    Please reach out to{' '}
                    <a href="mailto:whodo-support@gmail.com" className="!text-indigo-600">
                      whodo-support@gmail.com
                    </a>{' '}
                    if there are any issues.
                  </Typography>
                </Box>
              )}

              <Button
                type="button"
                onClick={() => { setHasForgottenPassword(false); setIsPasswordResetSent(false); }}
                className="!mt-4 !text-gray-500 !normal-case"
              >
                Back to Sign In
              </Button>
            </form>
          )}
        </Paper>
      </Box>
    </div>
  );
}
