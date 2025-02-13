import { useState, useEffect, FC, useCallback } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Link,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { Repository } from "../../../types/github";
import { formatDistanceStrict } from "date-fns";
import TextInfo from "./TextInfo";
interface RepoItemProps {
  loadingLangs: boolean;
  error: string | null;
  repo: Repository;
  expanded: boolean;
  selectedRepo: Repository | null;
  isSmallScreen: boolean;
  onChange: (isExpanded: boolean) => void;
  fetchLanguages: (url: string, repo: Repository) => void;
}

const RepoItem: FC<RepoItemProps> = ({
  loadingLangs,
  error,
  repo,
  expanded,
  selectedRepo,
  isSmallScreen,
  onChange,
  fetchLanguages,
}) => {
  const [commitCount, setCommitCount] = useState<number | null>(null);

  const getDevelopmentTime = () => {
    const createdAt = new Date(repo.created_at);
    const lastPush = new Date(repo.pushed_at);

    return formatDistanceStrict(createdAt, lastPush);
  };

  const fetchCommitCount = useCallback(async () => {
    try {
      const response = await fetch(`${repo.url}/commits?per_page=1`);
      const link = response.headers.get("link");
      if (link) {
        const match = link.match(/page=(\d+)>; rel="last"/);
        if (match) {
          setCommitCount(parseInt(match[1]));
        }
      }
    } catch (error) {
      console.error("Error fetching commit count:", error);
    }
  }, [repo.url]);

  useEffect(() => {
    if (expanded && !commitCount) {
      fetchCommitCount();
    }
  }, [expanded, fetchCommitCount, commitCount]);

  // Здесь рендерим аккордеон
  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => {
        onChange(isExpanded);
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {/* Основная информация о репе */}
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
          {/* Описание репозитория, если есть */}
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

          {/* Дополнительная статистика: звёзды, форки, watchers и т.п. */}
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

            <TextInfo text="Stars" value={repo.stargazers_count} isSmallScreen={isSmallScreen} />
            <TextInfo text="Watchers" value={repo.watchers_count} isSmallScreen={isSmallScreen} />
            <TextInfo text="Open Issues" value={repo.open_issues_count} isSmallScreen={isSmallScreen} />
          </Box>

          {/* Информация о времени разработки */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "center",
            }}
          >
            <TextInfo text="Created" value={new Date(repo.created_at).toLocaleDateString()} isSmallScreen={isSmallScreen} />
            <TextInfo text="Development time" value={getDevelopmentTime()} isSmallScreen={isSmallScreen} />
            <TextInfo text="Last activity" value={new Date(repo.pushed_at).toLocaleDateString()} isSmallScreen={isSmallScreen} />
            <TextInfo text="Total commits:" value={commitCount || "Loading..."} isSmallScreen={isSmallScreen} />
          </Box>

          <Button
            loading={loadingLangs}
            variant="contained"
            loadingPosition="end"
            endIcon={<ShowChartIcon sx={{ fontSize: isSmallScreen ? "1rem" : "1.2rem" }} />}
            onClick={() => fetchLanguages(repo.languages_url, repo)}
            sx={{
              backgroundColor:
                selectedRepo?.id === repo.id ? "success.main" : "black",
              color: "white",
              fontSize: isSmallScreen ? "0.8rem" : "1rem",
            }}
          >
            Show Analysis
          </Button>
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default RepoItem;
