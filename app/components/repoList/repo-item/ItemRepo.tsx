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

interface RepoItemProps {
  loadingLangs: boolean;
  error: string | null;
  repo: Repository;
  expanded: boolean;
  selectedRepo: Repository | null;
  onChange: (isExpanded: boolean) => void;
  fetchLanguages: (url: string, repo: Repository) => void;
}

const RepoItem: FC<RepoItemProps> = ({
  loadingLangs,
  error,
  repo,
  expanded,
  selectedRepo,
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
          sx={{ fontWeight: "bold" }}
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
              sx={{ fontSize: "0.9rem" }}
              component="h3"
              color="black"
            >
              {repo.description}
            </Typography>
          )}

          {/* Дополнительная статистика: звёзды, форки, watchers и т.п. */}
          <Box
            display="flex"
            flexDirection="row"
            sx={{ justifyContent: "space-around" }}
            alignItems="center"
          >
            <Link
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to repo
            </Link>

            <Typography variant="body2">
              Stars: {repo.stargazers_count}
            </Typography>

            <Typography variant="body2">Forks: {repo.forks_count}</Typography>
            <Typography variant="body2">
              Watchers: {repo.watchers_count}
            </Typography>
            <Typography variant="body2">
              Open Issues: {repo.open_issues_count}
            </Typography>
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
            <Box display={"flex"} alignItems={"center"} gap={1}>
              Created:{" "}
              <Typography sx={{ fontWeight: "bold" }}>
                {new Date(repo.created_at).toLocaleDateString()}
              </Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"} gap={1}>
              Development time:{" "}
              <Typography sx={{ fontWeight: "bold" }}>
                {getDevelopmentTime()}
              </Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"} gap={1}>
              Last activity:{" "}
              <Typography sx={{ fontWeight: "bold" }}>
                {new Date(repo.pushed_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            Total commits:{" "}
            <Typography sx={{ fontWeight: "bold" }}>
              {commitCount || "Loading..."}
            </Typography>
          </Box>

          <Button
            loading={loadingLangs}
            variant="contained"
            loadingPosition="end"
            endIcon={<ShowChartIcon />}
            onClick={() => fetchLanguages(repo.languages_url, repo)}
            sx={{
              backgroundColor:
                selectedRepo?.id === repo.id ? "success.main" : "black",
              color: "white",
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
