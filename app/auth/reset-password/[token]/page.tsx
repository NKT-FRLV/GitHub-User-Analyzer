
import { Suspense } from 'react';
import { 
  Box, 
  CircularProgress,
} from '@mui/material';
import ResetPasswordContent from './reset-password-content';

interface ResetPasswordPageProps {
  params: Promise<{ token: string }> | { token: string }
}

export default async function ResetPasswordPage({ 
  params 
}: ResetPasswordPageProps) {
  // Проверяем, Promise это или нет
  let tokenParams: { token: string };
  if (params && typeof (params as Promise<{ token: string }>).then === "function") {
    tokenParams = await (params as Promise<{ token: string }>);
  } else {
    tokenParams = params as { token: string };
  }

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
      <ResetPasswordContent token={tokenParams.token} />
    </Suspense>
  );
} 