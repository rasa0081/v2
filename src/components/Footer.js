import { Box, Container, Typography, IconButton, Grid } from '@mui/material'
import { Instagram } from '@mui/icons-material'
import TelegramIcon from '@mui/icons-material/Telegram'
import Link from 'next/link'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#3E2723',
        color: 'rgba(255,255,255,0.85)',
        pt: { xs: 5, md: 6 },
        pb: { xs: 3, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ 
                width: 36, height: 36, overflow: 'hidden',
              }}>
                <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#D4A574' }}>
                Caribou Cafe
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.6, lineHeight: 1.8, maxWidth: 280 }}>
              Life is short, stay awake for it
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 2, color: '#D4A574' }}>
              دسترسی سریع
            </Typography>
            {[
              { label: 'منو', path: '/menu' },
              { label: 'درباره ما', path: '/about' },
              { label: 'گالری', path: '/gallery' },
            ].map((link) => (
              <Link key={link.path} href={link.path} style={{ textDecoration: 'none' }}>
                <Typography sx={{ 
                  color: 'rgba(255,255,255,0.6)', 
                  fontSize: '0.85rem', 
                  mb: 1,
                  transition: 'color 0.2s ease',
                  '&:hover': { color: '#D4A574' },
                }}>
                  {link.label}
                </Typography>
              </Link>
            ))}
          </Grid>

          {/* Contact */}
          <Grid item xs={6} md={3}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 2, color: '#D4A574' }}>
              تماس
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', mb: 1 }}>
              تهران - شهر قدس
            </Typography>
            <Typography dir="ltr" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', mb: 1, textAlign: 'right' }}>
              09212620316
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
              ۱۱ صبح - ۱۰ شب
            </Typography>
          </Grid>

          {/* Social */}
          <Grid item xs={12} md={3}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 2, color: '#D4A574' }}>
              شبکه‌های اجتماعی
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                href="https://www.instagram.com/cafecaribou"
                target="_blank"
                size="small"
                sx={{ 
                  color: 'rgba(255,255,255,0.6)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': { color: '#D4A574', borderColor: '#D4A574' },
                  transition: 'all 0.2s ease',
                }}
              >
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton 
                href="https://telegram.org"
                target="_blank"
                size="small"
                sx={{ 
                  color: 'rgba(255,255,255,0.6)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': { color: '#D4A574', borderColor: '#D4A574' },
                  transition: 'all 0.2s ease',
                }}
              >
                <TelegramIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom bar */}
        <Box sx={{ 
          mt: 4, pt: 3, 
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}>
          <Typography variant="caption" sx={{ opacity: 0.4, fontSize: '0.72rem' }}>
            © {new Date().getFullYear()} Caribou Cafe — Powered by Aban.agency
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.4, fontSize: '0.72rem' }}>
            ☕ Life is short, stay awake for it
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}