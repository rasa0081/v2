'use client'

import { useState, useEffect } from 'react'
import { 
  Container, Typography, Box, Grid, Card, CardMedia,
  Dialog, DialogContent, IconButton, CircularProgress,
  Alert, Snackbar, Button, Chip
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ImageIcon from '@mui/icons-material/Image'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const categoryLabels = {
  all: 'همه',
  interior: 'داخلی',
  coffee: 'قهوه',
  food: 'غذا',
  events: 'رویدادها',
  staff: 'کارکنان',
  other: 'متفرقه',
}

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')

  const fetchGalleryImages = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/gallery?active=true&limit=20')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      if (result.success) {
        setGalleryImages(result.data.images || [])
      } else {
        setGalleryImages([])
      }
    } catch {
      setError('خطا در بارگذاری گالری')
      setGalleryImages([])
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchGalleryImages() }, [])

  const filteredImages = activeCategory === 'all' 
    ? galleryImages : galleryImages.filter(img => img.category === activeCategory)

  const categories = ['all', ...new Set(galleryImages.map(img => img.category))]

  const openImage = (image, index) => {
    setSelectedImage(image)
    setSelectedIndex(index)
  }

  const navigateImage = (dir) => {
    const newIndex = selectedIndex + dir
    if (newIndex >= 0 && newIndex < filteredImages.length) {
      setSelectedImage(filteredImages[newIndex])
      setSelectedIndex(newIndex)
    }
  }

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2,
      }}>
        <CircularProgress sx={{ color: '#5D4037' }} size={36} />
        <Typography variant="body2" color="text.secondary">در حال بارگذاری گالری...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: '#FDFBF7', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #5D4037 0%, #3E2723 100%)',
        color: 'white', py: { xs: 5, md: 8 }, textAlign: 'center',
      }}>
        <Container maxWidth="lg">
          <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.8rem', md: '2.8rem' }, mb: 1 }}>
            گالری تصاویر
          </Typography>
          <Typography sx={{ opacity: 0.7, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            فضای کافه و محصولات ما را ببینید
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
        {/* Error */}
        {error && (
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert severity="error" onClose={() => setError(null)}
              action={<Button size="small" color="inherit" onClick={fetchGalleryImages}>تلاش مجدد</Button>}>
              {error}
            </Alert>
          </Snackbar>
        )}

        {/* Category Filter */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: { xs: 3, md: 5 } }}>
          {categories.map(cat => (
            <Chip
              key={cat}
              label={categoryLabels[cat] || cat}
              onClick={() => setActiveCategory(cat)}
              variant={activeCategory === cat ? 'filled' : 'outlined'}
              sx={{
                borderRadius: '8px',
                fontWeight: activeCategory === cat ? 700 : 400,
                fontSize: '0.8rem',
                ...(activeCategory === cat ? {
                  backgroundColor: '#5D4037', color: 'white',
                  '&:hover': { backgroundColor: '#3E2723' },
                } : {
                  borderColor: 'rgba(93,64,55,0.15)', color: '#5D4037',
                }),
              }}
            />
          ))}
        </Box>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">تصویری یافت نشد</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              لطفا از پنل مدیریت تصاویر اضافه کنید
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 1, sm: 2, md: 2.5 }}>
            {filteredImages.map((image, index) => (
              <Grid item xs={6} sm={4} md={4} key={image._id || image.id}>
                <Card elevation={0} sx={{ 
                  cursor: 'pointer', overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    transform: { md: 'translateY(-3px)' },
                    '& img': { transform: 'scale(1.05)' },
                  },
                }}
                onClick={() => openImage(image, index)}>
                  <Box sx={{ position: 'relative', height: { xs: 150, sm: 200, md: 240 }, overflow: 'hidden' }}>
                    <CardMedia component="img" image={image.url} alt={image.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onError={(e) => { e.target.src = '/gallery/placeholder.jpg' }} />
                    <Box sx={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                    }} />
                    <Box sx={{ position: 'absolute', bottom: 10, left: 12, right: 12, color: 'white' }}>
                      <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.75rem', md: '0.9rem' }, lineHeight: 1.3 }}>
                        {image.title}
                      </Typography>
                    </Box>
                    {/* Category chip */}
                    <Box sx={{ 
                      position: 'absolute', top: 8, right: 8,
                      backgroundColor: 'rgba(255,255,255,0.9)', px: 1, py: 0.3,
                      borderRadius: '6px', fontSize: '0.6rem', fontWeight: 600, color: '#5D4037',
                    }}>
                      {categoryLabels[image.category] || image.category}
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* CTA */}
        <Box sx={{ 
          mt: { xs: 4, md: 6 }, p: { xs: 3, md: 5 },
          background: 'linear-gradient(135deg, #5D4037 0%, #3E2723 100%)',
          color: 'white', borderRadius: '16px', textAlign: 'center',
        }}>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.4rem' }, mb: 1.5 }}>
            عکس خاصی از کافه دارید؟
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: 450, mx: 'auto', mb: 3 }}>
            عکس‌های خود را با هشتگ #کافه_کاریبو به اشتراک بگذارید
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href="https://www.instagram.com/cafecaribou" target="_blank" variant="contained"
              sx={{ backgroundColor: '#D4A574', color: '#3E2723', borderRadius: '8px', '&:hover': { backgroundColor: '#E8C9A0' } }}>
              اینستاگرام
            </Button>
            <Button href="https://telegram.org" target="_blank" variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', borderRadius: '8px',
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.05)' } }}>
              تلگرام
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="md" fullWidth
        sx={{
          '& .MuiDialog-paper': {
            maxHeight: '92vh', borderRadius: { xs: '12px', md: '16px' },
            m: { xs: 1, md: 4 },
          },
        }}>
        {selectedImage && (
          <DialogContent sx={{ p: 0, position: 'relative' }}>
            <IconButton onClick={() => setSelectedImage(null)}
              sx={{ position: 'absolute', right: 8, top: 8, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', zIndex: 2,
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }, width: 36, height: 36 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
            {/* Navigation arrows */}
            {selectedIndex > 0 && (
              <IconButton onClick={() => navigateImage(-1)}
                sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
                  backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' } }}>
                <ChevronRightIcon />
              </IconButton>
            )}
            {selectedIndex < filteredImages.length - 1 && (
              <IconButton onClick={() => navigateImage(1)}
                sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
                  backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' } }}>
                <ChevronLeftIcon />
              </IconButton>
            )}
            <img src={selectedImage.url} alt={selectedImage.title}
              style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '70vh', objectFit: 'contain', backgroundColor: '#111' }} />
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 0.5 }}>{selectedImage.title}</Typography>
              <Typography variant="body2" color="text.secondary">{selectedImage.description}</Typography>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  )
}