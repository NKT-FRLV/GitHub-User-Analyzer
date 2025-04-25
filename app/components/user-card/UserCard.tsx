"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { FS, AvatarSize } from "../../types/enums";
import styles from "./userCard.module.css";
import { UserCardProps } from "../../types/github";
import { useAuth } from '../../context/AuthContext';
import FullPageLoader from "../common/FullPageLoader";
import UserCardHeader from "./UserCardHeader";
import UserCardStats from "./UserCardStats";
import UserCardActions from "./UserCardActions";

const UserCard = ({ 
  user: githubCandidate, 
  error, 
  isMobile: serverIsMobile, 
  userInteracted 
}: UserCardProps & { 
  isMobile: boolean, 
  userInteracted: boolean 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(serverIsMobile);

  const router = useRouter();
  const { user } = useAuth(); 

  const handleRepos = useCallback(() => {    
    setIsLoading(true);
    if (githubCandidate) {
      router.push(`/repos?url=${githubCandidate.repos_url}`);
    }
  }, [githubCandidate, router]);

  const clientIsMobile = useMediaQuery("(max-width: 768px)");

  // Функция переключения `isMobileView` при первом клике/таче
  useEffect(() => {
    if (userInteracted) {
      setIsMobileView(clientIsMobile);
    }
  }, [clientIsMobile, userInteracted]);

  const avatarSize = isMobileView ? AvatarSize.small : AvatarSize.big;
  const buttonFontSize = isMobileView ? FS.S : FS.X;
  const adaptiveFontSize1 = isMobileView ? FS.L : FS.XL;
  const adaptiveFontSize2 = isMobileView ? FS.M : FS.X;

  // Функция для сохранения кандидата
  const handleSaveCandidate = useCallback( async () => {
    if (!githubCandidate || !user?.isAuthenticated) {
      // Если пользователь не авторизован, перенаправляем на страницу логина
      router.push('/auth/login?from=/');
      return;
    }
    
    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubName: githubCandidate.login,
          githubUrl: githubCandidate.html_url,
          avatarUrl: githubCandidate.avatar_url
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Показать уведомление об успешном сохранении
        alert('Candidate saved successfully ');
      } else {
        console.error('Error saving candidate:', data.message);
      }
    } catch (error) {
      console.error('Error sending request:', error);
    }
  }, [githubCandidate, user?.isAuthenticated, router]);

  if (error) {
    return (
      <div className={styles.error}>
        {error}
      </div>
    );
  }

  if (!githubCandidate) {
    return (
      <div className={styles.emptyState}>
        Try to input GitHub username
      </div>
    );
  }

  return (
    <>
      <FullPageLoader open={isLoading} />
      <Card elevation={3} className={styles.container} component="article">
        <CardContent className={styles.userInfo}>
          <UserCardHeader 
            githubCandidate={githubCandidate} 
            user={user}
            avatarSize={avatarSize}
            isMobileView={isMobileView}
            adaptiveFontSize1={adaptiveFontSize1}
            adaptiveFontSize2={adaptiveFontSize2}
          />

          <UserCardStats 
            githubCandidate={githubCandidate}
            isMobileView={isMobileView}
          />

          <Divider />
          
          <UserCardActions 
            githubCandidate={githubCandidate}
            handleRepos={handleRepos}
            handleSaveCandidate={handleSaveCandidate}
            buttonFontSize={buttonFontSize}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default UserCard;
