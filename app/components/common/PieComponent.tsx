import { FC } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme, useMediaQuery } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { languageColors } from "../../utils";
import { LanguagesObject } from "@/app/types/github";

interface PieProps {
	responsiveWidth?: number;
	responsiveHeight?: number;
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

const PieComponent: FC<PieProps> = ({
	title,
	data,
	infoInBytes = false,
	responsiveWidth = 300,
	responsiveHeight = 300,
}) => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
		<Box
			sx={{
				position: "absolute",
				top: 80,
				left: 0,
				right: 0,
				backgroundColor: "white",
				border: "1px solid #e0e0e0",
				borderRadius: 2,
				padding: 2,
				boxShadow: 12,
				overflow: "hidden",
				zIndex: 100,
			}}
		>
			<Typography
				variant="h6"
				sx={{
					mt: 2,
					mb: 2,
					fontWeight: "bold",
					fontSize: isSmallScreen ? "1rem" : "1.2rem",
				}}
			>
				{title}
			</Typography>
			<Box
				sx={{
					width: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					marginTop: isSmallScreen ? 2 : 4,
					gap: 2,
				}}
			>
				<Box
					sx={{
						minWidth: isSmallScreen ? 150 : 200,
						display: "flex",
						flexDirection: "column",
						gap: 1,
					}}
				>
					{Object.entries(dataToDisplay).map(([lang, info]) => (
						<Box
							key={lang}
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
							}}
						>
							<Box
								sx={{
									width: 12,
									height: 12,
									borderRadius: "50%",
									backgroundColor:
										languageColors[lang] || "#CCCCCC",
								}}
							/>
							<Box
								display="flex"
								alignItems="center"
								gap={1}
								sx={{
									fontSize: isSmallScreen ? "0.8rem" : "1rem",
								}}
							>
								<Typography
									variant="body2"
									sx={{
										fontWeight: "bold",
										fontSize: "inherit",
									}}
								>
									{lang}:
								</Typography>{" "}
								{infoInBytes
									? `${(info / 1024).toFixed(1)}KB`
									: `${info} projects`}
							</Box>
						</Box>
					))}
				</Box>

				{/* Диаграмма справа */}
				<Box
					width="100%"
					display="flex"
					justifyContent="center"
					alignItems="center"
				>
					<PieChart
						width={responsiveWidth}
						height={responsiveHeight}
						margin={{ right: 0, left: 0, top: 0, bottom: 0 }}
						slotProps={{ legend: { hidden: true } }}
						series={[
							{
								data: pieData,
								highlightScope: {
									faded: "global",
									highlighted: "item",
								},
								valueFormatter: (item) => {
									const percentage = (
										(item.value / total) *
										100
									).toFixed(1);
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
