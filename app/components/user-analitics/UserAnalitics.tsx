import React from "react";
import { Box, Typography } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PieComponent from "../common/PieComponent";
import { Repository, LanguagesObject } from "../../types/github";

ChartJS.register(ArcElement, Tooltip, Legend);

interface UserAnalyticsProps {
  repos: Repository[];
}

const UserAnalytics = ({ repos }: UserAnalyticsProps) => {
  // 1. Считаем статистику по языкам
  const languageStats: LanguagesObject = {};

  // Пробегаемся по всем репо и суммируем звёзды, форки и т.д.
  let totalStars = 0;
  let totalForks = 0;

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Overall Language Usage Statistics
      </Typography>
      <Box display="flex" alignItems="center" gap={2}>
        Total Repositories:
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {repos.length}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={2} my={2}>
        Total Stars:{" "}
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {totalStars}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={2}>
        Total Forks:{" "}
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {totalForks}
        </Typography>
      </Box>
      <Box width={470} height={400}>
        <PieComponent
          title={
            Object.keys(languageStats).length > 0
              ? "Languages"
              : "Charge repositories to see languages"
          }
          data={languageStats || null}
        />
      </Box>
    </Box>
  );
};

export default UserAnalytics;
