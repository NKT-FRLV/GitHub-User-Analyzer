"use client";
import { Box, Typography } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import SkeletonList from "./Skeleton";
import Paginator from "../../../shared/Paginator/Paginator";
import RepoItem from "../repo-item/ItemRepo";
import { useRepoStore } from "../../../store/repos/store";
import usePagination from "../../../hooks/usePagination";
import { Repository } from "@/app/types/github";

interface RepoListProps {
	repOwner: string;
}

const RepoList: React.FC<RepoListProps> = ({ repOwner }) => {
	const isSmallScreen = useMediaQuery("(max-width: 950px)");
	const repos = useRepoStore((state) => state.repos);
	const filteredRepos = useRepoStore((state) => state.filteredRepos);
	const loading = useRepoStore((state) => state.loading);

	const reposToShow = filteredRepos.length > 0 ? filteredRepos : repos;

	const { currentPage, setCurrentPage, currentItems, totalPages } = usePagination<Repository>(reposToShow.length, 8, reposToShow);

	// Показываем скелетон при загрузке
	if (loading) {
		return <SkeletonList isSmallScreen={isSmallScreen} />;
	}

	// Показываем сообщение, если нет репозиториев
	if (reposToShow.length === 0) {
		return (
			<Typography variant="body2">No repositories available.</Typography>
		);
	}

	// Показываем список репозиториев
	return (
		<Box
			display="flex"
			sx={{
				flexDirection: "column",
				width: "100%",
				height: "fit-content",
				border: '1px solid #e0e0e0',
				borderRadius: 2,
				padding: 1,
				boxShadow: 24,
				overflow: "hidden",
				
			}}
		>
			<Typography
				variant="h6"
				sx={{
					mt: 2,
					mb: 1,
					fontWeight: "bold",
					fontSize: isSmallScreen ? "1rem" : "1.2rem",
					textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
				}}
			>
				Repositories of {repOwner}:
			</Typography>
			<Box mt={1} component="ul" sx={{
				
			}}>
				{currentItems.map((repo) => (
					<RepoItem
						key={repo.id}
						repo={repo}
						isSmallScreen={isSmallScreen}
					/>
				))}
			</Box>

			{/* Pagination to prevent excessive list*/}
			<Paginator totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
		</Box>
	);
};

export default RepoList;
