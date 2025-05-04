"use client";

import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Paper,
  Tooltip,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Fade,
  Chip,
  Zoom,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CodeIcon from "@mui/icons-material/Code";
import PublicIcon from "@mui/icons-material/Public";
import StarIcon from "@mui/icons-material/Star";
import CasinoIcon from "@mui/icons-material/Casino";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSend = () => {
    if (!query.trim()) return;
    onSearch(query);
    // Keep the query to show what was searched
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleMockSearch = (preset: string) => {
    setQuery(preset);
    onSearch(preset);
  };

  const focusHandler = () => {
    setIsExpanded(true);
  };

  const blurHandler = () => {
    if (!query.trim()) {
      setIsExpanded(false);
    }
  };

  const presets = [
    { title: "TypeScript Devs", query: "language:TypeScript", icon: <CodeIcon fontSize="small" />, color: "#3178c6" },
    { title: "Spain Location", query: "location:Spain", icon: <PublicIcon fontSize="small" />, color: "#e91e63" },
    { title: "Popular Users", query: "followers:>1000", icon: <StarIcon fontSize="small" />, color: "#ff9800" },
    { title: "Random User", query: "user:random", icon: <CasinoIcon fontSize="small" />, color: "#4caf50" },
  ];

  return (
    <Paper
      component="form"
      elevation={isExpanded ? 8 : 4}
      sx={{
        p: isExpanded ? 2 : 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        borderRadius: 4,
        boxShadow: isExpanded 
          ? `0 8px 16px rgba(0,0,0,0.1)` 
          : `0 4px 10px rgba(0,0,0,0.05)`,
        bgcolor: "background.paper",
        width: isMobile ? 300 : (isExpanded ? 650 : 600),
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
    >
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1,
          borderBottom: isExpanded ? 1 : 0,
          borderColor: 'divider',
          pb: isExpanded ? 1 : 0
        }}
      >
        <SearchIcon color="action" sx={{ ml: 1 }} />
        <InputBase
          type="text"
          placeholder={isMobile ? "Search..." : "Type GitHub username..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={focusHandler}
          onBlur={blurHandler}
          multiline
          autoComplete="off"
          name="chat-search-off"
          maxRows={1}
          fullWidth
          aria-label="Search GitHub users"
          sx={{
            ml: 1,
            flex: 1,
            fontSize: "1rem",
          }}
        />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!query.trim()}
            aria-label="Search"
            sx={{ 
              ml: 1
            }}
          >
            { isLoading ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
      </Box>

      <Box 
        sx={{ 
          display: "flex", 
          flexWrap: "wrap",
          justifyContent: "flex-start",
          gap: isExpanded ? 1 : 0.5,
          height: 'auto',
          mt: isExpanded ? 0.5 : 0,
          ml: { xs: 0, md: 4 },
          transition: 'all 0.3s ease',
        }}
      >
        {/* Большие кнопочки с текстом */}
        {presets.map((preset) => (
          (!isMobile && isExpanded) ? (
            <Zoom
              in={isExpanded}
              key={`${preset.query}-big`}
              unmountOnExit
              timeout={300}
              style={{ transitionDelay: isExpanded ? '100ms' : '0ms' }}
            >
              <Chip
                icon={preset.icon}
                label={preset.title}
                onClick={() => handleMockSearch(preset.query)}
                variant="outlined"
                clickable
                sx={{ 
                  borderColor: preset.color,
                  "&:hover": {
                    backgroundColor: `${preset.color}20`,
                    transform: "translateY(-2px)",
                    transition: "all 0.2s",
                  }
                }}
              />
            </Zoom>
          ) : (
            //  Маленькие кнопочки
            <Zoom
              in={!isExpanded || isMobile}
              key={`${preset.query}-small`}
              unmountOnExit
              timeout={300}
              style={{ transitionDelay: '100ms' }}
            >
              <Tooltip title={preset.title}>
                <IconButton 
                  onClick={() => handleMockSearch(preset.query)}
                  aria-label={preset.title}
                  size="small"
                  sx={{ 
                    color: preset.color,
                    backgroundColor: 'transparent',
                    borderRadius: '50%',
                    padding: 1,
                    "&:hover": {
                      backgroundColor: `${preset.color}20`,
                      transform: "scale(1.1)",
                      transition: "all 0.2s",
                    }
                  }}
                >
                  {preset.icon}
                </IconButton>
              </Tooltip>
            </Zoom>
          )
        ))}
      </Box>
    </Paper>
  );
}

export default SearchBar;
