"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, styled } from "@mui/material";
import { BarChart, Folder, BookmarkAdd } from "@mui/icons-material";

import styles from "./userCard.module.css";
import { GitHubUser } from "../../types/github";
import AnalitycModal from "../common/modals/Analityc-Modal/Analityc-Modal";
import { useModalsOpenStore } from "@/app/store/modals-open/store";
interface UserCardActionsProps {
  githubCandidate: GitHubUser;
  handleRepos: () => void;
  handleSaveCandidate: () => void;
  buttonFontSize: string;
  isChecking: boolean;
  isSaved: boolean;
}

const UserCardActions: React.FC<UserCardActionsProps> = ({
  githubCandidate,
  handleRepos,
  handleSaveCandidate,
  buttonFontSize,
  isChecking,
  isSaved,
}) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(isSaved);
  const handleAnaliticsOpen = useModalsOpenStore((state) => state.handleAnaliticsOpen);

  useEffect(() => {
	if (isChecking) {
		setIsDisabled(false);
	} else {
		setIsDisabled(isSaved);
	}
  }, [isSaved, isChecking]);

  const onSaveCandidate = async () => {
    await handleSaveCandidate();
    setIsDisabled(true);
  };
  // const modalButtonRef = useRef<HTMLButtonElement>(null);

  // const closeAnalitics = () => {
  //   setAnaliticsOpen(false);
  //   if (modalButtonRef.current) {
  //     modalButtonRef.current.focus();
  //   }
  // };

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
            // ref={modalButtonRef}
            sx={buttonStyle}
            startIcon={<BarChart sx={{ fontSize: buttonFontSize }} />}
            onClick={handleAnaliticsOpen}
          >
            Languages
          </Button>
        </Box>
        <Button
          variant="contained"
          onClick={onSaveCandidate}
          disabled={isDisabled}
          sx={{
            ...buttonStyle,
            '&.Mui-disabled': {
              bgcolor: (theme) => theme.palette.success.main,
              color: '#fff',
              opacity: 0.9,
            },
			transition: 'background-color 1s ease',
          }}
          startIcon={isChecking ? <CircularProgress size={20} /> : <BookmarkAdd sx={{ fontSize: buttonFontSize }} />}
        >
          {isChecking ? "Checking..." : isDisabled ? "Saved" : "Save candidate"}
        </Button>
      </Box>

      {/* Analytics Modal */}
      <AnalitycModal candidate={githubCandidate} />
    </>
  );
};

export default UserCardActions; 