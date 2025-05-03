'use client'
import { useEffect, useMemo } from 'react'
import { useRouter } from "next/navigation";
import { Box } from '@mui/material';
import styles from './outer.module.css';
import AppBarComponent from '../../../components/common/AppBarComponent';
import { withCondition } from '../../../lib/hoc';
import RepoList from '../repo list/RepoList';
import AIAnalyzer from '../AI-feedback/AI-Analyzer';
import { useRepoStore } from '../../../store/repos/store';


// HOCs
const WithConditionRepoList = withCondition('list', RepoList);
const WithConditionAIAnalyzer = withCondition('ai', AIAnalyzer);

const usernameRegex = /users\/([^\/]+)\/repos/;

interface RepoListPageProps {
    // repos: Repository[];
    // user: GitHubUser;
    url: string;
}

const RepoListPage = ({ url }: RepoListPageProps) => {

  const repos = useRepoStore((state) => state.repos)
  const githubUsername = useRepoStore((state) => state.githubUsername)
  const fetchRepos = useRepoStore((state) => state.fetchRepos)
  const setGithubUsername = useRepoStore((state) => state.setGithubUsername)
  
  const ownerLogin = repos.length > 0 ? repos[0].owner.login : 'No owner'


    console.log("RepoListPage rendered")

    const usernameMatch = url.match(usernameRegex);
    const username = usernameMatch ? usernameMatch[1] : null;

    // Set initial or updated repos in store
    // Set githubUsername in store
    useEffect(() => {
      if (!repos.length || githubUsername !== username) {
        fetchRepos(url)
        setGithubUsername(url)
      }
    }, [url, fetchRepos, repos, githubUsername, setGithubUsername, username])

    

    return (
        <Box className={styles.reposPageContainer} >
            <AppBarComponent />

            <Box className={styles.reposAndAnalyzerContainer} gap={4}>
              <WithConditionRepoList repOwner={ownerLogin} />
              <WithConditionAIAnalyzer repOwner={ownerLogin} />
            </Box>
        </Box>
    )
}

export default RepoListPage