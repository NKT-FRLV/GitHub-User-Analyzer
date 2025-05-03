import React, { ReactNode, useEffect, useState } from 'react';
import { Container, Paper, Box } from '@mui/material';
import clsx from 'clsx';

interface FormContainerProps {
  children: ReactNode;
  containerClassName?: string;
  paperClassName?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fadeInClassName?: string;
}

const FormContainer: React.FC<FormContainerProps> = ({
  children,
  containerClassName,
  paperClassName,
  maxWidth = 'xs',
  fadeInClassName = ''
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <Container
      component="main"
      maxWidth={maxWidth}
      className={clsx(containerClassName, mounted && fadeInClassName)}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}
    >
      <Paper elevation={2} className={paperClassName}>
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {children}
        </Box>
      </Paper>
    </Container>
  );
};

export default FormContainer; 