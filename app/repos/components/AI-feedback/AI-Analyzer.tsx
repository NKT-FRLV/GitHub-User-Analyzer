import AIFeedbackChat from "./AIFeedbackChat";
import { Box, useMediaQuery } from "@mui/material";
import React from "react";
import { useRepoStore } from "@/app/store/repos/store";
import Diagram from "./diagram/Diagram";

interface AIAnalyzerProps {
	repOwner: string;
}

const AIAnalyzer = ({ repOwner }: AIAnalyzerProps) => {
	const isSmallScreen = useMediaQuery("(max-width: 950px)");
	console.log("AI Analyzer rendered");

	const selectedRepo = useRepoStore((state) => state.selectedRepo);

	return (
		<Box
			display="flex"
			sx={{
				flexDirection: "column",
				width: "100%",
				position: "relative",
			}}
		>
			<Diagram selectedRepo={selectedRepo} />
			<AIFeedbackChat
				owner={repOwner}
				repoName={selectedRepo?.name || null}
				isSmallScreen={isSmallScreen}
			/>
		</Box>
	);
};

export default AIAnalyzer;
