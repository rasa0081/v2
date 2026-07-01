'use client'

import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Badge,
  CardMedia
} from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useState } from 'react'

export default function MenuCard({ item, showCategory = false }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const formatPrice = (price) => {
    return `${price.toLocaleString()} ت`
  }

  // Fallback image if the main image fails to load
  const getImageSrc = () => {
    if (imageError || !item.image) {
      // Return a placeholder image based on category
      if (item.categoryId === 'coffee' || item.categoryId === 'tea') {
        return '/menu-images/default-drink.jpg'
      } else if (item.categoryId === 'food') {
        return '/menu-images/default-food.jpg'
      } else if (item.categoryId === 'pastries') {
        return '/menu-images/default-pastry.jpg'
      }
      return '/menu-images/default-item.jpg'
    }
    return item.image
  }

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        '& .menu-card-image': {
          transform: 'scale(1.05)',
        }
      }
    }}>
      {/* Product Image */}
      <Box sx={{ 
        position: 'relative',
        height: 200,
        overflow: 'hidden',
        backgroundColor: 'rgba(121, 85, 72, 0.1)'
      }}>
        <CardMedia
          component="img"
          height="200"
          image={getImageSrc()}
          alt={item.name}
          className="menu-card-image"
          sx={{
            transition: 'transform 0.5s ease',
            objectFit: 'cover',
            width: '100%',
          }}
          onError={() => setImageError(true)}
        />
        
        {/* Popular Badge */}
        {item.popular && (
          <Badge
            badgeContent="پرفروش"
            color="primary"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16, // Right side for RTL
              '& .MuiBadge-badge': {
                backgroundColor: '#795548',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
                padding: '4px 8px',
                borderRadius: '12px',
              }
            }}
          />
        )}
        
        {/* Favorite Button */}
        <IconButton 
          size="small" 
          onClick={() => setIsFavorite(!isFavorite)}
          sx={{ 
            position: 'absolute',
            top: 12,
            right: 12, // Left side for RTL
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': { 
              backgroundColor: 'white',
              transform: 'scale(1.1)'
            },
            color: isFavorite ? '#795548' : 'text.secondary',
            transition: 'all 0.3s',
          }}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Category */}
        {showCategory && item.category && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {item.category}
          </Typography>
        )}
        
        {/* Name and Price */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          mb: 1,
          flexDirection: 'row-reverse' // RTL adjustment
        }}>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 600, 
              pr: 2,
              textAlign: 'right' // RTL
            }}
          >
            {item.name}
          </Typography>
          <Typography 
            variant="h6" 
            color="primary" 
            sx={{ 
              fontWeight: 700, 
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {formatPrice(item.price)}
          </Typography>
        </Box>
        
        {/* Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          paragraph 
          sx={{ 
            mb: 2, 
            minHeight: '40px',
            textAlign: 'right' // RTL
          }}
        >
          {item.description}
        </Typography>
        
        {/* Ingredients */}
        {item.ingredients && (
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: 'block', 
                mb: 0.5,
                textAlign: 'right' // RTL
              }}
            >
              مواد تشکیل دهنده:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'flex-end' }}>
              {item.ingredients.map((ingredient, index) => (
                <Chip
                  key={index}
                  label={ingredient}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.7rem',
                    borderColor: 'rgba(121, 85, 72, 0.3)',
                    color: 'text.secondary'
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        
        {/* Calories and Add to Cart */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mt: 'auto',
          flexDirection: 'row-reverse' // RTL
        }}>
          {item.calories && (
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <span>🔥</span>
              {item.calories} کالری
            </Typography>
          )}
          
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#795548',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 16px',
              borderRadius: '20px',
              backgroundColor: 'rgba(121, 85, 72, 0.1)',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(121, 85, 72, 0.2)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            <span>➕</span>
            افزودن به سبد خرید
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}