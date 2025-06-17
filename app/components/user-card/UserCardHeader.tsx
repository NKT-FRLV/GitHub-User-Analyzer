"use client";

import { 
  Box, 
  Typography, 
  Avatar
} from "@mui/material";
import TextInfo from "../common/TextInfo";
import AvatarModal from "../common/modals/Avatar-Modal/Avatar-Modal";
import styles from "./userCard.module.css";
import { AuthUser, GitHubUser } from "../../types/github";
import { useModalsOpenStore } from "@/app/store/modals-open/store";

interface UserCardHeaderProps {
  githubCandidate: GitHubUser;
  user: AuthUser | null;
  avatarSize: string;
  isMobileView: boolean;
  adaptiveFontSize1: string;
  adaptiveFontSize2: string;
}

const UserCardHeader: React.FC<UserCardHeaderProps> = ({
  githubCandidate,
  user,
  avatarSize,
  isMobileView,
  adaptiveFontSize1,
  adaptiveFontSize2
}) => {

  const handleAvatarOpen = useModalsOpenStore((state) => state.handleAvatarOpen);

  return (
    <>
      <Box className={styles.header}>
        <Avatar
          className={styles.avatarContainer}
          aria-label="Avatar modal"
          src={
            user?.isAuthenticated && githubCandidate.login === user.username
              ? user.avatarUrl || githubCandidate.avatar_url // Use avatar from profile if available
              : githubCandidate.avatar_url
          }
          alt={githubCandidate.login}
          sx={{ width: avatarSize, height: avatarSize }}
          onClick={() => handleAvatarOpen(githubCandidate)}
        />
        <Box className={styles.userDetails}>
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            alignItems="baseline"
            my={1}
          >
            <TextInfo
              text={
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    color: "grey.600",
                    fontSize: adaptiveFontSize1,
                  }}
                >
                  Name:
                </Typography>
              }
              value={githubCandidate.name}
              propsTypography={{
                // display: "inline-block",
                maxWidth: isMobileView ? 100 : 200,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              isSmallScreen={isMobileView}
              fsMax="1.5rem"
              fsMin="1rem"
              spacing={false}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap={1}
            alignItems="baseline"
          >
            <TextInfo
              text={
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    color: "grey.600",
                    fontSize: adaptiveFontSize1,
                  }}
                >
                  Login:
                </Typography>
              }
              value={githubCandidate.login}
              propsTypography={{
                // display: "inline-block",
                maxWidth: isMobileView ? 100 : 200,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              isSmallScreen={isMobileView}
              fsMax="1.5rem"
              fsMin="1rem"
              spacing={false}
            />
          </Box>

          <Typography
            variant="body1"
            sx={{ 
              mb: 1, 
              mt: 2, 
              fontSize: adaptiveFontSize2, 
              maxWidth: isMobileView ? 200 : 300,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {githubCandidate.bio || "No bio available"}
          </Typography>
        </Box>
      </Box>

      {/* Avatar Modal */}
      <AvatarModal />
      
    </>
  );
};

export default UserCardHeader; 