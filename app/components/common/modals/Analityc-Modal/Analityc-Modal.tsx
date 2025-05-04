import { GitHubUser } from '@/app/types/github';
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Box } from '@mui/material'
import { useModalsOpenStore } from '@/app/store/modals-open/store'
import Dialog from '@mui/material/Dialog'
import React from 'react'
import UserAnalytics from '../../../user-analitics/UserAnalitics';
import styles from '@/app/components/common/modals/modal.module.css'

interface AnalitycModalProps {
    candidate: GitHubUser;
}

const AnalitycModal = ({ candidate }: AnalitycModalProps) => {
    const isAnaliticsOpen = useModalsOpenStore((state) => state.isAnaliticsOpen);
    const handleAnaliticsClose = useModalsOpenStore((state) => state.handleAnaliticsClose);

  return (
    <Dialog
        open={isAnaliticsOpen}
        onClose={handleAnaliticsClose}
        onTransitionExited={handleAnaliticsClose}
        aria-label="Analitics modal"
        slotProps={{
          paper: {
            className: styles.modalPaper,
          },
        }}
      >
        <IconButton onClick={handleAnaliticsClose} className={styles.closeButton}>
          <CloseIcon />
        </IconButton>
        <Box className={styles.modalContent}>
          <UserAnalytics reposUrl={candidate.repos_url} />
        </Box>
      </Dialog>
  )
}

export default AnalitycModal