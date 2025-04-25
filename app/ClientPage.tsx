"use client";
import { useState, useEffect } from "react";
import { useCandidateStore } from "./store/canditade/store";
import { useShallow } from 'zustand/react/shallow'
import { getCandidateData } from "./api/API";
import { GitHubUser, initialServerUser } from "./types/github";
import UserCard from "./components/user-card/UserCard";
import SearchBar from "./components/search-bar/SearchBar";
import { useUserInteraction } from "./hooks/useUserInteraction";
import FullPageLoader from "./components/common/FullPageLoader";
import { Container, Box } from "@mui/material";
import styles from "./page.module.css";
import clsx from "clsx";

const ClientPage = ({ initialUser, isMobile }: initialServerUser) => {


    const { candidate, loading, error, setCandidate, fetchCandidate } = useCandidateStore(useShallow(
      (state) => ({
        candidate: state.candidate,
        loading: state.loading,
        error: state.error,
        setCandidate: state.setCandidate,
        setLoading: state.setLoading,
        setError: state.setError,
        fetchCandidate: state.fetchCandidate
      })
    ));
  
    // Используем кастомный хук для отслеживания первого взаимодействия
    // что бы переключить адаптивный дизайн слушать клиентское состояние а не серверные данные
    const userInteracted = useUserInteraction();

    // For fadeIn animation
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      setMounted(true);
      if (initialUser) {
        setCandidate(initialUser as GitHubUser);
      }
    }, [initialUser, setCandidate]);
  
    const handleSearch = async (query: string) => {
      await fetchCandidate(query);
    };

    return (
      <>
        <Container component="main" className={clsx(styles.main, mounted && styles.fadeIn)}>
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
            <UserCard user={candidate} error={error} isMobile={isMobile} userInteracted={userInteracted} />
        </Container>
        <FullPageLoader open={loading} />
      </>
    );
}
  
export default ClientPage;