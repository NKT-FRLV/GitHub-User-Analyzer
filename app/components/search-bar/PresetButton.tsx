"use client";

import { Chip, IconButton, Tooltip, Zoom } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import PublicIcon from "@mui/icons-material/Public";
import StarIcon from "@mui/icons-material/Star";
import CasinoIcon from "@mui/icons-material/Casino";
import { chipStyles, iconButtonStyles } from "./styles";

export const SEARCH_PRESETS = [
	{
		title: "TypeScript Devs",
		id: "1",
		query: "nkt-frlv",
		icon: <CodeIcon fontSize="small" />,
		color: "#3178c6",
	},
	{
		title: "Spain Location",
		id: "2",
		query: "midudev",
		icon: <PublicIcon fontSize="small" />,
		color: "#e91e63",
	},
	{
		title: "Popular Users",
		id: "3",
		query: "t3dotgg",
		icon: <StarIcon fontSize="small" />,
		color: "#ff9800",
	},
	{
		title: "Random User",
		id: "4",
		query: "gertsdev",
		icon: <CasinoIcon fontSize="small" />,
		color: "#4caf50",
	},
];

interface PresetButtonProps {
	preset: (typeof SEARCH_PRESETS)[0];
	onSelect: (query: string) => void;
	isExpanded: boolean;
	isMobile: boolean;
}

const PresetButton = ({
	preset,
	onSelect,
	isExpanded,
	isMobile,
}: PresetButtonProps) => {
	const shouldShowChip = !isMobile && isExpanded;

	if (shouldShowChip) {
		return (
			<Zoom in={isExpanded} timeout={300} key={`${preset.id}-big`}>
				<Chip
					icon={preset.icon}
					label={preset.title}
					onClick={() => onSelect(preset.query)}
					variant="outlined"
					clickable
					sx={chipStyles(preset.color)}
				/>
			</Zoom>
		);
	}

	return (
		<Zoom in={!isExpanded || isMobile} timeout={300} key={`${preset.id}-small`}>
			<Tooltip title={preset.title}>
				<IconButton
					onClick={() => onSelect(preset.query)}
					aria-label={preset.title}
					size="small"
					sx={iconButtonStyles(preset.color)}
				>
					{preset.icon}
				</IconButton>
			</Tooltip>
		</Zoom>
	);
};

export default PresetButton;

// (
// 	<Zoom
// 		in={isExpanded}
// 		key={`${preset.id}-big`}
// 		unmountOnExit
// 		timeout={300}
// 		style={{
// 			transitionDelay: isExpanded ? "100ms" : "0ms",
// 		}}
// 	>
// 		<Chip
// 			icon={preset.icon}
// 			label={preset.title}
// 			onClick={() => handleMockSearch(preset.query)}
// 			variant="outlined"
// 			clickable
// 			sx={{
// 				borderColor: preset.color,
// 				"&:hover": {
// 					backgroundColor: `${preset.color}20`,
// 					transform: "translateY(-2px)",
// 					transition: "all 0.2s",
// 				},
// 			}}
// 		/>
// 	</Zoom>
// ) : (
// 	//  Маленькие кнопочки
// 	<Zoom
// 		in={!isExpanded || isMobile}
// 		key={`${preset.id}-small`}
// 		unmountOnExit
// 		timeout={300}
// 		style={{ transitionDelay: "100ms" }}
// 	>
// 		<Tooltip title={preset.title}>
// 			<IconButton
// 				onClick={() =>
// 					handleMockSearch(preset.query)
// 				}
// 				aria-label={preset.title}
// 				size="small"
// 				sx={{
// 					color: preset.color,
// 					backgroundColor: "transparent",
// 					borderRadius: "50%",
// 					padding: 1,
// 					"&:hover": {
// 						backgroundColor: `${preset.color}20`,
// 						transform: "scale(1.1)",
// 						transition: "all 0.2s",
// 					},
// 				}}
// 			>
// 				{preset.icon}
// 			</IconButton>
// 		</Tooltip>
// 	</Zoom>
// )
