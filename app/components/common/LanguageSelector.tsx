'use client'

import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

interface LanguageSelectorProps {
    selectedLanguage: string;
    onLanguageChange: (language: string) => void;
    isDisabled?: boolean;
}

const LanguageSelector = ({ selectedLanguage, onLanguageChange, isDisabled }: LanguageSelectorProps) => {
  return (
    <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                label="Language"
                disabled={isDisabled}
            >
                <MenuItem value="Russian">Russian</MenuItem>
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Ukrainian">Ukrainian</MenuItem>
                <MenuItem value="Japanese">Japanese</MenuItem>
                <MenuItem value="Chinese">Chinese</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                <MenuItem value="French">French</MenuItem>
                <MenuItem value="German">German</MenuItem>
                <MenuItem value="Shyriiwook, Wookie Language, from Star Wars">Wookie</MenuItem>
                <MenuItem value="Quenya, Elvish Language from The Lord of the Rings">Elvish</MenuItem>
                <MenuItem value="Dothraki, from Game of Thrones">Dothraki</MenuItem>
            </Select>
        </FormControl>
    </Box>
  )
}

export default LanguageSelector