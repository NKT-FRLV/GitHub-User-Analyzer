import React from 'react';
import { Alert, AlertProps } from '@mui/material';

interface FormAlertProps extends Omit<AlertProps, 'severity'> {
  message: string;
  severity: 'error' | 'success' | 'info' | 'warning';
  className?: string;
}

const FormAlert: React.FC<FormAlertProps> = ({
  message,
  severity,
  className,
  ...rest
}) => {
  if (!message) return null;
  
  return (
    <Alert 
      key={message + 'alert'}
      severity={severity} 
      className={className}
      sx={{ width: '100%' }}
      {...rest}
    >
      {message}
    </Alert>
  );
};

export default FormAlert; 