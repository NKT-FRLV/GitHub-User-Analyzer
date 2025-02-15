"use client";

import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./searchBar.module.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

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
    <Box className={styles.searchContainer} component="form">
      <TextField
        fullWidth
        label="Enter GitHub username"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        variant="outlined"
        size="small"
        className={styles.searchField}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        startIcon={<SearchIcon />}
        className={styles.searchButton}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
