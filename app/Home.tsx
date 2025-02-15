"use client";

import { useState } from "react";
import { Octokit } from "@octokit/rest";
import SearchBar from "./components/search-bar/SearchBar";
import UserSearch from "./components/search-page/UserSearch";
import styles from "./home.module.css";
import { GitHubUser } from "./types/github";
import { CircularProgress } from "@mui/material";
import { Backdrop } from "@mui/material";
import { useUserInteraction } from "./hooks/useUserInteraction";

const octokit = new Octokit();

interface initialServerUser {
  initialUser: GitHubUser | null;
  isMobile: boolean;
}

export default function Home({ initialUser, isMobile }: initialServerUser) {
  const [user, setUser] = useState<GitHubUser | null>(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Используем кастомный хук для отслеживания первого взаимодействия
  const userInteracted = useUserInteraction();

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setError("Please enter a username");
      return;
    }
    setLoading(true);
    try {
      setError("");
      const response = await octokit.request("GET /users/{username}", {
        username: query,
      });

      const userData: GitHubUser = {
        id: response.data.id,
        login: response.data.login,
        name: response.data.name || "no name",
        avatar_url: response.data.avatar_url,
        public_repos: response.data.public_repos,
        bio: response.data.bio,
        followers: response.data.followers,
        following: response.data.following,
        repos_url: response.data.repos_url,
      };

      setUser(userData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("Not Found")) {
          setError("User not found. Please check the username and try again.");
        } else {
          setError(
            "An error occurred while searching. Please try again later.",
          );
        }
      }
      setUser(null);
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1>GitHub User Analyzer</h1>
          <SearchBar onSearch={handleSearch} />
        </header>
        <main className={styles.main}>
          <UserSearch user={user} error={error} isMobile={isMobile} userInteracted={userInteracted} />
        </main>
        <footer className={styles.footer}>
          <p>2025 GitHub User Analyzer by @nkt.frlv.</p>
        </footer>
      </div>
      <Backdrop
        sx={(theme) => ({
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={loading}
        onClick={() => {}}
        tabIndex={-1}
        aria-hidden={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
