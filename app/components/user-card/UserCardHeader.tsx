"use client";

import React, { useRef, useState } from "react";
import { 
  Box, 
  Typography, 
  Avatar, 
  Dialog, 
  IconButton 
} from "@mui/material";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import TextInfo from "../common/TextInfo";
import styles from "./userCard.module.css";
import { AuthUser, GitHubUser } from "../../types/github";

interface UserCardHeaderProps {
  githubCandidate: GitHubUser;
  user: AuthUser | null;
  avatarSize: string;
  isMobileView: boolean;
  adaptiveFontSize1: string;
  adaptiveFontSize2: string;
}

const UserCardHeader: React.FC<UserCardHeaderProps> = ({
  githubCandidate,
  user,
  avatarSize,
  isMobileView,
  adaptiveFontSize1,
  adaptiveFontSize2
}) => {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const handleAvatarClose = () => {
    setAvatarOpen(false);
    if (avatarRef.current) {
      avatarRef.current.focus();
    }
  };

  return (
    <>
      <Box className={styles.header}>
        <Avatar
          className={styles.avatarContainer}
          aria-label="Avatar modal"
          src={
            user?.isAuthenticated && githubCandidate.login === user.username
              ? user.avatarUrl || githubCandidate.avatar_url // Use avatar from profile if available
              : githubCandidate.avatar_url
          }
          alt={githubCandidate.login}
          sx={{ width: avatarSize, height: avatarSize, cursor: "pointer" }}
          ref={avatarRef}
          onClick={() => setAvatarOpen(true)}
        />
        <Box className={styles.userDetails}>
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            alignItems="baseline"
            my={1}
          >
            <TextInfo
              text={
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    color: "grey.600",
                    fontSize: adaptiveFontSize1,
                  }}
                >
                  Name:
                </Typography>
              }
              value={githubCandidate.name}
              isSmallScreen={isMobileView}
              fsMax="1.5rem"
              fsMin="1rem"
              spacing={false}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            alignItems="baseline"
          >
            <TextInfo
              text={
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    color: "grey.600",
                    fontSize: adaptiveFontSize1,
                  }}
                >
                  Login:
                </Typography>
              }
              value={githubCandidate.login}
              isSmallScreen={isMobileView}
              fsMax="1.5rem"
              fsMin="1rem"
              spacing={false}
            />
          </Box>

          <Typography
            variant="body1"
            sx={{ mb: 1, mt: 2, fontSize: adaptiveFontSize2 }}
          >
            {githubCandidate.bio || "No bio available"}
          </Typography>
        </Box>
      </Box>

      {/* Avatar Modal */}
      <Dialog
        open={avatarOpen}
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
            src={githubCandidate.avatar_url}
            alt={githubCandidate.login}
            width={400}
            height={400}
            className={styles.modalImage}
          />
          <Typography variant="h4" sx={{ mt: 2 }}>
            {githubCandidate.login}
          </Typography>
          {githubCandidate.bio && (
            <Typography variant="body1" sx={{ mt: 1, color: "grey.600" }}>
              {githubCandidate.bio}
            </Typography>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default UserCardHeader; 