import { FC } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";
import { languageColors } from "../../utils";
import { LanguagesObject } from "@/app/types/github";

interface PieProps {
  title: string;
  data: LanguagesObject | null;
  infoInBytes?: boolean;
}

const defaultData = {
  ["Russian"]: 7,
  ["English"]: 12,
  ["Spanish"]: 1,
  ["Java Script"]: 10,
};

const PieComponent: FC<PieProps> = ({ title, data, infoInBytes = false }) => {
  const dataToDisplay =
    data && Object.keys(data).length > 0 ? data : defaultData;

  const prepareChartData = () => {
    if (!data || Object.keys(data).length === 0) {
      return [
        {
          id: 0,
          label: "No data yet",
          value: 100,
          color: "#CCCCCC",
        },
      ];
    }

    return Object.entries(data).map(([lang, info], index) => ({
      id: index,
      label: lang,
      value: info,
      color: languageColors[lang] || "#CCCCCC",
    }));
  };

  const pieData = prepareChartData();
  const total = pieData.reduce((acc, { value }) => acc + value, 0);

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: "bold" }}>
        {title}
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <Box
          sx={{
            minWidth: "200px",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {Object.entries(dataToDisplay).map(
            ([lang, info]) => (
              (
                <Box
                  key={lang}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: languageColors[lang] || "#CCCCCC",
                    }}
                  />
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {lang}:
                    </Typography>{" "}
                    {infoInBytes
                      ? `${(info / 1024).toFixed(1)}KB`
                      : `${info} projects`}
                  </Box>
                </Box>
              )
            ),
          )}
        </Box>

        {/* Диаграмма справа */}
        <Box width={300} height={300}>
          <PieChart
            width={300}
            height={300}
            slotProps={{ legend: { hidden: true } }}
            series={[
              {
                data: pieData,
                highlightScope: { faded: "global", highlighted: "item" },
                valueFormatter: (item) => {
                  const percentage = ((item.value / total) * 100).toFixed(1);
                  return `${percentage}%`;
                },
              },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PieComponent;
