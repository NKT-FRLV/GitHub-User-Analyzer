'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import { Dialog, Box, Slide } from '@mui/material';
import styles from '../userCard.module.css';
import AppBarComponent from '../../common/AppBarComponent';
import RepoList from '../../repoList/RepoList';
import { TransitionProps } from '@mui/material/transitions';
import { Repository, GitHubUser } from '../../../types/github';
// import { fetchReposApi } from '@/app/api/API';

interface RepoListModalProps {
    // repoListOpen: boolean;
    // handleRepos: (open: boolean) => void;
    repos: Repository[];
    user: GitHubUser;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const RepoListModal = ({ repos, user }: RepoListModalProps) => {
    const [open, setOpen] = useState(false);
    const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);

    useEffect(() => {
        setOpen(true);
    }, []);

    const router = useRouter();


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
    
      const filterByDevelopmentTime = ( ) => {
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
  

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={() => {}}
            onTransitionExited={() => {
              router.back();
            }}
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
                onClose={() => setOpen(false)}
                availableLanguages={availableLanguages}
            />

            <Box className={styles.modalContent}>
                <RepoList
                    repos={filteredRepos.length > 0 ? filteredRepos : repos}
                    repOwner={user}
                />
            </Box>
          </Dialog>
  )
}

export default RepoListModal