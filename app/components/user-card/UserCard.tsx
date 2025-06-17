"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { FS, AvatarSize } from "../../types/enums";
import styles from "./userCard.module.css";
import { UserCardProps } from "../../types/github";
import { useAuth } from '../../context/AuthContext';
import UserCardHeader from "./UserCardHeader";
import UserCardStats from "./UserCardStats";
import UserCardActions from "./UserCardActions";
import { useAnimationStore } from "@/app/store/animation-events/store";
import clsx from "clsx";
import { useCandidateStore } from "@/app/store/canditade/store";
import { useShallow } from "zustand/react/shallow";

const UserCard = ({ 
  user: githubCandidate, 
  error, 
  isMobile: serverIsMobile, 
  userInteracted 
}: UserCardProps & { 
  isMobile: boolean, 
  userInteracted: boolean 
}) => {
  const isAnimating = useAnimationStore((state) => state.isAnimating);
  const triggerAnimation = useAnimationStore((state) => state.triggerAnimation);
  const [isMobileView, setIsMobileView] = useState(serverIsMobile);
  const router = useRouter();
  const { user } = useAuth();
	const { isSaved, checkSaved } = useCandidateStore(
		useShallow((state) => ({
			isSaved: state.isSaved,
			checkSaved: state.checkSaved,
		}))
	);
  useEffect(() => {
	if (!user?.id || !githubCandidate) {
		return;
	}

    checkSaved(githubCandidate.login, user.id);
  }, [githubCandidate, user, checkSaved]);

  const handleRepos = useCallback(() => {    
    // setIsLoading(true);
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

  // const mockFn = () => {
  //   triggerAnimation();
  // }

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
          avatarUrl: githubCandidate.avatar_url,
          reposUrl: githubCandidate.repos_url
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Instead of alert, call by Zustand store, to User Avatar animation
        triggerAnimation();

      } else {
        console.error('Error saving candidate:', data.message);
      }
    } catch (error) {
      console.error('Error sending request:', error);
    }
  }, [githubCandidate, user?.isAuthenticated, router, triggerAnimation]);

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
      <div className={styles.cardContainer3d}>
        <div className={clsx(styles.cardWrapper, isAnimating && styles.flipCard)}>
          <div className={styles.cardFront}>
            <Card elevation={3} className={styles.card} component="article">
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
                  isSaved={isSaved}
                />
              </CardContent>
            </Card>
          </div>
          <div className={styles.cardBack}>
            <Card elevation={3} className={styles.cardBackInner} component="article">
              <CardContent className={styles.thankYouContent}>
                <h3>Thank You from {githubCandidate.name}!</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;
