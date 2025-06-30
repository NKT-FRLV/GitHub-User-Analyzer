"use client";
import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import styles from "./outer.module.css";
import AppBarComponent from "../../../components/common/AppBarComponent";
import { withResponsiveVisibility } from "../../../lib/hoc";
import RepoList from "../repo list/RepoList";
import AIAnalyzer from "../AI-feedback/AI-Analyzer";
import { useRepoStore } from "../../../store/repos/store";

// HOCs
const RepoListResponsive = withResponsiveVisibility(RepoList, {
	page: "list",
});
const AIAnalyzerResponsive = withResponsiveVisibility(AIAnalyzer, {
	page: "ai",
});

const usernameRegex = /users\/([^\/]+)\/repos/;

interface RepoListPageProps {
	// repos: Repository[];
	// user: GitHubUser;
	url: string;
}

const RepoListPage = ({ url }: RepoListPageProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const repos = useRepoStore((state) => state.repos);
	const githubUsername = useRepoStore((state) => state.githubUsername);
	const panelWidths = useRepoStore((state) => state.panelWidths);
	const fetchRepos = useRepoStore((state) => state.fetchRepos);
	const setGithubUsername = useRepoStore((state) => state.setGithubUsername);

	const ownerLogin = repos.length > 0 ? repos[0].owner.login : "No owner";

	console.log("RepoListPage rendered");

	const usernameMatch = url.match(usernameRegex);
	const username = usernameMatch ? usernameMatch[1] : null;

	// Set initial or updated repos in store
	// Set githubUsername in store
	useEffect(() => {
		if (!repos.length || githubUsername !== username) {
			fetchRepos(url);
			setGithubUsername(url);
		}
	}, [url, fetchRepos, repos, githubUsername, setGithubUsername, username]);

	return (
		<Box className={styles.reposPageContainer}>
			<AppBarComponent containerRef={containerRef} />

			<Box 
				ref={containerRef}
				className={styles.reposAndAnalyzerContainer} 
				sx={{
					'@media (min-width: 951px)': {
						gap: 2,
						// height: 'calc(100vh - 120px)',
					}
				}}
			>
				<Box 
					sx={{
						'@media (min-width: 951px)': {
							width: `${panelWidths.repoList}%`,
							// overflow: 'hidden',
						}
					}}
				>
					<RepoListResponsive repOwner={ownerLogin} />
				</Box>
				
				<Box 
					sx={{
						'@media (min-width: 951px)': {
							width: `${panelWidths.aiAnalyzer}%`,
							// overflow: 'hidden',
						}
					}}
				>
					<AIAnalyzerResponsive repOwner={ownerLogin} />
				</Box>
			</Box>
		</Box>
	);
};

export default RepoListPage;
