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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResetPasswordPage({ 
  params,
  searchParams 
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
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