import React, { ReactNode } from 'react';
import { Box, Typography, Avatar } from '@mui/material';

interface FormHeaderProps {
  icon: ReactNode;
  title: string;
  titleClassName?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  icon,
  title,
  titleClassName,
}) => {

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Avatar sx={{ 
        m: 1, 
        bgcolor: 'rgba(84, 110, 122, 0.1)',
        width: 50,
        height: 50
      }}>
          {icon}
      </Avatar>
      
      <Typography component="h1" variant="h5" sx={{ mb: 2 }} className={titleClassName}>
        {title}
      </Typography>
    </Box>
  );
};

export default FormHeader; 