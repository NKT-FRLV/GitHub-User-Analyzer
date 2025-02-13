"use client";

import React, { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Dialog,
  IconButton,
  Backdrop,
  CircularProgress,
  Button,
  Divider,
  Slide,
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
// import clsx from 'clsx';
import styles from "./userSearch.module.css";
import { UserSearchProps, Repository } from "../../types/github";

import RepoList from "../repoList/RepoList";
import UserAnalytics from "../user-analitics/UserAnalitics";
import AppBarComponent from "../common/AppBarComponent";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserSearch = ({ user, error }: UserSearchProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [openModal, setOpenModal] = React.useState(false);
  const [analiticsOpen, setAnaliticsOpen] = React.useState(false);
  const [repoListOpen, setRepoListOpen] = React.useState(false);
  const [repos, setRepos] = React.useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = React.useState<Repository[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

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
      console.log(data);
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
  console.log("user, --> ", user);
  return (
    <>
      <Paper elevation={3} className={styles.container}>
        <Box className={styles.userInfo}>
          <Box className={styles.header}>
            <div
              className={styles.avatarContainer}
              onClick={() => setOpenModal(true)}
            >
              <Image
                src={user.avatar_url}
                alt={user.login}
                width={150}
                height={150}
                className={styles.avatar}
              />
            </div>
            <Box className={styles.userDetails}>
              <Box
                display="flex"
                flexDirection="row"
                gap={1}
                alignItems="baseline"
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, fontWeight: "bold", color: "grey.600", fontSize: isSmallScreen ? "0.9rem" : "1.2rem" }}
                >
                  Name:
                </Typography>

                <Typography variant="h5" sx={{ mt: 1, fontSize: isSmallScreen ? "1rem" : "1.5rem", fontWeight: "bold" }}>
                  {user.name}
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                gap={1}
                alignItems="baseline"
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, fontWeight: "bold", color: "grey.600", fontSize: isSmallScreen ? "0.9rem" : "1.2rem" }}
                >
                  Login:
                </Typography>

                <Typography variant="h5" sx={{ mt: 1, fontSize: isSmallScreen ? "0.9rem" : "1.5rem", fontWeight: "bold" }}>
                  {user.login}
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ mb: 1, mt: 2, fontSize: isSmallScreen ? "0.8rem" : "1rem" }}>
                {user.bio || "No bio available"}
              </Typography>
            </Box>
          </Box>

          <Box className={styles.statsBox}>
            <Typography variant="body2" sx={{ mb: 1, fontSize: isSmallScreen ? "0.8rem" : "1rem" }}>
              Followers: {user.followers}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontSize: isSmallScreen ? "0.8rem" : "1rem" }}>
              Following: {user.following}
            </Typography>
          </Box>

          <Divider />

          <Box className={styles.buttonGroup}>
            <Button
              variant="outlined"
              onClick={() => handleRepos(!repoListOpen, user.repos_url)}
              style={{ cursor: "pointer" }}
            >
              Repos: {user.public_repos}
            </Button>
            <Button
              variant="outlined"
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
        </Box>
      </Paper>

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
