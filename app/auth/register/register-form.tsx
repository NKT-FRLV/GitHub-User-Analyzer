import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { 
  Input, 
  SubmitButton, 
  FormLinks, 
  LinkItem 
} from '../common';
import styles from './register.module.css';
import { RegisterCredentials } from '../../types/github';
import clsx from 'clsx';

interface RegisterFormProps {
  onSubmit: (credentials: RegisterCredentials, confirmPassword: string) => Promise<void>;
  loading: boolean;
  links: LinkItem[];
  onValidate?: (isValid: boolean) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSubmit, 
  loading, 
  links,
  onValidate
}) => {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localValidationError, setLocalValidationError] = useState('');

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setCredentials(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!credentials.username || !credentials.email || !credentials.password) {
      setLocalValidationError('All fields are required');
      return false;
    }
    
    if (credentials.password !== confirmPassword) {
      setLocalValidationError('Passwords do not match');
      return false;
    }
    
    if (credentials.password.length < 6) {
      setLocalValidationError('Password must be at least 6 characters long');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      setLocalValidationError('Enter a valid email');
      return false;
    }
    
    setLocalValidationError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      if (onValidate) onValidate(false);
      return;
    }

    if (onValidate) onValidate(true);
    await onSubmit(credentials, confirmPassword);
  };

  return (
    <Box
      ref={formRef}
      tabIndex={-1}
      aria-label="Registration form"
      component="form"
      onSubmit={handleSubmit}
      className={styles.form}
    >
      <Input
        name="username"
        label="Username"
        autoComplete="username"
        value={credentials.username}
        onChange={handleChange}
        required
        error={!!localValidationError && !credentials.username}
      />
      <Input
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={credentials.email}
        onChange={handleChange}
        required
        error={!!localValidationError && !credentials.email}
      />
      <Input
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        value={credentials.password}
        onChange={handleChange}
        required
        error={!!localValidationError && (
          !credentials.password || credentials.password.length < 6
        )}
      />
      <Input
        name="confirmPassword"
        label="Confirm password"
        type="password"
        value={confirmPassword}
        onChange={handleChange}
        required
        error={!!localValidationError && (
          !confirmPassword || confirmPassword !== credentials.password
        )}
      />
      <SubmitButton
        text="Register"
        loading={loading}
        loadingText="Registration..."
        className={styles.submitButton}
      />
      <FormLinks
        links={links}
        className={styles.links}
        linkClassName={styles.neonLink}
      />
    </Box>
  );
};

export default RegisterForm; 