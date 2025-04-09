"use client";
import { useState, useEffect } from "react";
import { getUserData } from "./api/API";
import { GitHubUser, initialServerUser } from "./types/github";
import UserCard from "./components/user-card/UserCard";
import SearchBar from "./components/search-bar/SearchBar";
import { useUserInteraction } from "./hooks/useUserInteraction";
import { CircularProgress, Backdrop, Container, Box } from "@mui/material";
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
          <Container component="main" className={styles.main}>
              <Box 
                sx={{ 
                  maxWidth: 600, 
                  mb: 3, 
                  mx: 'auto',
                  px: { xs: 2, sm: 0 },
                  mt: 2
                }}
              >
                <SearchBar onSearch={handleSearch} />
              </Box>
              <UserCard user={user} error={error} isMobile={isMobile} userInteracted={userInteracted} />
          </Container>
        <Backdrop
          sx={(theme) => ({
              color: theme.palette.primary.main,
              zIndex: theme.zIndex.drawer + 1,
          })}
          open={loading}
          onClick={() => {}}
          tabIndex={-1}
          aria-hidden={false}
        >
          <CircularProgress color="primary" />
        </Backdrop>
    </>
    );
}
  
export default ClientPage;