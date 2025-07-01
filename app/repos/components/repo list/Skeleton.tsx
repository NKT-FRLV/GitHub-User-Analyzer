import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";

const SkeletonList = ({ isSmallScreen }: { isSmallScreen: boolean }) => {
	return (
		<Box
			display="flex"
			sx={{
				flexDirection: "column",
				width: "100%",
				border: "1px solid #e0e0e0",
				borderRadius: 2,
				padding: 1,
				boxShadow: 24,
				overflow: "hidden",
			}}
		>
			<Typography
				variant="h6"
				sx={{
					mt: 2,
					mb: 1,
					fontWeight: "bold",
					fontSize: isSmallScreen ? "1rem" : "1.2rem",
					textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
				}}
			>
				Loading Repositories...
			</Typography>
			<Box
				mt={1}
				component="ul"
				sx={{
					mt: 1,
					mb: 1,
					borderRadius: 1,
					overflow: "hidden",
				}}
			>
				{[1, 2, 3, 4, 5].map((item, index) => (
					<Box key={item} sx={{ mb: index === 4 ? 0 : 1 }}>
						<Skeleton
							variant="rectangular"
							animation="wave"
							height={60}
						/>
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default SkeletonList;
