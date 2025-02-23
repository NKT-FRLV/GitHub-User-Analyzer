import React from 'react'
import { Box, Typography, Skeleton } from '@mui/material'

interface SkeletonComponentProps {
  isSmallScreen: boolean
  pieWidth: number
  pieHeight: number
}

const SkeletonComponent = ({ isSmallScreen, pieWidth, pieHeight }: SkeletonComponentProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: isSmallScreen ? 250 : 500}}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", fontSize: isSmallScreen ? "1rem" : "1.2rem" }}>
        Overall Language Usage Statistics
      </Typography>
      <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
      <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: "bold", fontSize: isSmallScreen ? "1rem" : "1.2rem" }}>
        Languages
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "50%" }}>
          <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "50%" }}>
          <Skeleton variant="circular" width={pieWidth} height={pieHeight} />
        </Box>
      </Box>
      
    </Box>

  );
}

export default SkeletonComponent;