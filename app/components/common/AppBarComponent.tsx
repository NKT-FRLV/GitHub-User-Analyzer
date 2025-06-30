import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  useMediaQuery,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRepoStore } from "../../store/repos/store";



const AppBarComponent: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  
  const isSmallScreen = useMediaQuery('(max-width: 950px)');

  const router = useRouter();

  console.log('AppBarComponent rendered');

  const repos = useRepoStore((state) => state.repos);
 
  const githubUsername = useRepoStore((state) => state.githubUsername);
  const selectedLanguage = useRepoStore((state) => state.selectedLanguage);
  const selectedPage = useRepoStore((state) => state.selectedPage);
  const filterByLanguage = useRepoStore((state) => state.filterByLanguage);
  const sortByRecentCommit = useRepoStore((state) => state.sortByRecentCommit);
  const sortByDevelopmentTime = useRepoStore((state) => state.sortByDevelopmentTime);
  const setSelectedPage = useRepoStore((state) => state.setSelectedPage);

  const handleBackToMainPage = (githubUsername: string) => {
    router.push(`/?search=${githubUsername}`);
  }

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const language = event.target.value as string;
    filterByLanguage(language);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLElement>,
    newPage: 'ai' | 'list',
  ) => {
    if (newPage !== null) {
      setSelectedPage(newPage);
    }
  };

  const availableLanguages = useMemo(() => {
    return [
      "All Langs",
      ...Array.from(
        new Set(
          repos
            .map((repo) => repo.language)
            .filter((lang): lang is string => typeof lang === "string")
        )
      ),
    ];
  }, [repos]);

  return (
    <AppBar
      sx={{
        position: "sticky",
        top: 0,
        left: 10,
        zIndex: 1000,
        backgroundColor: "grey.200",
		boxShadow: 4,
		borderRadius: 2,
		border: '1px solid #e0e0e0',
        color: "grey.800",
        "&.MuiPaper-root": {
          paddingRight: "16px !important",
          paddingLeft: "16px !important",
        },
      }}
    >
      <Toolbar
        sx={{
          width: '100%',
          flexWrap: isSmallScreen ? 'wrap' : 'nowrap',
          padding: isSmallScreen ? 1 : 2,
          gap: isSmallScreen ? 1 : 2,
        }}
      >
        {!isSmallScreen && <Typography sx={{ ml: 2, flex: 1, minWidth: '80px' }} variant="h6" component="div">
          Tool Bar
        </Typography>}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            width: "100%",
            justifyContent: isSmallScreen ? 'center' : 'flex-end',
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
            Filter
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                sortByRecentCommit();
                handleMenuClose();
              }}
            >
              By Recent Commit
            </MenuItem>
            <MenuItem
              onClick={() => {
                sortByDevelopmentTime();
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
            size="small"
            sx={{ backgroundColor: "grey.900", color: "grey.200" }}
            onClick={() => handleBackToMainPage(githubUsername)}
          >
            <CloseIcon sx={{ color: "grey.200" }} />
          </Button>
        </Box>
        {isSmallScreen && (
          <ToggleButtonGroup
            size="small"
            sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
            color='secondary'
            value={selectedPage}
            exclusive
            onChange={handlePageChange}
            aria-label="page toggler"
          >
            <ToggleButton sx={{ flex: 1, fontWeight: 'bold' }} value="list">List</ToggleButton>
            <ToggleButton sx={{ flex: 1, fontWeight: 'bold' }}  value="ai">AI</ToggleButton>
          </ToggleButtonGroup>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
