import { 
  Box, 
  CircularProgress,
} from '@mui/material';
import { Suspense } from 'react';
import ResetPasswordContent from './reset-password-content';

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ResetPasswordPage({ 
  params,
}: PageProps) {
  const resolvedParams = await params;
  
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
      <ResetPasswordContent token={resolvedParams.token} />
    </Suspense>
  );
}