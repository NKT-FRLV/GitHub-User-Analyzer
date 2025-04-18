import { Container } from "@mui/material";
import { ProfileSkeleton } from "./ProfileSkeleton";


export default function loading() {
  return (
      <Container maxWidth="md" sx={{ mt: 4 }} component="main">
        <ProfileSkeleton />
      </Container>
  )
}