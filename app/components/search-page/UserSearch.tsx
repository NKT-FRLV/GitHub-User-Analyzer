"use client";

import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  IconButton,
  Backdrop,
  CircularProgress,
  Button,
  Divider,
  Slide,
  Card,
  CardContent,
  Avatar
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
// import clsx from 'clsx';
import styles from "./userSearch.module.css";
import { UserSearchProps, Repository } from "../../types/github";

import RepoList from "../repoList/RepoList";
import UserAnalytics from "../user-analitics/UserAnalitics";
import AppBarComponent from "../common/AppBarComponent";
import TextInfo from "../common/TextInfo";
import FolderIcon from "@mui/icons-material/Folder";
import BarChartIcon from "@mui/icons-material/BarChart";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserSearch = ({ user, error, isMobile }: UserSearchProps & { isMobile: boolean }) => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [openModal, setOpenModal] = React.useState(false);
  const [analiticsOpen, setAnaliticsOpen] = React.useState(false);
  const [repoListOpen, setRepoListOpen] = React.useState(false);
  const [repos, setRepos] = React.useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = React.useState<Repository[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);


  const isClient = typeof window !== "undefined";

  // Выбираем корректный вариант
  const isMobileView = isClient ? isSmallScreen : isMobile;
  console.log(isMobileView);

  const avatarSize = isMobileView ? 120 : 150;
  const buttonFontSize = isMobileView ? "0.7rem" : "1rem";
  const fs = isMobileView ? "0.9rem" : "1.2rem";
  const fs2 = isMobileView ? "0.8rem" : "1rem";


  useEffect(() => {
    if (user) {
      setRepos([]);
      setRepoListOpen(false);
      setAnaliticsOpen(false);
      setOpenModal(false);
    }
  }, [user]);

  const fetchRepos = async (url: string) => {
    if (repos.length > 0) {
      setRepoListOpen(true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(url);
      const data: Repository[] = await response.json();
      setRepos(data);
    } catch (error) {
      console.error("Ошибка при получении репозиториев:", error);
    } finally {
      setRepoListOpen(true);
      setIsLoading(false);
    }
  };

  const handleRepos = (isOpen: boolean, url?: string) => {
    if (isOpen && url) {
      fetchRepos(url);
      //
    } else {
      setRepoListOpen(false);
    }
  };

  const filterByLanguage = (language: string) => {
    if (language === "All Langs") {
      setFilteredRepos([]);
      return;
    }
    const filtered = repos.filter((repo) => repo.language === language);
    setFilteredRepos(filtered);
  };

  const filterByRecentCommit = () => {
    const reposToFilter = filteredRepos.length > 0 ? filteredRepos : repos;
    const sorted = [...reposToFilter].sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
    setFilteredRepos(sorted);
  };

  const filterByDevelopmentTime = () => {
    const reposToFilter = filteredRepos.length > 0 ? filteredRepos : repos;
    const sorted = [...reposToFilter].sort((a, b) => {
      const aTime =
        new Date(a.updated_at).getTime() - new Date(a.created_at).getTime();
      const bTime =
        new Date(b.updated_at).getTime() - new Date(b.created_at).getTime();
      return bTime - aTime;
    });
    setFilteredRepos(sorted);
  };

  const closeAnalitics = () => {
    setAnaliticsOpen(false);
  };

  const availableLanguages = [
    "All Langs",
    ...Array.from(
      new Set(
        repos
          .map((repo) => repo.language)
          .filter((lang): lang is string => typeof lang === "string"),
      ),
    ),
  ];

  if (error) {
    return (
      <Typography color="error" className={styles.error}>
        {error}
      </Typography>
    );
  }

  if (!user) return null;

  return (
    <>
      <Card elevation={3} className={styles.container}>
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
                      sx={{ fontWeight: "bold", color: "grey.600", fontSize: fs }}
                    >
                      Name:
                    </Typography>
                  }
                  value={user.name}
                  isSmallScreen={isSmallScreen}
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
                      sx={{ fontWeight: "bold", color: "grey.600", fontSize: fs }}
                    >
                      Login:
                    </Typography>
                  }
                  value={user.login}
                  isSmallScreen={isSmallScreen}
                  fsMax="1.5rem"
                  fsMin="1rem" 
                  spacing={false}
                />
              </Box>

              <Typography variant="body1" sx={{ mb: 1, mt: 2, fontSize: fs2 }}>
                {user.bio || "No bio available"}
              </Typography>
            </Box>
          </Box>

          <Box className={styles.statsBox} my={2}>
            <TextInfo text="Followers" value={user.followers} isSmallScreen={isSmallScreen} fsMax="1rem" fsMin="0.8rem" />
            <TextInfo text="Following" value={user.following} isSmallScreen={isSmallScreen} fsMax="1rem" fsMin="0.8rem" />
          </Box>

          <Divider />

          <Box className={styles.buttonGroup}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "grey.900", fontSize: buttonFontSize }}
              startIcon={<FolderIcon sx={{ fontSize: buttonFontSize }} />}
              onClick={() => handleRepos(!repoListOpen, user.repos_url)}
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

          <Dialog
            fullScreen
            open={repoListOpen}
            onClose={() => handleRepos(false)}
            maxWidth="md"
            slots={{ transition: Transition }}
            slotProps={{
              paper: {
                className: styles.modalPaper,
              },
            }}
          >
            <AppBarComponent
              onFilterByLanguage={filterByLanguage}
              onFilterByRecentCommit={filterByRecentCommit}
              onFilterByDevelopmentTime={filterByDevelopmentTime}
              onClose={() => handleRepos(false)}
              availableLanguages={availableLanguages}
            />

            <Box className={styles.modalContent}>
              <RepoList
                repos={filteredRepos.length > 0 ? filteredRepos : repos}
                repOwner={user}
              />
            </Box>
          </Dialog>

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
              <UserAnalytics repos={repos} />
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

export default UserSearch;
