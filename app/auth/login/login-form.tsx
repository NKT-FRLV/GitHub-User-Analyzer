import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { 
  Input, 
  SubmitButton, 
  FormLinks, 
  LinkItem 
} from '../common';
import styles from './login.module.css';
import { LoginCredentials } from '../../types/github';
import clsx from 'clsx';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  loading: boolean;
  links: LinkItem[];
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  loading, 
  links 
}) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });

//   const formRef = useRef<HTMLFormElement>(null);

//   useEffect(() => {
//     if (formRef.current) {
//       formRef.current.focus();
//     }
//   }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username.trim() || !credentials.password.trim()) {
      // Можно реализовать локальную валидацию здесь
      return;
    }

    await onSubmit(credentials);
  };

  return (
    <Box
    //   ref={formRef}
      tabIndex={-1}
      aria-label="Login form"
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
      />
      <Input
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        value={credentials.password}
        onChange={handleChange}
        required
      />
      <SubmitButton
        text="Login"
        loading={loading}
        loadingText="Loading..."
        className={clsx(styles.submitButton, { [styles.buttonLoading]: loading })}
      />
      <FormLinks
        links={links}
        className={styles.links}
        linkClassName={styles.neonLink}
      />
    </Box>
  );
};

export default LoginForm;