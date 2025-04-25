import { useState, useEffect, FC, useCallback } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Repository } from "../../../types/github";
import { formatDistanceStrict } from "date-fns";
import RepoButton from "./RepoButton";
import CommitInfo from "./Commit-info";
import TextInfo from "../../../components/common/TextInfo";
import { useRepoStore } from "../../../store/repos/store";
// import { shallow } from 'zustand/shallow';

interface RepoItemProps {
  repo: Repository;
  isSmallScreen: boolean;
}

const RepoItem: FC<RepoItemProps> = ({
  repo,
  isSmallScreen,
}) => {
  
  console.log("Rendered", repo.name);
  
  const expanded = useRepoStore(state => state.expandedRepoId === repo.id);

  const setExpandedRepoId = useRepoStore(state => state.setExpandedRepoId);


  const getDevelopmentTime = () => {
    const createdAt = new Date(repo.created_at);
    const lastPush = new Date(repo.pushed_at);
    return formatDistanceStrict(createdAt, lastPush);
  };

  

  const handleAccordionChange = useCallback((_, isExpanded: boolean) => {
    setExpandedRepoId(isExpanded ? repo.id : null);
  }, [repo.id, setExpandedRepoId]);

  

  return (
    <Accordion
      component='li'
      sx={{ listStyle: 'none' }}
      expanded={expanded}
      slotProps={{ transition: { unmountOnExit: true } }}
      onChange={handleAccordionChange}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
          component="h2"
        >
          {repo.name}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Box display="flex" flexDirection="column" gap={1}>
          {repo.description && (
            <Typography
              variant="body2"
              my={1}
              sx={{ fontSize: isSmallScreen ? "0.8rem" : "0.9rem" }}
              component="h3"
              color="black"
            >
              {repo.description}
            </Typography>
          )}
          <Box
            display="flex"
            flexDirection={isSmallScreen ? "column" : "row"}
            sx={{ justifyContent: isSmallScreen ? "center" : "space-around" }}
            alignItems="center"
            gap={isSmallScreen ? 1 : 0}
          >
            <Link
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ fontSize: isSmallScreen ? "1rem" : "1.2rem" }}
            >
              Go to repo
            </Link>

            <TextInfo text="Stars" value={repo.stargazers_count} isSmallScreen={isSmallScreen} fsMax="1rem" fsMin="0.8rem" />
            <TextInfo text="Watchers" value={repo.watchers_count} isSmallScreen={isSmallScreen} fsMax="1rem" fsMin="0.8rem" />
            <TextInfo text="Open Issues" value={repo.open_issues_count} isSmallScreen={isSmallScreen} fsMax="1rem" fsMin="0.8rem" />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "center",
            }}
          >
            <TextInfo text="Created" value={new Date(repo.created_at).toLocaleDateString()} isSmallScreen={isSmallScreen} fsMax="1rem" fsMin="0.8rem" />
            <TextInfo text="Development time" value={getDevelopmentTime()} isSmallScreen={isSmallScreen} fsMax="1rem" fsMin="0.8rem" />
            <TextInfo text="Last activity" value={new Date(repo.pushed_at).toLocaleDateString()} isSmallScreen={isSmallScreen} fsMax="1rem" fsMin="0.8rem" />
            <CommitInfo repoUrl={repo.url} expanded={expanded} isSmallScreen={isSmallScreen} />
          </Box>

          <RepoButton repo={repo} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default RepoItem;
