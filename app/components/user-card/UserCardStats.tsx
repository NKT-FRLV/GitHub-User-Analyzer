"use client";

import React from "react";
import { Box } from "@mui/material";
import TextInfo from "../common/TextInfo";
import { GitHubUser } from "../../types/github";
import styles from "./userCard.module.css";

interface UserCardStatsProps {
  githubCandidate: GitHubUser;
  isMobileView: boolean;
}

const UserCardStats: React.FC<UserCardStatsProps> = ({
  githubCandidate,
  isMobileView,
}) => {
  return (
    <Box className={styles.statsBox} my={2}>
      <TextInfo 
        text="Followers" 
        value={githubCandidate.followers} 
        isSmallScreen={isMobileView} 
        fsMax="1rem" 
        fsMin="0.8rem" 
      />
      <TextInfo 
        text="Following" 
        value={githubCandidate.following} 
        isSmallScreen={isMobileView} 
        fsMax="1rem" 
        fsMin="0.8rem" 
      />
    </Box>
  );
};

export default UserCardStats; 