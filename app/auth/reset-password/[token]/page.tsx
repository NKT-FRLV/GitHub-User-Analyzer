
import { 
  Box, 
  CircularProgress,
} from '@mui/material';
import { Suspense } from 'react';
import ResetPasswordContent from './reset-password-content';

export default async function ResetPasswordPage({ 
  params 
}: {
  params: { token: string }
}) {
  return (
    <Suspense fallback={
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexGrow: 1 
      }}>
        <CircularProgress color="primary" />
      </Box>
    }>
      <ResetPasswordContent token={params.token} />
    </Suspense>
  );
} 