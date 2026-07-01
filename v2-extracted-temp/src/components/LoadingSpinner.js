// cafe-website/src/components/LoadingSpinner.js
import { CircularProgress, Box, Typography } from '@mui/material'

export default function LoadingSpinner({ 
  size = 40, 
  message = 'در حال بارگذاری...',
  fullScreen = false 
}) {
  const spinner = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: 2,
      py: 4
    }}>
      <CircularProgress 
        size={size} 
        sx={{ color: '#795548' }} 
      />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  )

  if (fullScreen) {
    return (
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999
      }}>
        {spinner}
      </Box>
    )
  }

  return spinner
}