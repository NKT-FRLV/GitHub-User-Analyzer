import { Box } from '@mui/material'
import { Typography } from '@mui/material'
import React from 'react'

interface Props {
  text: string | React.ReactNode;
  value: string | number;
  isSmallScreen: boolean;
  fsMax?: string;
  fsMin?: string;
  propsBox?: object;
  propsTypography?: object;
  spacing?: boolean;
}

const TextInfo = ({ text, value, isSmallScreen, propsBox, propsTypography, fsMax, fsMin, spacing = true }: Props) => {
  return (
    <Box display={"flex"} alignItems={"center"} gap={1} {...propsBox}>
      {text}{spacing ? ": " : ""}
      <Typography sx={{ 
        fontWeight: "bold", 
        fontSize: isSmallScreen ? fsMin : fsMax, 
        ...propsTypography 
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

export default TextInfo