'use client'
import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import { Dialog, Box, Slide } from '@mui/material';
import styles from '../userCard.module.css';
import AppBarComponent from '../../common/AppBarComponent';
import RepoList from '../../repoList/RepoList';
import { TransitionProps } from '@mui/material/transitions';
import { Repository, GitHubUser } from '../../../types/github';


interface RepoListPageProps {
    repos: Repository[];
    user: GitHubUser;
}

// const Transition = React.forwardRef(function Transition(
//     props: TransitionProps & {
//       children: React.ReactElement<unknown>;
//     },
//     ref: React.Ref<unknown>,
//   ) {
//     return <Slide direction="up" ref={ref} {...props} />;
//   });

const RepoListPage = ({ repos, user }: RepoListPageProps) => {

    const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
    const [selectedPage, setSelectedPage] = useState<'ai' | 'list'>('list');

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
        <Box className={styles.reposPageContainer} >

            <AppBarComponent
                onFilterByLanguage={filterByLanguage}
                onFilterByRecentCommit={filterByRecentCommit}
                onFilterByDevelopmentTime={filterByDevelopmentTime}
                onClose={() => router.push('/')}
                availableLanguages={availableLanguages}
                setPage={setSelectedPage}
                page={selectedPage}
            />

            <Box className={styles.modalContent}>
                <RepoList
                    repos={filteredRepos.length > 0 ? filteredRepos : repos}
                    repOwner={user}
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                />
            </Box>

        </Box>
  )
}

export default RepoListPage