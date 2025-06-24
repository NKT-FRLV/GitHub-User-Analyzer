import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";

const SkeletonList = ({ isSmallScreen }: { isSmallScreen: boolean }) => {
	return (
		<Box
			display="flex"
			sx={{
				flexDirection: "column",
				width: isSmallScreen ? "100%" : "50%",
			}}
		>
			<Typography
				variant="h6"
				sx={{
					mt: 2,
					fontWeight: "bold",
					fontSize: isSmallScreen ? "1rem" : "1.2rem",
				}}
			>
				Loading Repositories...
			</Typography>
			{[1, 2, 3, 4, 5].map((item) => (
				<Box key={item} sx={{ mb: 2 }}>
					<Skeleton
						variant="rectangular"
						animation="wave"
						sx={{ borderRadius: 1 }}
						height={60}
					/>
				</Box>
			))}
		</Box>
	);
};

export default SkeletonList;
