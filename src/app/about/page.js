'use client'

import { Container, Grid, Typography, Box, Paper } from '@mui/material'
import StorefrontIcon from '@mui/icons-material/Storefront'
import GroupsIcon from '@mui/icons-material/Groups'
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'
import FavoriteIcon from '@mui/icons-material/Favorite'
import NatureIcon from '@mui/icons-material/Nature'

export default function AboutPage() {
  return (
    <Box sx={{ backgroundColor: '#FDFBF7', minHeight: '100vh' }}>
      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, #5D4037 0%, #3E2723 100%)',
        color: 'white',
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 250, height: 250, borderRadius: '50%', backgroundColor: 'rgba(212,165,116,0.06)' }} />
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Box sx={{ 
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 72, height: 72, borderRadius: '50%',
              backgroundColor: 'rgba(212,165,116,0.15)', mb: 3,
            }}>
              <LocalCafeIcon sx={{ fontSize: 36, color: '#D4A574' }} />
            </Box>
            <Typography sx={{ fontWeight: 900, fontSize: { xs: '2rem', md: '3rem' }, mb: 1.5 }}>
              داستان ما
            </Typography>
            <Typography sx={{ opacity: 0.75, maxWidth: 400, mx: 'auto', fontWeight: 300 }}>
              از طبیعت تا فنجان قهوه
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Story */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 10 } }}>
        <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ 
              p: { xs: 3, md: 5 }, backgroundColor: 'white',
              border: '1px solid rgba(93,64,55,0.06)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{ 
                  width: 42, height: 42, borderRadius: '10px',
                  backgroundColor: '#5D4037', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <NatureIcon sx={{ color: '#D4A574', fontSize: 22 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#5D4037' }}>آغاز داستان</Typography>
              </Box>
              <Typography sx={{ lineHeight: 2.2, fontSize: { xs: '0.9rem', md: '1rem' }, color: '#555', textAlign: 'justify' }}>
                داستان کاریبو از قدم زدن در طبیعت شروع شد 
                طبیعتی که جادوی زیبایی اش مارو درگیر خودش کرد حالا چطور این اتفاق افتاد ؟
                پیاده روی تنها کنار دشت های سرسبز فلات ایران؛
                آرامش و نظم محسور کننده محیط مارو به این فکر انداخت که این تجربه عمیقو با طعم دلنشین قهوه ترکیب کنیم . 
                کاریبو تبدیل به جایی شد که از هیاهو و شلوغی بیرون فرار کنیم .
                امروزه کاریبو به مکانی تبدیل شد که افراد جلسات کاری و عاشقانه و دوستانه خود را با فنجانی قهوه شریک میشوند .
                در کاریبو هر کس نه تنها یک مشتری بلکه عضوی از خانواده کاریبو میشود.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              position: 'relative', height: { xs: 260, md: 420 },
              borderRadius: '20px', overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(93,64,55,0.15)',
            }}>
              <Box component="img" src="/about-image.jpg" alt="کافه کاریبو"
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <Box sx={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
                background: 'linear-gradient(to top, rgba(62,39,35,0.7), transparent)',
              }} />
              <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20, color: 'white' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>کافه کاریبو</Typography>
                <Typography sx={{ opacity: 0.8, fontSize: '0.8rem' }}>جایی برای آرامش و لذت</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features */}
      <Box sx={{ backgroundColor: 'white', py: { xs: 5, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 7 } }}>
            <Typography variant="h2" sx={{ color: '#3E2723', mb: 1.5 }}>چرا کاریبو؟</Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
              ویژگی‌هایی که ما را متمایز می‌کند
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 4 }}>
            {[
              { icon: <StorefrontIcon sx={{ fontSize: 32 }} />, title: 'حمایت از جامعه محلی', description: 'ما از هنرمندان و تامین‌کنندگان محلی حمایت می‌کنیم.', color: '#5D4037' },
              { icon: <GroupsIcon sx={{ fontSize: 32 }} />, title: 'تیم متخصص', description: 'باریستاهای ما متخصصان آموزش‌دیده‌ای هستند که عاشق قهوه هستند.', color: '#8B6F61' },
              { icon: <EmojiFoodBeverageIcon sx={{ fontSize: 32 }} />, title: 'مواد اولیه با کیفیت', description: 'همه چیز با مواد اولیه تازه و با کیفیت بالا تهیه شده است.', color: '#D4A574' },
            ].map((f, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper elevation={0} sx={{ 
                  p: { xs: 3, md: 4 }, height: '100%', textAlign: 'center',
                  backgroundColor: '#FDFBF7', border: '1px solid rgba(93,64,55,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: '0 8px 30px rgba(93,64,55,0.08)', backgroundColor: 'white' },
                }}>
                  <Box sx={{ 
                    width: 64, height: 64, borderRadius: '50%',
                    backgroundColor: `${f.color}0D`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', color: f.color,
                  }}>
                    {f.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: f.color }}>{f.title}</Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.9, fontSize: '0.9rem' }}>{f.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Values + Stats */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 10 } }}>
        <Paper elevation={0} sx={{
          p: { xs: 4, md: 6 }, textAlign: 'center',
          background: 'linear-gradient(135deg, #5D4037 0%, #3E2723 100%)', color: 'white',
        }}>
          <FavoriteIcon sx={{ fontSize: 36, mb: 2, color: '#D4A574' }} />
          <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.5rem', md: '2.2rem' }, mb: 2.5 }}>
            ارزش‌های ما
          </Typography>
          <Typography sx={{ maxWidth: 600, mx: 'auto', opacity: 0.8, lineHeight: 2, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            در کاریبو، ما باور داریم هر فنجان قهوه باید داستانی را روایت کند. 
            شما برای ما فقط یک مشتری نیستید، بلکه عضوی از خانواده کاریبو هستید.
          </Typography>
          <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mt: 4 }}>
            {[
              { number: '۵۰+', label: 'نوع نوشیدنی' },
              { number: '۱۰۰۰+', label: 'مشتری راضی' },
              { number: '۳', label: 'سال تجربه' },
              { number: '۲۴/۷', label: 'پشتیبانی' },
            ].map((stat, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Typography sx={{ fontWeight: 900, fontSize: { xs: '2rem', md: '2.8rem' }, color: '#D4A574' }}>
                  {stat.number}
                </Typography>
                <Typography sx={{ opacity: 0.65, fontSize: '0.85rem' }}>{stat.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  )
}