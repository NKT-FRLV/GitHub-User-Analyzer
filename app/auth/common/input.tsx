import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  variant?: 'outlined' | 'standard' | 'filled';
  autoFocus?: boolean;
  autoComplete?: string;
  required?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  error = false,
  helperText,
  variant = 'outlined',
  autoFocus = false,
  autoComplete,
  required = false,
  fullWidth = true,
  size = 'small',
  ...rest
}) => {
  return (
    <TextField
      id={name}
      name={name}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      variant={variant}
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      required={required}
      fullWidth={fullWidth}
      size={size}
      margin="normal"
      {...rest}
    />
  );
};

export default Input;