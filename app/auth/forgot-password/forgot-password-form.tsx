import React, { useState } from 'react';
import { Box, Alert } from '@mui/material';
import clsx from 'clsx';
import { 
  Input, 
  SubmitButton, 
  FormLinks, 
  LinkItem 
} from '../common';
import styles from './forgot-password.module.css';

interface ForgotPasswordFormProps {
  onRequestCode: (email: string) => Promise<void>;
  onResetPassword: (newPassword: string, confirmPassword: string) => Promise<void>;
  loading: boolean;
  links: LinkItem[];
  showResetForm: boolean;
  resetCode?: string;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onRequestCode,
  onResetPassword,
  loading,
  links,
  showResetForm,
  resetCode
}) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    await onRequestCode(email);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;
    
    await onResetPassword(newPassword, confirmPassword);
  };

  if (!showResetForm) {
    return (
      <Box component="form" onSubmit={handleRequestCode} className={styles.form}>
        <Input
          name="email"
          label="Email Address"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <SubmitButton
          text="Get Reset Code"
          loading={loading}
          loadingText="Sending..."
          className={clsx(styles.submitButton, { [styles.buttonLoading]: loading })}
        />
        <FormLinks
          links={links}
          className={styles.links}
          linkClassName={styles.neonLink}
        />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleResetPassword} className={styles.form}>
      {resetCode && (
        <Alert severity="info" sx={{ width: '100%' }}>
          Your reset code: <strong>{resetCode}</strong>
        </Alert>
      )}
      <Input
        name="newPassword"
        label="New Password"
        type="password"
        autoComplete="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <Input
        name="confirmPassword"
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <SubmitButton
        text="Reset Password"
        loading={loading}
        loadingText="Resetting..."
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

export default ForgotPasswordForm; 