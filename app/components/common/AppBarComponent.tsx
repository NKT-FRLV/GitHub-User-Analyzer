import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
interface AppBarComponentProps {
  onFilterByLanguage: (language: string) => void;
  onFilterByRecentCommit: () => void;
  onFilterByDevelopmentTime: () => void;
  onClose: () => void;
  availableLanguages: string[];
}

const AppBarComponent: React.FC<AppBarComponentProps> = ({
  onFilterByLanguage,
  onFilterByRecentCommit,
  onFilterByDevelopmentTime,
  onClose,
  availableLanguages,
}) => {
  const [selectedLanguage, setSelectedLanguage] = React.useState("All Langs");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const language = event.target.value as string;
    setSelectedLanguage(language);
    onFilterByLanguage(language);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      sx={{
        position: "relative",
        backgroundColor: "grey.200",
        color: "grey.800",
        paddingInline: 2,
      }}
    >
      <Toolbar
        sx={{
          flexWrap: { xs: "wrap", sm: "nowrap" },
          padding: { xs: 1, sm: 2 },
          gap: { xs: 1, sm: 2, md: 0 },
        }}

      >
        <Typography sx={{ ml: 2, flex: 1, minWidth: '80px' }} variant="h6" component="div">
          Tool Bar
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            width: "100%",
            justifyContent: { xs: "center", sm: "flex-end" },
          }}
        >
          <FormControl variant="outlined" sx={{ minWidth: 120 }} size="small">
            <InputLabel>Language</InputLabel>
            <Select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              label="Language"
            >
              {availableLanguages.map((language) => (
                <MenuItem key={language} value={language}>
                  {language}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            aria-label="filter options"
            sx={{ backgroundColor: "grey.800", color: "grey.200" }}
            onClick={handleMenuOpen}
          >
            Filter Options
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                onFilterByRecentCommit();
                handleMenuClose();
              }}
            >
              By Recent Commit
            </MenuItem>
            <MenuItem
              onClick={() => {
                onFilterByDevelopmentTime();
                handleMenuClose();
              }}
            >
              By Development Time
            </MenuItem>
          </Menu>
          <Button
            autoFocus
            aria-label="close"
            variant="contained"
            sx={{ backgroundColor: "grey.900", color: "grey.200" }}
            onClick={onClose}
          >
            <CloseIcon sx={{ color: "grey.200" }} />
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
