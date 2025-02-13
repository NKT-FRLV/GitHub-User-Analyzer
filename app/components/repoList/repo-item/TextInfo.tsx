import { Box } from '@mui/material'
import { Typography } from '@mui/material'
import React from 'react'

interface Props {
  text: string;
  value: string | number;
  isSmallScreen: boolean;
}

const TextInfo = ({ text, value, isSmallScreen }: Props) => {
  return (
    <Box display={"flex"} alignItems={"center"} gap={1}>
      {text}:{" "}
      <Typography sx={{ fontWeight: "bold", fontSize: isSmallScreen ? "0.8rem" : "1rem" }}>
        {value}
      </Typography>
    </Box>
  )
}

export default TextInfo