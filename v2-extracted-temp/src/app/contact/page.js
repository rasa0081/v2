'use client'

import { useState } from 'react'
import { Container, Grid, Typography, Box, TextField, Button, Card, CardContent, Snackbar, Alert } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import ScheduleIcon from '@mui/icons-material/Schedule'

export default function ContactPage() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const e = {}
    if (!formData.firstName.trim()) e.firstName = 'نام الزامی است'
    if (!formData.lastName.trim()) e.lastName = 'نام خانوادگی الزامی است'
    if (!formData.email.trim()) e.email = 'ایمیل الزامی است'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'ایمیل معتبر نیست'
    if (!formData.subject.trim()) e.subject = 'موضوع الزامی است'
    if (!formData.message.trim()) e.message = 'پیام الزامی است'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }
    
    setLoading(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (response.ok) {
        setSnackbar({ open: true, message: 'پیام شما با موفقیت ارسال شد!', severity: 'success' })
        setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' })
        setErrors({})
      } else {
        setSnackbar({ open: true, message: result.error || 'خطا در ارسال پیام', severity: 'error' })
      }
    } catch {
      setSnackbar({ open: true, message: 'خطا در ارتباط با سرور', severity: 'error' })
    } finally { setLoading(false) }
  }

  const contactInfo = [
    { icon: <LocationOnIcon />, title: 'آدرس', value: 'تهران - شهر قدس بلوار 45 متری انقلاب\nنبش کوچه توحید - کافه کاریبو' },
    { icon: <PhoneIcon />, title: 'تلفن', value: '09212620316', dir: 'ltr' },
    { icon: <EmailIcon />, title: 'ایمیل', value: 'info@cariboucafe.ir' },
    { icon: <ScheduleIcon />, title: 'ساعات کاری', value: 'همه روزه ۱۱ صبح الی ۱۰ شب' },
  ]

  return (
    <Box sx={{ backgroundColor: '#FDFBF7', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #5D4037 0%, #3E2723 100%)',
        color: 'white', py: { xs: 5, md: 8 }, textAlign: 'center',
      }}>
        <Container maxWidth="lg">
          <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.8rem', md: '2.8rem' }, mb: 1 }}>
            تماس با ما
          </Typography>
          <Typography sx={{ opacity: 0.7, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            ما مشتاق شنیدن از شما هستیم
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Contact Info */}
          <Grid item xs={12} md={5}>
            <Box sx={{ 
              p: { xs: 3, md: 4 }, borderRadius: '16px',
              backgroundColor: '#fff', border: '1px solid rgba(93,64,55,0.06)',
              height: '100%',
            }}>
              <Typography variant="h4" sx={{ color: '#3E2723', mb: 3, fontWeight: 800 }}>
                اطلاعات تماس
              </Typography>
              
              {contactInfo.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                  <Box sx={{ 
                    width: 40, height: 40, borderRadius: '10px',
                    backgroundColor: 'rgba(93,64,55,0.06)', color: '#5D4037',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, mt: 0.3,
                    '& .MuiSvgIcon-root': { fontSize: 20 },
                  }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#5D4037', mb: 0.3 }}>
                      {item.title}
                    </Typography>
                    <Typography 
                      dir={item.dir || 'rtl'}
                      sx={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.7, textAlign: 'right', whiteSpace: 'pre-line' }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {/* Social */}
              <Box sx={{ pt: 3, borderTop: '1px solid rgba(93,64,55,0.06)' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 1.5, color: '#5D4037' }}>
                  شبکه‌های اجتماعی
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button variant="outlined" size="small" href="https://www.instagram.com/cafecaribou" 
                    target="_blank" sx={{ borderRadius: '8px', borderColor: 'rgba(93,64,55,0.15)', fontSize: '0.8rem' }}>
                    اینستاگرام
                  </Button>
                  <Button variant="outlined" size="small" href="https://telegram.org" 
                    target="_blank" sx={{ borderRadius: '8px', borderColor: 'rgba(93,64,55,0.15)', fontSize: '0.8rem' }}>
                    تلگرام
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
          
          {/* Form */}
          <Grid item xs={12} md={7}>
            <Box sx={{ 
              p: { xs: 3, md: 4 }, borderRadius: '16px',
              backgroundColor: '#fff', border: '1px solid rgba(93,64,55,0.06)',
            }}>
              <Typography variant="h4" sx={{ color: '#3E2723', mb: 1, fontWeight: 800 }}>ارسال پیام</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                سوال، پیشنهاد یا انتقادی دارید؟ با ما در میان بگذارید.
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" label="نام" name="firstName" value={formData.firstName}
                      onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName} required />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth size="small" label="نام خانوادگی" name="lastName" value={formData.lastName}
                      onChange={handleChange} error={!!errors.lastName} helperText={errors.lastName} required />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth size="small" label="ایمیل" name="email" type="email" value={formData.email}
                      onChange={handleChange} error={!!errors.email} helperText={errors.email} required />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth size="small" label="موضوع" name="subject" value={formData.subject}
                      onChange={handleChange} error={!!errors.subject} helperText={errors.subject} required />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="پیام" name="message" multiline rows={4} value={formData.message}
                      onChange={handleChange} error={!!errors.message} helperText={errors.message} required />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" endIcon={<SendIcon />} fullWidth type="submit" disabled={loading}
                      sx={{ 
                        backgroundColor: '#5D4037', py: 1.3, borderRadius: '10px',
                        '&:hover': { backgroundColor: '#3E2723' },
                      }}>
                      {loading ? 'در حال ارسال...' : 'ارسال پیام'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Map */}
        <Box sx={{ mt: { xs: 4, md: 6 } }}>
          <Typography variant="h3" sx={{ color: '#3E2723', mb: 3, textAlign: 'center' }}>
            موقعیت مکانی
          </Typography>
          <Box sx={{ borderRadius: '16px', overflow: 'hidden', height: { xs: 280, md: 400 }, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9293.04313436302!2d51.11748476574076!3d35.71167505973748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8def397af1842d%3A0x9cb75907eaf1a28a!2sCaribo%20Coffee%20shop!5e0!3m2!1sen!2s!4v1766247385272!5m2!1sen!2s"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="Cafe Location" />
          </Box>
        </Box>

        {/* FAQ */}
        <Box sx={{ mt: { xs: 5, md: 8 } }}>
          <Typography variant="h3" sx={{ color: '#3E2723', mb: 3, textAlign: 'center' }}>
            سوالات متداول
          </Typography>
          <Grid container spacing={2}>
            {[
              { q: 'آیا رزرو میز امکان‌پذیر است؟', a: 'بله، برای رزرو میز می‌توانید با شماره تلفن کافه تماس بگیرید.' },
              { q: 'آیا امکان برگزاری مراسم خصوصی وجود دارد؟', a: 'کافه ما فضای مخصوصی برای مراسم و دورهمی‌های خصوصی دارد.' },
              { q: 'آیا پارکینگ در اختیار دارید؟', a: 'بله، پارکینگ خصوصی برای مشتریان در پشت کافه وجود دارد.' },
              { q: 'آیا امکان سفارش آنلاین وجود دارد؟', a: 'سفارش آنلاین به زودی راه‌اندازی خواهد شد.' },
            ].map((faq, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Box sx={{ 
                  p: 3, borderRadius: '14px', height: '100%',
                  backgroundColor: '#fff', border: '1px solid rgba(93,64,55,0.06)',
                }}>
                  <Typography sx={{ fontWeight: 700, color: '#5D4037', mb: 1, fontSize: '0.9rem' }}>{faq.q}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>{faq.a}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}