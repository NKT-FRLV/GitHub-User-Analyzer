"use client";

import React, { useState } from "react";
import { Box, Button} from "@mui/material";
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
}

const UserCardActions: React.FC<UserCardActionsProps> = ({
  githubCandidate,
  handleRepos,
  handleSaveCandidate,
  buttonFontSize,
}) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const handleAnaliticsOpen = useModalsOpenStore((state) => state.handleAnaliticsOpen);
  
  

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
          sx={buttonStyle}
          startIcon={<BookmarkAdd sx={{ fontSize: buttonFontSize }} />}
        >
          Save candidate
        </Button>
      </Box>

      {/* Analytics Modal */}
      <AnalitycModal candidate={githubCandidate} />
    </>
  );
};

export default UserCardActions; 