'use client'

import { useEffect, useState } from 'react'
import { Box } from '@mui/material'

export default function ParallaxBackground({ children, imageUrl = '/hero-background.png', blurAmount = 0, scrollSpeed = 0 }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [supportsBackdrop, setSupportsBackdrop] = useState(true)

  // Check for backdrop-filter support
  useEffect(() => {
    if (typeof CSS !== 'undefined') {
      setSupportsBackdrop(
        CSS.supports('backdrop-filter', 'blur(10px)') || 
        CSS.supports('-webkit-backdrop-filter', 'blur(10px)')
      )
    }
  }, [])

  const handleImageLoad = () => {
    console.log('✅ Background image loaded successfully:', imageUrl)
    setIsLoaded(true)
  }

  const handleImageError = (e) => {
    console.error('❌ Failed to load background image:', imageUrl)
    setIsLoaded(true)
    e.target.style.display = 'none'
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      {/* Fixed Background Image */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#795548',
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: blurAmount > 0 ? `blur(${blurAmount}px) brightness(0.9)` : 'none',
          zIndex: -2,
          opacity: isLoaded ? 1 : 0.5,
          transition: 'opacity 0.5s ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(121, 85, 72, 0.3) 0%, rgba(77, 58, 50, 0.6) 100%)',
            mixBlendMode: 'multiply'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(121, 85, 72, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%)',
          }
        }}
      >
        <img
          src={imageUrl}
          alt=""
          style={{ display: 'none' }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </Box>

      {/* Overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%)',
          zIndex: -1,
          opacity: 0.2,
        }}
      />

      {/* Content Container */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          ...(supportsBackdrop ? {
            backgroundColor: 'transparent',
          } : {
            backgroundColor: 'transparent',
          })
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
