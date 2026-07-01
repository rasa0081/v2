'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Container, Grid, Card, CardContent, Typography, Button, Box } from '@mui/material'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'
import GroupsIcon from '@mui/icons-material/Groups'
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import Link from 'next/link'
import { useSettings } from '@/hooks/useSettings'
import './globals.css'

export default function Home() {
  const { data: settings, isLoading: settingsLoading } = useSettings()
  const [scrollY, setScrollY] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          setShowBackToTop(window.scrollY > 600)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const heroOpacity = Math.max(0, 1 - scrollY / 500)
  const heroTranslate = scrollY * 0.3

  if (settingsLoading) {
    return (
      <Box sx={{ 
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        height: '100vh', backgroundColor: '#FDFBF7',
      }}>
        <LocalCafeIcon sx={{ fontSize: 48, color: '#5D4037', animation: 'pulse 1.5s infinite' }} />
      </Box>
    )
  }

  return (
    <>
      {/* === HERO SECTION === */}
      <Box sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Background Image */}
        <Box sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/hero-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${heroTranslate}px)`,
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(30,20,15,0.55) 0%, rgba(30,20,15,0.75) 100%)',
          },
        }} />

        {/* Hero Content */}
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: { xs: 3, md: 4 } }}>
          <Box sx={{ opacity: heroOpacity, transition: 'opacity 0.1s linear' }}>
            {/* Logo */}
            <Box sx={{ 
              width: { xs: 72, md: 90 },
              height: { xs: 72, md: 90 },
              overflow: 'hidden',
              mx: 'auto',
              mb: 3,
            }}>
              <img src="/logo.png" alt="Caribou" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </Box>
            
            <Typography sx={{ 
              fontWeight: 900,
              color: '#fff',
              fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
              lineHeight: 1.15,
              mb: 2,
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}>
              {settings?.data?.site_name || 'کافه کاریبو'}
            </Typography>
            
            <Typography sx={{ 
              color: 'rgba(255,255,255,0.8)',
              fontSize: { xs: '1rem', md: '1.3rem' },
              fontWeight: 300,
              fontStyle: 'italic',
              mb: 5,
              letterSpacing: '0.5px',
            }}>
              Life is short — Stay awake for it
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/menu" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    px: { xs: 4, md: 5 },
                    py: 1.5,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    backgroundColor: '#D4A574',
                    color: '#3E2723',
                    fontWeight: 700,
                    borderRadius: '10px',
                    boxShadow: '0 4px 20px rgba(212,165,116,0.4)',
                    '&:hover': {
                      backgroundColor: '#E8C9A0',
                      boxShadow: '0 6px 24px rgba(212,165,116,0.5)',
                    },
                  }}
                >
                  منوی کافه
                </Button>
              </Link>
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    px: { xs: 4, md: 5 },
                    py: 1.5,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    borderColor: 'rgba(255,255,255,0.35)',
                    color: '#fff',
                    borderWidth: 1.5,
                    borderRadius: '10px',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.6)',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      borderWidth: 1.5,
                    },
                  }}
                >
                  تماس با ما
                </Button>
              </Link>
            </Box>
          </Box>

          {/* Scroll indicator */}
          <Box sx={{ 
            position: 'absolute', 
            bottom: { xs: 24, md: 40 }, 
            left: '50%', 
            transform: 'translateX(-50%)',
            opacity: heroOpacity,
          }}>
            <ArrowDownwardIcon sx={{ 
              color: 'rgba(255,255,255,0.4)', 
              fontSize: 24,
              animation: 'float 3s ease-in-out infinite',
            }} />
          </Box>
        </Container>
      </Box>

      {/* === FEATURES SECTION === */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#FDFBF7' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
            <Typography variant="h2" sx={{ mb: 1.5, color: '#3E2723' }}>
              تجربه‌ای متفاوت
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
              آنچه کاریبو را از دیگر کافه‌ها متمایز می‌کند
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 4 }}>
            {[
              {
                icon: <LocalCafeIcon sx={{ fontSize: { xs: 28, md: 34 } }} />,
                title: 'قهوه تخصصی',
                desc: 'دانه‌های مرغوب از بهترین مزارع دنیا، رست و دم‌آوری شده توسط باریستاهای متخصص',
                accent: '#5D4037',
              },
              {
                icon: <EmojiFoodBeverageIcon sx={{ fontSize: { xs: 28, md: 34 } }} />,
                title: 'فضای دنج',
                desc: 'محیطی آرام و صمیمی برای دورهمی‌های دوستانه، جلسات کاری یا لحظاتی با خودتان',
                accent: '#8B6F61',
              },
              {
                icon: <GroupsIcon sx={{ fontSize: { xs: 28, md: 34 } }} />,
                title: 'خانواده کاریبو',
                desc: 'هر مشتری عضوی از خانواده کاریبو است. اینجا فقط قهوه سرو نمی‌شود، خاطره ساخته می‌شود',
                accent: '#D4A574',
              },
            ].map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card elevation={0} sx={{ 
                  height: '100%', 
                  textAlign: 'center',
                  p: { xs: 3, md: 4 },
                  backgroundColor: '#fff',
                  border: '1px solid rgba(93,64,55,0.06)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    boxShadow: '0 8px 30px rgba(93,64,55,0.08)',
                    transform: { md: 'translateY(-4px)' },
                  },
                }}>
                  <Box sx={{ 
                    width: { xs: 56, md: 68 },
                    height: { xs: 56, md: 68 },
                    borderRadius: '16px',
                    backgroundColor: `${item.accent}0D`,
                    color: item.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2.5,
                  }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: '#3E2723' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                    {item.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* === ABOUT SECTION === */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #5D4037 0%, #3E2723 100%)',
        color: 'white',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ fontWeight: 900, color: '#D4A574', mb: 2 }}>
                داستان ما
              </Typography>
              <Typography sx={{ 
                fontSize: { xs: '0.95rem', md: '1.05rem' }, 
                lineHeight: 2.2, 
                opacity: 0.85,
                mb: 3,
              }}>
                کاریبو از عشق به طبیعت و قهوه متولد شد. ما معتقدیم که هر فنجان قهوه باید داستانی را روایت کند. 
                فضای گرم و صمیمی کافه ما مکانی ایده‌آل برای دورهمی‌های دوستانه، جلسات کاری یا لحظاتی آرام است.
              </Typography>
              <Link href="/about" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="outlined"
                  sx={{ 
                    borderColor: '#D4A574',
                    color: '#D4A574',
                    borderRadius: '8px',
                    px: 3,
                    '&:hover': { 
                      backgroundColor: 'rgba(212,165,116,0.1)',
                      borderColor: '#E8C9A0',
                    },
                  }}
                >
                  بیشتر بخوانید
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                height: { xs: 250, md: 380 },
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}>
                <Box
                  component="img"
                  src="/about-image.jpg"
                  alt="داخل کافه"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box sx={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  height: '50%',
                  background: 'linear-gradient(to top, rgba(62,39,35,0.7), transparent)',
                }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* === CONTACT INFO STRIP === */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography variant="h2" sx={{ color: '#3E2723', mb: 1.5 }}>
              همین امروز سر بزنید
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto' }}>
              تفاوت قهوه دست‌ساز و مهمان‌نوازی گرم را تجربه کنید
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {[
              { icon: '📞', title: 'تماس', value: settings?.data?.contact_phone || '09212620316' },
              { icon: '🕒', title: 'ساعات کاری', value: settings?.data?.opening_hours?.split('\n')[0] || '۱۱ صبح تا ۱۰ شب' },
              { icon: '📍', title: 'آدرس', value: settings?.data?.contact_address?.split('،')[0] || 'تهران - شهر قدس' },
            ].map((info, i) => (
              <Grid item xs={12} sm={4} key={i}>
                <Box sx={{ 
                  textAlign: 'center',
                  p: { xs: 3, md: 4 },
                  borderRadius: '16px',
                  border: '1px solid rgba(93,64,55,0.06)',
                  backgroundColor: '#FDFBF7',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: '0 4px 20px rgba(93,64,55,0.08)' },
                }}>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>{info.icon}</Typography>
                  <Typography variant="h6" sx={{ color: '#5D4037', mb: 0.5 }}>
                    {info.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {info.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 6 } }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                <Button variant="contained" sx={{ 
                  px: 4, py: 1.3, backgroundColor: '#5D4037', borderRadius: '10px',
                  '&:hover': { backgroundColor: '#3E2723' },
                }}>
                  موقعیت مکانی
                </Button>
              </Link>
              <Link href="/order" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" sx={{ 
                  px: 4, py: 1.3, borderColor: '#5D4037', color: '#5D4037',
                  borderRadius: '10px', borderWidth: 1.5,
                  '&:hover': { borderWidth: 1.5, backgroundColor: 'rgba(93,64,55,0.04)' },
                }}>
                  سفارش آنلاین
                </Button>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Back to Top */}
      {showBackToTop && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            position: 'fixed',
            bottom: { xs: 20, md: 32 },
            left: { xs: 16, md: 32 },
            minWidth: 44, width: 44, height: 44,
            borderRadius: '12px',
            backgroundColor: '#5D4037',
            color: 'white',
            boxShadow: '0 4px 16px rgba(93,64,55,0.35)',
            zIndex: 1000,
            fontSize: '1.1rem',
            '&:hover': { backgroundColor: '#3E2723' },
            animation: 'fadeIn 0.3s ease',
          }}
        >
          ↑
        </Button>
      )}
    </>
  )
}