import { Box, MenuItem, InputLabel, Select, FormControl } from '@mui/material';
import React from 'react'

interface FileSelectorProps {
    selectedFile: string;
    onFileChange: (file: string) => void;
    isDisabled?: boolean;
}

const FileSelector = ({ selectedFile, onFileChange, isDisabled }: FileSelectorProps) => {
  return (
    <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
            <InputLabel>File</InputLabel>
            <Select
                value={selectedFile}
                onChange={(e) => onFileChange(e.target.value)}
                label="File"
                disabled={isDisabled}
            >
                <MenuItem value="README.md">README.md</MenuItem>
                <MenuItem value="Code">Code File</MenuItem>
            </Select>
        </FormControl>
    </Box>
  )
}

export default FileSelector