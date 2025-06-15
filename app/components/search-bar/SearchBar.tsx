"use client";
import {
	Box,
	IconButton,
	InputBase,
	Paper,
	useMediaQuery,
	useTheme,
	CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import PresetButton, { SEARCH_PRESETS } from "./PresetButton";
import { useSearchBar } from "./useSearchBar";
import { paperStyles, presetBoxStyles } from "./styles";

interface SearchBarProps {
	onSearch: (query: string) => void;
	isLoading?: boolean;
}

function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
	const {
		query,
		setQuery,
		isExpanded,
		handleSend,
		handleKeyDown,
		focusHandler,
		blurHandler,
	} = useSearchBar(onSearch);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const handleMockSearch = (preset: string) => {
		setQuery(preset);
		onSearch(preset);
	};

	return (
		<Paper
			component="form"
			elevation={isExpanded ? 8 : 4}
			sx={paperStyles(isExpanded, isMobile)}
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
					borderBottom: isExpanded && !isMobile ? 1 : 0,
					borderColor: "divider",
					pb: isExpanded && !isMobile ? 1 : 0,
				}}
			>
				<SearchIcon color="action" sx={{ ml: 1 }} />
				<InputBase
					type="text"
					placeholder={
						isMobile ? "Search..." : "Type GitHub username..."
					}
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
						ml: 1,
					}}
				>
					{isLoading ? <CircularProgress size={24} /> : <SendIcon />}
				</IconButton>
			</Box>

			<Box sx={presetBoxStyles(isExpanded, isMobile)}>
				{/* Preset buttons (small / big) */}
				{SEARCH_PRESETS.map((preset) => (
					<PresetButton
						key={preset.id}
						preset={preset}
						isExpanded={isExpanded}
						isMobile={isMobile}
						onSelect={handleMockSearch}
					/>
				))}
			</Box>
		</Paper>
	);
}

export default SearchBar;
