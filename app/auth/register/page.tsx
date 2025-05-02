"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';
import { RegisterCredentials } from '../../types/github';
import { useAuth } from '../../context/AuthContext';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import FullPageLoader from '../../components/common/FullPageLoader';
import { 
  FormContainer, 
  FormHeader, 
  FormAlert,
  LinkItem 
} from '../common';
import RegisterForm from './register-form';

export default function RegisterPage() {
  const router = useRouter();
  const { register, user } = useAuth();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Если пользователь уже аутентифицирован, перенаправляем на главную
  useEffect(() => {
    if (user?.isAuthenticated) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (credentials: RegisterCredentials) => {
    setError('');
    setLoading(true);

    try {
      const success = await register(
        credentials.username, 
        credentials.email, 
        credentials.password
      );
      
      if (success) {
        router.push('/auth/login?registered=true');
        return;
      } else {
        setError('User with this name already exists');
      }
    } catch (err) {
      setError('An error occurred while registering');
      console.error('Registration error:', err);
    }

    setLoading(false);
  };

  const handleValidate = (isValid: boolean) => {
    if (!isValid) {
      setError('Please check form fields and try again');
    } else {
      setError('');
    }
  };

  const links: LinkItem[] = [
    {
      href: "/auth/login",
      text: "Already have an account? Login",
      ariaLabel: "Go to the login page"
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
        containerClassName={styles.registerContainer}
        paperClassName={styles.registerPaper}
        fadeInClassName={styles.fadeIn}
      >
        <FormHeader
          icon={<PersonAddAltOutlinedIcon sx={{ color: 'var(--background)' }} />}
          title="Registration"
          titleClassName={styles.registerTitle}
        />
        
        <FormAlert 
          message={error} 
          severity="error" 
          className={styles.alert}
        />
        
        <RegisterForm
          onSubmit={handleSubmit}
          loading={loading}
          links={links}
          onValidate={handleValidate}
        />
      </FormContainer>
    </>
  );
}
