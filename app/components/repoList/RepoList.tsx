'use client'
import { useState, Dispatch, SetStateAction } from "react";
import { Box, Typography } from "@mui/material";
import { useMediaQuery, useTheme } from '@mui/material';
import { GitHubUser, Repository, LanguagesObject } from "../../types/github";
import { fetchLanguagesApi } from "../../api/API";
import RepoItem from "./repo-item/ItemRepo";
import PieComponent from "../common/PieComponent";
import AIFeedbackChat from "./AI-feedback/AIFeedbackChat";
import styles from "./repoList.module.css";

interface RepoListProps {
  repos: Repository[];
  repOwner: GitHubUser;
  selectedPage: 'ai' | 'list';
  setSelectedPage: Dispatch<SetStateAction<'ai' | 'list'>>;
}

const RepoList: React.FC<RepoListProps> = ({ repos, repOwner, selectedPage, setSelectedPage }) => {
  const [expandedRepo, setExpandedRepo] = useState<number | null>(null);
  const [languages, setLanguages] = useState<LanguagesObject | null>(null);
  const [loadingLangs, setLoadingLangs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);


  const isSmallScreen = useMediaQuery('(max-width: 950px)');
  const pieWidth = isSmallScreen ? 135 : 220;
  const pieHeight = isSmallScreen ? 135 : 220;

  // Функция для получения info о языках
  const fetchLanguages = async (url: string, repo: Repository) => {
    if (selectedRepo && selectedRepo.id === repo.id) {
      return;
    }
    setLoadingLangs(true);
    setError(null);
    const data = await fetchLanguagesApi(url);
    if (!data) {
      setError("Cannot fetch languages");
      setSelectedRepo((prev) => (prev ? prev : null));
      setLoadingLangs(false);
      return;
    } 
    setLanguages(data);
    setSelectedRepo(repo);
    setLoadingLangs(false);
    if (isSmallScreen && selectedPage === 'list') {
      setSelectedPage('ai');
    }
  };

  const handleChange = (repoId: number, isExpanded: boolean) => {
    setExpandedRepo(isExpanded ? repoId : null);
  };

  if (repos.length === 0) {
    return <Typography variant="body2">No repositories available.</Typography>;
  }

  return (
    <Box className={styles.repoList} gap={4}>
      
      {((isSmallScreen && selectedPage === 'list') || !isSmallScreen) && (
          <Box display='flex' sx={{ flexDirection: 'column', width: isSmallScreen ? '100%' : '50%'}}>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", fontSize: isSmallScreen ? "1rem" : "1.2rem" }}>
            Repositories of {repOwner.login}:
          </Typography>
          <Box mt={1} component="ul">
            {repos.map((repo) => (
              
              <RepoItem
                key={repo.id}
                repo={repo}
                selectedRepo={selectedRepo}
                expanded={expandedRepo === repo.id}
                isSmallScreen={isSmallScreen}
                onChange={(isExpanded) => handleChange(repo.id, isExpanded)}
                fetchLanguages={fetchLanguages}
                loadingLangs={loadingLangs}
                error={error}
              />
            ))}
          </Box>
        </Box>
      )}
      {((isSmallScreen && selectedPage === 'ai') || !isSmallScreen) && (
        <Box display='flex' sx={{ flexDirection: 'column', width: isSmallScreen ? '100%' : '50%'}}>
          <PieComponent
          title={
            selectedRepo
              ? `Repo Languages ${selectedRepo.name}:`
              : "Select a repo to see languages"
          }
          data={languages}
          infoInBytes={true}
          responsiveWidth={pieWidth}
          responsiveHeight={pieHeight}
        />
          <AIFeedbackChat owner={repOwner.login} repoName={selectedRepo?.name || null} isSmallScreen={isSmallScreen} />
        </Box>
      )}
    </Box>
  );
};

export default RepoList;
