// cafe-website/src/components/ImageWithFallback.js
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Skeleton, Box } from '@mui/material'

export default function ImageWithFallback({ 
  src, 
  alt, 
  width, 
  height, 
  fallbackSrc = '/menu-images/default-item.jpg',
  priority = false,
  className = '',
  style = {}
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const imageSrc = hasError ? fallbackSrc : src

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {isLoading && (
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%"
          sx={{ bgcolor: 'grey.200' }}
        />
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        width={width || 400}
        height={height || 300}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        quality={85}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={handleError}
        onLoad={handleLoad}
        style={{
          objectFit: 'cover',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease',
          ...style
        }}
        className={className}
      />
    </Box>
  )
}