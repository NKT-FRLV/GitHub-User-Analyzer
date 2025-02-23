"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Dialog,
  IconButton,
  // Backdrop,
  // CircularProgress,
  Button,
  Divider,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Backdrop
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import Image from "next/image";
import { FS, AvatarSize } from "../../types/enums";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./userCard.module.css";
import { UserCardProps } from "../../types/github";
import UserAnalytics from "../user-analitics/UserAnalitics";
import TextInfo from "../common/TextInfo";
import FolderIcon from "@mui/icons-material/Folder";
import BarChartIcon from "@mui/icons-material/BarChart";
// import RepoListModal from "./modals/RepoListModal";
// import { fetchReposApi } from "../../api/API";

const UserCard = ({ user, error, isMobile: serverIsMobile, userInteracted }: UserCardProps & { isMobile: boolean, userInteracted: boolean }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [analiticsOpen, setAnaliticsOpen] = React.useState(false);

  // const [repoListOpen, setRepoListOpen] = React.useState(false);
  // const [repos, setRepos] = React.useState<Repository[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMobileView, setIsMobileView] = useState(serverIsMobile);

  const router = useRouter();

  const handleRepos = () => {    
    setIsLoading(true);
    if (user) {
      router.push(`/repos?url=${user.repos_url}`);
    }
  }

  const clientIsMobile = useMediaQuery("(max-width: 768px)");

  // Функция переключения `isMobileView` при первом клике/таче
  useEffect(() => {
    if (userInteracted) {
      setIsMobileView(clientIsMobile);
    }
  }, [clientIsMobile, userInteracted]);

  const avatarSize = isMobileView ? AvatarSize.small : AvatarSize.big;
  const buttonFontSize = isMobileView ? FS.S : FS.X;
  const adaptiveFontSize1 = isMobileView ? FS.L : FS.XL;
  const adaptiveFontSize2 = isMobileView ? FS.M : FS.X;

  useEffect(() => {
    if (user) {
      // setRepoListOpen(false);
      setAnaliticsOpen(false);
      setOpenModal(false);
    }
  }, [user]);

  // const fetchRepos = async (url: string) => {
  //   if (repos.length > 0) {
  //     setRepoListOpen(true);
  //     return;
  //   }
  
  //   setIsLoading(true);
  //   const data = await fetchReposApi(url);
  
  //   if (data) {
  //     setRepos(data);
  //   } else {
  //     console.error("Error fetching repos");
  //   }
  
  //   setRepoListOpen(true);
  //   setIsLoading(false);
  // };

  // const handleRepos = (isOpen: boolean, url?: string) => {
  //   if (isOpen && url) {
  //     fetchRepos(url);
  //     //
  //   } else {
  //     setRepoListOpen(false);
  //   }
  // };

  const closeAnalitics = () => {
    setAnaliticsOpen(false);
  };

  if (error) {
    return (
      <Typography color="error" className={styles.error}>
        {error}
      </Typography>
    );
  }

  if (!user) {
    return (
      <Typography color="white" variant="h4" component="p">
        Try to input GitHub username
      </Typography>
    );
  }

  return (
    <>
      <Card elevation={3} className={styles.container} component="article">
        <CardContent className={styles.userInfo}>
            <Box className={styles.header}>
              <Avatar
                className={styles.avatarContainer}
                src={user.avatar_url}
                alt={user.login}
                sx={{ width: avatarSize, height: avatarSize, cursor: "pointer" }}
                onClick={() => setOpenModal(true)}
              />
            <Box className={styles.userDetails}>
              <Box
                display="flex"
                flexDirection="row"
                gap={1}
                alignItems="baseline"
                my={1}
              >
                <TextInfo text={
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "grey.600", fontSize: adaptiveFontSize1 }}
                    >
                      Name:
                    </Typography>
                  }
                  value={user.name}
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
                <TextInfo text={
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", color: "grey.600", fontSize: adaptiveFontSize1 }}
                    >
                      Login:
                    </Typography>
                  }
                  value={user.login}
                  isSmallScreen={isMobileView}
                  fsMax="1.5rem"
                  fsMin="1rem" 
                  spacing={false}
                />
              </Box>

              <Typography variant="body1" sx={{ mb: 1, mt: 2, fontSize: adaptiveFontSize2 }}>
                {user.bio || "No bio available"}
              </Typography>
            </Box>
          </Box>

          <Box className={styles.statsBox} my={2}>
            <TextInfo text="Followers" value={user.followers} isSmallScreen={isMobileView} fsMax="1rem" fsMin="0.8rem" />
            <TextInfo text="Following" value={user.following} isSmallScreen={isMobileView} fsMax="1rem" fsMin="0.8rem" />
          </Box>

          <Divider />

          <Box className={styles.buttonGroup}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "grey.900", fontSize: buttonFontSize }}
              startIcon={<FolderIcon sx={{ fontSize: buttonFontSize }} />}
              onClick={handleRepos}
              style={{ cursor: "pointer" }}
            >
              Repos: {user.public_repos}
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "grey.900", fontSize: buttonFontSize }}
              startIcon={<BarChartIcon sx={{ fontSize: buttonFontSize }} />}
              onClick={() => setAnaliticsOpen(true)}
              style={{ cursor: "pointer" }}
            >
              Languages
            </Button>
          </Box>

          <Dialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            maxWidth="md"
            slotProps={{
              paper: {
                className: styles.modalPaper,
              },
            }}
          >
            <IconButton
              onClick={() => setOpenModal(false)}
              className={styles.closeButton}
            >
              <CloseIcon />
            </IconButton>

            <Box className={styles.modalContent}>
              <Image
                src={user.avatar_url}
                alt={user.login}
                width={400}
                height={400}
                className={styles.modalImage}
              />
              <Typography variant="h4" sx={{ mt: 2 }}>
                {user.login}
              </Typography>
              {user.bio && (
                <Typography variant="body1" sx={{ mt: 1, color: "grey.600" }}>
                  {user.bio}
                </Typography>
              )}
            </Box>
          </Dialog>

        {/* 
          <RepoListModal
            repoListOpen={repoListOpen}
            handleRepos={handleRepos}
            user={user}
          /> */}
          

          <Dialog
            open={analiticsOpen}
            onClose={closeAnalitics}
            maxWidth="md"
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
              <UserAnalytics reposUrl={user.repos_url} />
            </Box>
          </Dialog>
        </CardContent>
      </Card>

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
        onClick={() => {}}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default UserCard;
