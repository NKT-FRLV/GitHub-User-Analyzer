import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface SubmitButtonProps extends Omit<ButtonProps, 'variant'> {
  loading?: boolean;
  text: string;
  loadingText?: string;
  className?: string;
  variant?: 'text' | 'outlined' | 'contained';
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading = false,
  text,
  loadingText,
  className,
  variant = 'contained',
  disabled,
  ...rest
}) => {
  return (
    <Button
      type="submit"
      fullWidth
      variant={variant}
      className={className}
      disabled={loading || disabled}
      sx={{ mt: 2, mb: 2 }}
      {...rest}
    >
      {loading ? (loadingText || 'Loading...') : text}
    </Button>
  );
};

export default SubmitButton; 