
import { useRepoStore } from '../../../store/repos/store';
import { Button, CircularProgress, Typography, useMediaQuery } from '@mui/material'
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { Repository } from '../../../types/github';
import { fetchLanguagesApi } from '@/app/api/API';

interface RepoButtonProps {
    repo: Repository;
}

const RepoButton = ({ repo }: RepoButtonProps) => {
    
    const selectedPage = useRepoStore(state => state.selectedPage);
    const selectedRepo = useRepoStore(state => state.selectedRepo);
    const loadingLangs = useRepoStore(state => state.loadingLangs);
    const error = useRepoStore(state => state.error);

    const setLoadingLangs = useRepoStore(state => state.setLoadingLangs);
    const setError = useRepoStore(state => state.setError);
    const setSelectedRepo = useRepoStore(state => state.setSelectedRepo);
    const setLanguages = useRepoStore(state => state.setLanguages);
    const setSelectedPage = useRepoStore(state => state.setSelectedPage);

    const isSmallScreen = useMediaQuery('(max-width: 950px)');

    const handleAnalyzeClick = async () => {
        if (selectedRepo && selectedRepo.id === repo.id) {
          return;
        }
        setLoadingLangs(true);
        setError(null);
        const data = await fetchLanguagesApi(repo.languages_url);
        if (!data) {
          setError("Cannot fetch languages");
          setSelectedRepo(null);
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


  return (
    <>
        <Button
            variant="contained"
            endIcon={<ShowChartIcon sx={{ fontSize: isSmallScreen ? "1rem" : "1.2rem" }} />}
            onClick={handleAnalyzeClick}
            sx={{
              backgroundColor: selectedRepo?.id === repo.id ? "success.main" : "black",
              color: "white",
              fontSize: isSmallScreen ? "0.8rem" : "1rem",
            }}
          >
            {loadingLangs ? <CircularProgress size={24} /> : "Analyze this repo"}
          </Button>
          {error && <Typography color="error">{error}</Typography>}
    </>
  )
}

export default RepoButton