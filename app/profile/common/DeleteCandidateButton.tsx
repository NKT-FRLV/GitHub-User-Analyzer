'use client';

import { useState } from 'react';
import { IconButton, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

interface DeleteCandidateButtonProps {
  candidateId: string;
}

export const DeleteCandidateButton = ({ candidateId }: DeleteCandidateButtonProps) => {
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/candidates', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidateId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSnackbar({
          open: true,
          message: 'Candidate successfully deleted',
          severity: 'success'
        });
        router.refresh();
      } else {
        throw new Error('Failed to delete candidate');
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete candidate',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <IconButton
        onClick={handleDelete}
        color="error"
        size="small"
      >
        <DeleteIcon />
      </IconButton>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}; 