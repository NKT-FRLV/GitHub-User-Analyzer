import React from 'react';
import { Autocomplete, Chip, TextField, Box } from '@mui/material';
import { predefinedSkills } from '@/app/utils';

interface SkillsSelectorProps {
  selectedSkills: string[];
  onSkillsChange: (newSkills: string[]) => void;
  isSmallScreen?: boolean;
  isDisabled?: boolean;
}

const SkillsSelector = ({ selectedSkills, onSkillsChange, isSmallScreen, isDisabled }: SkillsSelectorProps) => {
  return (
    <Box display='flex' justifyContent='flex-end' sx={{ width: '100%', mt: 2, }}>
      <Autocomplete
        multiple
        options={predefinedSkills}
        value={selectedSkills}
        onChange={(_, newValue) => onSkillsChange(newValue)}
        disabled={isDisabled}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Select skills for search"
            placeholder="Add skill"
            sx={{ 
              width: '100%',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option}
              label={option}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
            />
          ))
        }
        sx={{
          width: isSmallScreen ? '100%' : '500px',
          '& .MuiAutocomplete-tag': {
            margin: '2px'
          }
        }}
        freeSolo
        filterSelectedOptions
      />
    </Box>
  );
};

export default SkillsSelector; 