"use client";

import React, { useState, Suspense } from 'react';
import { 
  Container, 
  Box, 
  CircularProgress,
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert,
  useTheme
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './forgot-password.module.css';
import LockResetIcon from '@mui/icons-material/LockReset';
import Avatar from '@mui/material/Avatar';

function ForgotPasswordContent() {
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showResetForm, setShowResetForm] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setResetCode(data.resetCode);
        setSuccess('Your reset code has been generated. Please save it and proceed to reset your password.');
        setShowResetForm(true);
      } else {
        setError(data.message || 'Failed to process password reset request');
      }
    } catch (err) {
      setError('An error occurred while processing your request');
      console.error('Password reset request error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          resetCode,
          password: newPassword 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password has been successfully reset');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred while resetting password');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={styles.container}>
      <Paper elevation={2} className={styles.paper}>
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ 
            m: 1, 
            bgcolor: 'rgba(84, 110, 122, 0.1)',
            width: 50,
            height: 50
          }}>
            <LockResetIcon sx={{ color: theme.palette.primary.main }} />
          </Avatar>
          
          <Typography component="h1" variant="h5" className={styles.title}>
            Reset Password
          </Typography>
          
          {!showResetForm && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
              Enter your email address to receive a reset code.
            </Typography>
          )}

          {error && (
            <Alert 
              severity="error" 
              className={styles.alert}
              sx={{ width: '100%' }}
            >
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert 
              severity="success" 
              className={styles.alert}
              sx={{ width: '100%' }}
            >
              {success}
            </Alert>
          )}
          
          {!showResetForm ? (
            <Box component="form" onSubmit={handleRequestCode} className={styles.form}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                size="small"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={styles.submitButton}
                disabled={loading}
                sx={{ mt: 2, mb: 2 }}
              >
                {loading ? 'Sending...' : 'Get Reset Code'}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleResetPassword} className={styles.form}>
              {resetCode && (
                <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
                  Your reset code: <strong>{resetCode}</strong>
                </Alert>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                variant="outlined"
                size="small"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
                size="small"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={styles.submitButton}
                disabled={loading}
                sx={{ mt: 2, mb: 2 }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Box>
          )}
          
          <Box className={styles.links}>
            <Link 
              href="/auth/login" 
              className={styles.neonLink} 
              passHref
              aria-label="Back to login page"
            >
              Back to Login
            </Link>
            <Link 
              href="/" 
              className={styles.neonLink} 
              passHref
              aria-label="Go to the main page"
            >
              Back to Main Page
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexGrow: 1 
          }}>
            <CircularProgress color="primary" />
          </Box>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
} 