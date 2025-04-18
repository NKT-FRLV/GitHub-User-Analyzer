import React from 'react';
import { CircularProgress, Box, Backdrop } from '@mui/material';

type FullPageLoaderProps = {
  open: boolean;
  text?: string;
};

const FullPageLoader: React.FC<FullPageLoaderProps> = ({ open, text }) => (
  <Backdrop
    open={open}
    sx={{
      color: '#fff',
      zIndex: (theme) => theme.zIndex.modal + 1,
      backdropFilter: 'blur(2px)',
      backgroundColor: 'rgba(0,0,0,0.5)',
      flexDirection: 'column',
    }}
  >
    <CircularProgress color="inherit" />
    {text && (
      <Box mt={2} fontSize={18}>
        {text}
      </Box>
    )}
  </Backdrop>
);

export default FullPageLoader; 