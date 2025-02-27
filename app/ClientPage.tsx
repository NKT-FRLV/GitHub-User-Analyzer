"use client";
import { useState } from "react";
import { getUserData } from "./api/API";
import { GitHubUser, initialServerUser } from "./types/github";
import SearchBar from "./components/search-bar/SearchBar";
import UserCard from "./components/user-card/UserCard";
import { useUserInteraction } from "./hooks/useUserInteraction";
import { CircularProgress, Backdrop } from "@mui/material";
import styles from "./page.module.css";



const ClientPage = ({ initialUser, isMobile }: initialServerUser) => {

    const [user, setUser] = useState<GitHubUser | null>(initialUser as GitHubUser | null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    // Используем кастомный хук для отслеживания первого взаимодействия
    // что бы переключить адаптивный дизайн слушать клиентское состояние а не серверные данные
    const userInteracted = useUserInteraction();
  
    const handleSearch = async (query: string) => {
      if (!query.trim()) {
        setError("Please enter a username");
        return;
      }
      setLoading(true);
      setError("");

      const userData = await getUserData(query);

      if (!userData) {
        setError("User not found. Please check the username and try again.");
        setUser(null);
      } else {
        setUser(userData);
      }
      setLoading(false);
    };

      
    return (
    <>
        <div className={styles.page}>
        <header className={styles.header}>
            <h1>GitHub User Analyzer</h1>
            <SearchBar onSearch={handleSearch} />
        </header>
        <main className={styles.main}>
            <UserCard user={user} error={error} isMobile={isMobile} userInteracted={userInteracted} />
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
          aria-hidden={false}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
    </>
    );
    }
  
  export default ClientPage;