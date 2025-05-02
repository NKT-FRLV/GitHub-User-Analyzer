"use client";

import React, { useState, Suspense } from 'react';
import { 
  Box, 
  CircularProgress
} from '@mui/material';
import { useRouter } from 'next/navigation';
import styles from './forgot-password.module.css';
import LockResetIcon from '@mui/icons-material/LockReset';
import { 
  FormContainer, 
  FormHeader, 
  FormAlert, 
  LinkItem 
} from '../common';
import ForgotPasswordForm from './forgot-password-form';

function ForgotPasswordContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showResetForm, setShowResetForm] = useState<boolean>(false);

  const handleRequestCode = async (emailValue: string) => {
    setEmail(emailValue);
    setError('');
    setSuccess('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
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
        body: JSON.stringify({ email: emailValue }),
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

  const handleResetPassword = async (newPassword: string, confirmPassword: string) => {
    setError('');
    setSuccess('');

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

  const links: LinkItem[] = [
    {
      href: "/auth/login",
      text: "Back to Login",
      ariaLabel: "Back to login page"
    },
    {
      href: "/",
      text: "Back to Main Page",
      ariaLabel: "Go to the main page"
    }
  ];

  return (
    <FormContainer
      containerClassName={styles.container}
      paperClassName={styles.paper}
      fadeInClassName={styles.fadeIn}
    >
      <FormHeader
        icon={<LockResetIcon sx={{ color: 'var(--background)' }} />}
        title="Reset Password"
        titleClassName={styles.title}
      />
      
      {!showResetForm && (
        <Box component="div" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
          Enter your email address to receive a reset code.
        </Box>
      )}

      <FormAlert 
        message={error} 
        severity="error" 
        className={styles.alert}
      />
      
      <FormAlert 
        message={success} 
        severity="success" 
        className={styles.alert}
      />
      
      <ForgotPasswordForm
        onRequestCode={handleRequestCode}
        onResetPassword={handleResetPassword}
        loading={loading}
        links={links}
        showResetForm={showResetForm}
        resetCode={resetCode}
      />
    </FormContainer>
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