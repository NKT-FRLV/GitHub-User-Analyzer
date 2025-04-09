"use client";

import { useState } from "react";
import { TextField, Button, Box, useMediaQuery, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./searchBar.module.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <Box 
      className={styles.searchContainer} 
      component="form"
      sx={{
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 2 },
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
      }}
    >
      <TextField
        fullWidth
        label="Enter GitHub username"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        variant="outlined"
        size={isMobile ? "small" : "medium"}
        className={styles.searchField}
        sx={{ flexGrow: 1 }}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        startIcon={<SearchIcon />}
        className={styles.searchButton}
        sx={{ 
          py: { xs: 1, sm: 1.5 },
          px: { xs: 2, sm: 3 },
          flexShrink: 0,
          width: { xs: '100%', sm: 'auto' }
        }}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
