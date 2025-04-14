import { Grid, Card, CardContent, Skeleton } from '@mui/material';

export const ProfileSkeleton = () => {
  return (
    <>
      <Grid item xs={12} md={4}>
        <Card elevation={3}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
            <Skeleton variant="circular" width={120} height={120} />
            <Skeleton variant="text" width="60%" sx={{ mt: 2 }} />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="rectangular" width="100%" height={36} sx={{ mt: 2 }} />
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <Card elevation={3}>
          <CardContent sx={{ p: 3 }}>
            <Skeleton variant="text" width="30%" height={32} />
            <Skeleton variant="text" width="100%" sx={{ mt: 2 }} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="30%" height={32} sx={{ mt: 4 }} />
            <Skeleton variant="text" width="100%" sx={{ mt: 2 }} />
            <Skeleton variant="text" width="100%" />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}; 