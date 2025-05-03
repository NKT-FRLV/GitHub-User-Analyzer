"use client";

import { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert,
  useTheme
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../reset-password.module.css';
import KeyIcon from '@mui/icons-material/Key';
import { FormAlert, FormContainer, FormHeader } from '../../common';
import ResetPasswordForm from './reset-password-form';


function ResetPasswordContent({ token }: { token: string }) {


  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  

  

  return (
    <FormContainer
      containerClassName={styles.container}
      paperClassName={styles.paper}
      // fadeInClassName={styles.fadeIn}
    >
      <FormHeader
        icon={<KeyIcon sx={{ color: 'primary.main' }} />}
        title="Set New Password"
        titleClassName={styles.title}
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
        
      <ResetPasswordForm 
        token={token}
        setError={setError}
        setSuccess={setSuccess}
      />

      <Box className={styles.links}>
        <Link 
          href="/auth/login" 
          className={styles.neonLink}
          passHref
          aria-label="Back to login page"
        >
          Back to Login
        </Link>
      </Box>

    </FormContainer>
  );
}

export default ResetPasswordContent;