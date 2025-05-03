"use client";

import React, { useRef, useState } from "react";
import { Box, Button, Dialog, IconButton } from "@mui/material";
import { BarChart, Folder, BookmarkAdd } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import UserAnalytics from "../user-analitics/UserAnalitics";
import styles from "./userCard.module.css";
import { GitHubUser } from "../../types/github";

interface UserCardActionsProps {
  githubCandidate: GitHubUser;
  handleRepos: () => void;
  handleSaveCandidate: () => void;
  buttonFontSize: string;
}

const UserCardActions: React.FC<UserCardActionsProps> = ({
  githubCandidate,
  handleRepos,
  handleSaveCandidate,
  buttonFontSize,
}) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [analiticsOpen, setAnaliticsOpen] = useState(false);
  const modalButtonRef = useRef<HTMLButtonElement>(null);

  const onSaveCandidate = async () => {
    await handleSaveCandidate();
    // setIsDisabled(true);
  };

  const closeAnalitics = () => {
    setAnaliticsOpen(false);
    if (modalButtonRef.current) {
      modalButtonRef.current.focus();
    }
  };

  const buttonStyle = {
    backgroundColor: "grey.900",
    fontSize: buttonFontSize,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "grey.800",
    },
  };

  return (
    <>
      <Box className={styles.buttonContainer}>
        <Box className={styles.buttonGroup}>
          <Button
            variant="contained"
            sx={buttonStyle}
            startIcon={<Folder sx={{ fontSize: buttonFontSize }} />}
            onClick={handleRepos}
          >
            Repos: {githubCandidate.public_repos}
          </Button>
          <Button
            variant="contained"
            ref={modalButtonRef}
            sx={buttonStyle}
            startIcon={<BarChart sx={{ fontSize: buttonFontSize }} />}
            onClick={() => setAnaliticsOpen(true)}
          >
            Languages
          </Button>
        </Box>
        <Button
          variant="contained"
          onClick={onSaveCandidate}
          disabled={isDisabled}
          sx={buttonStyle}
          startIcon={<BookmarkAdd sx={{ fontSize: buttonFontSize }} />}
        >
          Save candidate
        </Button>
      </Box>

      {/* Analytics Modal */}
      <Dialog
        open={analiticsOpen}
        onClose={closeAnalitics}
        onTransitionExited={closeAnalitics}
        aria-label="Analitics modal"
        slotProps={{
          paper: {
            className: styles.modalPaper,
          },
        }}
      >
        <IconButton onClick={closeAnalitics} className={styles.closeButton}>
          <CloseIcon />
        </IconButton>
        <Box className={styles.modalContent}>
          <UserAnalytics reposUrl={githubCandidate.repos_url} />
        </Box>
      </Dialog>
    </>
  );
};

export default UserCardActions; 