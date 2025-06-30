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
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useRepoStore } from "../../store/repos/store";

interface AppBarComponentProps {
  containerRef?: React.RefObject<HTMLElement>;
}

const AppBarComponent: React.FC<AppBarComponentProps> = ({ containerRef }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  
  const isSmallScreen = useMediaQuery('(max-width: 950px)');

  const router = useRouter();

  console.log('AppBarComponent rendered');

  const repos = useRepoStore((state) => state.repos);
 
  const githubUsername = useRepoStore((state) => state.githubUsername);
  const selectedLanguage = useRepoStore((state) => state.selectedLanguage);
  const selectedPage = useRepoStore((state) => state.selectedPage);
  const panelWidths = useRepoStore((state) => state.panelWidths);
  const setPanelWidths = useRepoStore((state) => state.setPanelWidths);
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

  // ResizeHandle logic
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!containerRef?.current) return;
    
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const relativeX = e.clientX - containerRect.left;
      
      // Ограничиваем ширину панелей (минимум 20%, максимум 80%)
      const leftPercentage = Math.max(20, Math.min(80, (relativeX / containerWidth) * 100));
      const rightPercentage = 100 - leftPercentage;

      setPanelWidths(leftPercentage, rightPercentage);
    };

    const handleMouseUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
    <Box sx={{ position: 'relative' }}>
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
      
      {/* Resize Handle - показываем только на десктопе когда есть containerRef */}
      {!isSmallScreen && containerRef && (
        <Tooltip 
          title={`Drag to resize • Repos: ${Math.round(panelWidths.repoList)}% | AI: ${Math.round(panelWidths.aiAnalyzer)}%`} 
          arrow
          placement="bottom"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: `${panelWidths.repoList}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 1100,
            }}
          >
            <IconButton
              onMouseDown={handleResizeMouseDown}
              size="small"
              sx={{
                width: 40,
                height: 40,
                backgroundColor: 'background.paper',
                border: '2px solid',
                borderColor: 'divider',
                boxShadow: 2,
                cursor: 'col-resize',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'grey.100',
                  borderColor: 'grey.400',
                  boxShadow: 4,
                },
                '&:active': {
                  backgroundColor: 'grey.200',
                }
              }}
            >
              <DragIndicatorIcon 
                sx={{ 
                  fontSize: 20,
                  transform: 'rotate(90deg)',
                  color: 'grey.600',
                }} 
              />
            </IconButton>
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

export default AppBarComponent;
