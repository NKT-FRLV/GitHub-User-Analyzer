'use client'
import { useEffect, useMemo } from 'react'
import { useRouter } from "next/navigation";
import { Box } from '@mui/material';
import styles from './outer.module.css';
import AppBarComponent from '../../../components/common/AppBarComponent';
import { withCondition } from '../../../lib/hoc';
import RepoList from '../repo list/RepoList';
import AIAnalyzer from '../AI-feedback/AI-Analyzer';
import { Repository, GitHubUser } from '../../../types/github';
import { useRepoStore } from '../../../store/repos/store';
import { useCandidateStore } from '../../../store/canditade/store';

// HOCs
const WithConditionRepoList = withCondition('list', RepoList);
const WithConditionAIAnalyzer = withCondition('ai', AIAnalyzer);

interface RepoListPageProps {
    // repos: Repository[];
    // user: GitHubUser;
    url: string;
}

const RepoListPage = ({ url }: RepoListPageProps) => {

  const repos = useRepoStore((state) => state.repos)
  const fetchRepos = useRepoStore((state) => state.fetchRepos)
  
  const ownerLogin = repos.length > 0 ? repos[0].owner.login : 'No owner'


    console.log("RepoListPage rendered")

    // Set initial repos in store
    // TODO: GET REPOS FROM API AND SET IN STORE directly
    useEffect(() => {
      if (!repos.length) {
        fetchRepos(url)
      }
    }, [url, fetchRepos, repos])

    const availableLanguages = useMemo(() => {
      console.log("availableLanguages rendered")
      return [
        "All Langs",
        ...Array.from(
          new Set(
            repos
              .map((repo) => repo.language)
              .filter((lang): lang is string => typeof lang === "string")
          )
        ),
      ];
    }, [repos]);

    return (
        <Box className={styles.reposPageContainer} >
            <AppBarComponent
                availableLanguages={availableLanguages}
            />

            <Box className={styles.reposAndAnalyzerContainer} gap={4}>
              <WithConditionRepoList repOwner={ownerLogin} />
              <WithConditionAIAnalyzer repOwner={ownerLogin} />
            </Box>
        </Box>
    )
}

export default RepoListPage