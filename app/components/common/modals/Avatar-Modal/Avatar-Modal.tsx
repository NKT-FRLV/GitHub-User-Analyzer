import { Box, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import { IconButton } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import { GitHubUser } from '@/app/types/github'
import React from 'react'
import styles from '@/app/components/common/modals/modal.module.css'
import { useModalsOpenStore } from '@/app/store/modals-open/store'

/**
 * AvatarModal component displays a user's avatar in a modal window.
 * It handles two types of user data:
 * 1. GitHub API data with login, avatar_url, bio properties
 * 2. Database data with githubName, avatarUrl properties
 */
const AvatarModal = () => {
  const person = useModalsOpenStore((state) => state.person);
  const isAvatarOpen = useModalsOpenStore((state) => state.isAvatarOpen);
  const handleAvatarClose = useModalsOpenStore((state) => state.handleAvatarClose);

  // Early return if no person data
  if (!person) return null;

  // Helper functions to safely access properties that might exist on different types
  const getAvatarUrl = () => {
    if ('avatar_url' in person && person.avatar_url) {
      return person.avatar_url;
    }
    if ('avatarUrl' in person && person.avatarUrl) {
      return person.avatarUrl;
    }
    return '/images/default-avatar.png'; // Fallback avatar image
  };

  const getDisplayName = () => {
    if ('login' in person && person.login) {
      return person.login;
    }
    if ('githubName' in person && person.githubName) {
      return person.githubName;
    }
    return 'Unknown User';
  };

  const hasBio = 'bio' in person && person.bio;

  return (
    <Dialog
      open={isAvatarOpen}
      onClose={handleAvatarClose}
      slotProps={{
        paper: {
          className: styles.modalPaper,
        },
      }}
    >
      <IconButton onClick={handleAvatarClose} className={styles.closeButton}>
        <CloseIcon />
      </IconButton>

      <Box className={styles.modalContent}>
        <Image
          src={getAvatarUrl()}
          alt={getDisplayName()}
          width={400}
          height={400}
          className={styles.modalImage}
        />
        <Typography variant="h4" sx={{ mt: 2 }}>
          {getDisplayName()}
        </Typography>
        {hasBio && (
          <Typography variant="body1" sx={{ mt: 1, color: "grey.600" }}>
            {person.bio}
          </Typography>
        )}
      </Box>
    </Dialog>
  )
}

export default AvatarModal