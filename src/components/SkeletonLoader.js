// cafe-website/src/components/SkeletonLoader.js
import { 
  Skeleton, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Stack 
} from '@mui/material'

export function MenuItemSkeleton({ count = 6 }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ height: '100%' }}>
            <Skeleton 
              variant="rectangular" 
              height={200} 
              sx={{ bgcolor: 'grey.200' }}
            />
            <CardContent>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="20%" height={30} />
                </Box>
                <Skeleton variant="text" height={20} />
                <Skeleton variant="text" height={20} width="80%" />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Skeleton variant="rounded" width={60} height={24} />
                  <Skeleton variant="rounded" width={60} height={24} />
                </Box>
                <Skeleton variant="text" width="40%" height={20} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export function GallerySkeleton({ count = 6 }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <Skeleton 
              variant="rectangular" 
              height={250} 
              sx={{ bgcolor: 'grey.200' }}
            />
            <CardContent>
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={20} width="80%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}