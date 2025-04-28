'use client'
import { Box, Typography, Skeleton } from "@mui/material";
import { useMediaQuery } from '@mui/material';
import { GitHubUser } from "../../../types/github";
import RepoItem from "../repo-item/ItemRepo";
import { useRepoStore } from "../../../store/repos/store";

interface RepoListProps {
  repOwner: string;
}

const RepoList: React.FC<RepoListProps> = ({ repOwner }) => {
  const isSmallScreen = useMediaQuery('(max-width: 950px)');
  const repos = useRepoStore(state => state.repos)
  const filteredRepos = useRepoStore(state => state.filteredRepos)
  const loading = useRepoStore(state => state.loading)

  console.log("RepoList rendered")
  
  const reposToShow = filteredRepos.length > 0 ? filteredRepos : repos;

  // Показываем скелетон при загрузке
  if (loading) {
    return (
      <Box display='flex' sx={{ flexDirection: 'column', width: isSmallScreen ? '100%' : '50%'}}>
        <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", fontSize: isSmallScreen ? "1rem" : "1.2rem" }}>
          Loading Repositories...
        </Typography>
        {[1, 2, 3, 4, 5].map((item) => (
          <Box key={item} sx={{ mb: 2 }}>
            <Skeleton variant="rectangular" sx={{ borderRadius: 1 }} height={60} />
          </Box>
        ))}
      </Box>
    );
  }

  // Показываем сообщение, если нет репозиториев
  if (reposToShow.length === 0) {
    return <Typography variant="body2">No repositories available.</Typography>;
  }

  // Показываем список репозиториев
  return (
    <Box display='flex' sx={{ flexDirection: 'column', width: isSmallScreen ? '100%' : '50%'}}>
      <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", fontSize: isSmallScreen ? "1rem" : "1.2rem" }}>
        Repositories of {repOwner}:
      </Typography>
      <Box mt={1} component="ul">
        {reposToShow.map((repo) => (
          <RepoItem
            key={repo.id}
            repo={repo}
            isSmallScreen={isSmallScreen}
          />
        ))}
      </Box>
    </Box>
  );
};

export default RepoList;
