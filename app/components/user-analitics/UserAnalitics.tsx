"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PieComponent from "../common/PieComponent";
import TextInfo from "../common/TextInfo";
import AnalyticsSkeleton from "./Skeleton";
import { Repository, LanguagesObject } from "../../types/github";
import { fetchReposApi } from "@/app/api/API";

ChartJS.register(ArcElement, Tooltip, Legend);

interface UserAnalyticsProps {
  reposUrl: string;
}

const UserAnalytics = ({ reposUrl }: UserAnalyticsProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const pieWidth = isSmallScreen ? 100 : 250;
  const pieHeight = isSmallScreen ? 100 : 250;
  const [repos, setRepos] = useState<Repository[] | null>(null);
  const [loading, setLoading] = useState(true);
  


  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      const repos = await fetchReposApi(reposUrl);
      setRepos(repos);
      setLoading(false);
    };
    fetchRepos();
  }, [reposUrl]);

  // 1. Считаем статистику по языкам
  const languageStats: LanguagesObject = {};


  // Пробегаемся по всем репо и суммируем звёзды, форки и т.д.
  let totalStars = 0;
  let totalForks = 0;

  if (repos) {
    repos.forEach((repo) => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;

    // Если хотим получить более точные данные по каждому repo.languages_url,
    // надо сделать дополнительный запрос (fetch).
    // Но для примера возьмём, что у нас уже есть repo.language
    const lang = repo.language || null;
    if (!lang || lang === "null") {
      return;
    }
    if (!languageStats[lang]) {
      languageStats[lang] = 0;
    }

      languageStats[lang]++;
    });
  }

    if (loading) {
      return <AnalyticsSkeleton isSmallScreen={isSmallScreen} pieWidth={pieWidth} pieHeight={pieHeight} />;
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: isSmallScreen ? 250 : 500}}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", fontSize: isSmallScreen ? "1rem" : "1.2rem" }}>
          Overall Language Usage Statistics
        </Typography>
        <TextInfo text="Total Repositories" value={repos?.length || 0} isSmallScreen={isSmallScreen} />
        <TextInfo text="Total Stars" value={totalStars} isSmallScreen={isSmallScreen} />
        <TextInfo text="Total Forks" value={totalForks} isSmallScreen={isSmallScreen} />
        <Box>
          <PieComponent
            title={
              Object.keys(languageStats).length > 0
                ? "Languages"
                : "Charge repositories to see languages"
            }
            data={languageStats || null}
            responsiveWidth={pieWidth}
            responsiveHeight={pieHeight}
          />
        </Box>
      </Box>
    );
};

export default UserAnalytics;
