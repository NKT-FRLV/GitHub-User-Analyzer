import PieComponent from "@/app/components/common/PieComponent";
import { useState } from "react";
import { Repository } from "@/app/types/github";
import { useRepoStore } from "@/app/store/repos/store";
import { Box, Button, useMediaQuery } from "@mui/material";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";

interface DiagramProps {
	selectedRepo: Repository;
}

const Diagram = ({ selectedRepo }: DiagramProps) => {
	console.log("Diagram rendered");
	const [open, setOpen] = useState(false);
	const languages = useRepoStore((state) => state.languages);
	const isSmallScreen = useMediaQuery("(max-width: 950px)");
	const pieWidth = isSmallScreen ? 135 : 220;
	const pieHeight = isSmallScreen ? 135 : 220;

	return (
		<>
			<Box sx={{ width: "100%", display: "flex", justifyContent: "center", padding: 1, backgroundColor: "grey.100", borderRadius: 2, boxShadow: 4, overflow: "hidden" }}>
				<Button
					variant="text"
					onClick={() => setOpen((prev) => !prev)}
					startIcon={<TroubleshootIcon />}
					sx={{
						width: "100%",
						color: "grey.800",
						alignSelf: "flex-start",
						backgroundColor: "grey.200",
						borderRadius: 2,
						border: "1px solid grey.200",
						padding: 2,
						boxShadow: 4,
						zIndex: 102,
					}}
				>
					{open ? "Hide Diagram" : "Show Diagram"}
				</Button>
			</Box>
			{open && (
				<PieComponent
					title={
						selectedRepo
							? `Repo Languages ${selectedRepo.name}:`
							: "Select a repo to see languages"
					}
					data={languages}
					infoInBytes={true}
					responsiveWidth={pieWidth}
					responsiveHeight={pieHeight}
				/>
			)}
		</>
	);
};

export default Diagram;
