"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './login.module.css';
import { LoginCredentials } from '../../types/github';
import { useAuth } from '../../context/AuthContext';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FullPageLoader from '../../components/common/FullPageLoader';
import { 
  FormContainer, 
  FormHeader, 
  FormAlert, 
  LinkItem 
} from '../common';
import LoginForm from './login-form';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { login } = useAuth();

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (credentials: LoginCredentials) => {
    setError('');
    setSuccess('');
    
    setLoading(true);

    try {
      const success = await login(credentials.username, credentials.password);
      
      if (success) {
        const redirectPath = searchParams.get('from') || '/';
        router.push(redirectPath);
        return;
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred while logging in');
      console.error('Login error:', err);
    }
    
    setLoading(false);
  };

  const links: LinkItem[] = [
    {
      href: "/auth/register",
      text: "No account? Register",
      ariaLabel: "Go to the registration page"
    },
    {
      href: "/auth/forgot-password",
      text: "Forgot password?",
      ariaLabel: "Forgot your password?"
    },
    {
      href: "/",
      text: "Back to the main page",
      ariaLabel: "Go to the main page"
    }
  ];

  return (
    <>
      <FullPageLoader open={loading} />
      <FormContainer
        containerClassName={styles.loginContainer}
        paperClassName={styles.loginPaper}
        fadeInClassName={styles.fadeIn}
      >
        <FormHeader
          icon={<LockOutlinedIcon sx={{ color: 'var(--background)' }} />}
          title="Login to system"
          titleClassName={styles.loginTitle}
        />
        
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
        
        <LoginForm 
          onSubmit={handleSubmit}
          loading={loading}
          links={links}
        />
      </FormContainer>
    </>
  );
}