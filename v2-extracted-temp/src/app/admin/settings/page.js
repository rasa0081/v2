// cafe-website/src/app/admin/settings/page.js
'use client'

import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import SettingsIcon from '@mui/icons-material/Settings'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'کافه کاریبو',
    siteDescription: 'life is short stay awake for it',
    contactPhone: '(123) 456-7890',
    contactEmail: 'hello@brewandbean.com',
    address: 'تهران - شهر قدس بلوار 45 متری انقلاب نبش کوچه توحید -کافه کاریبو',
    openingHours: 'همه روزه ساعت 11 صبح تا 10 شب',
    currency: 'Toman',
    currencySymbol: 'T',
    maintenanceMode: false,
    enableOnlineOrders: false,
    enableReservations: false
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // In production, save to API
    console.log('Saving settings:', settings)
    setSnackbar({
      open: true,
      message: 'تنظیمات با موفقیت ذخیره شد',
      severity: 'success'
    })
  }

  const handleReset = () => {
    if (window.confirm('آیا از بازنشانی تنظیمات اطمینان دارید؟')) {
      setSettings({
        siteName: 'کافه برو اند بین',
        siteDescription: 'کافه مورد علاقه شما در محله',
        contactPhone: '(123) 456-7890',
        contactEmail: 'hello@brewandbean.com',
        address: '123 Coffee Street, Bean City, BC 12345',
        openingHours: 'شنبه تا چهارشنبه: ۷ صبح تا ۹ شب\nپنجشنبه و جمعه: ۸ صبح تا ۱۰ شب',
        currency: 'IRT',
        currencySymbol: 'ت',
        maintenanceMode: false,
        enableOnlineOrders: false,
        enableReservations: false
      })
      setSnackbar({
        open: true,
        message: 'تنظیمات به حالت پیش‌فرض بازگردانی شد',
        severity: 'info'
      })
    }
  }

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#795548', color: 'white', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SettingsIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4">
              تنظیمات سایت
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              مدیریت تنظیمات و پیکربندی سایت
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#795548' }}>
                تنظیمات عمومی
              </Typography>
              
              <TextField
                fullWidth
                label="نام سایت"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="توضیحات سایت"
                multiline
                rows={2}
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="آدرس"
                multiline
                rows={2}
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="تلفن تماس"
                    value={settings.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="ایمیل"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Business Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#795548' }}>
                تنظیمات کسب‌وکار
              </Typography>
              
              <TextField
                fullWidth
                label="ساعات کاری"
                multiline
                rows={4}
                value={settings.openingHours}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                sx={{ mb: 3 }}
                helperText="هر خط یک روز جداگانه"
              />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="واحد پول"
                    value={settings.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="نماد پول"
                    value={settings.currencySymbol}
                    onChange={(e) => handleChange('currencySymbol', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Feature Toggles */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#795548' }}>
                فعال‌سازی ویژگی‌ها
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="حالت تعمیرات (سایت برای کاربران بسته شود)"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableOnlineOrders}
                        onChange={(e) => handleChange('enableOnlineOrders', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="فعال‌سازی سفارش آنلاین"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableReservations}
                        onChange={(e) => handleChange('enableReservations', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="فعال‌سازی رزرو میز"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Danger Zone */}
        <Grid item xs={12}>
          <Card sx={{ border: '2px solid #dc3545' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#dc3545' }}>
                ناحیه خطر
              </Typography>
              
              <Alert severity="warning" sx={{ mb: 2 }}>
                تغییرات در این بخش ممکن است باعث اختلال در عملکرد سایت شود.
              </Alert>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleReset}
                >
                  بازنشانی به تنظیمات پیش‌فرض
                </Button>
                
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    if (window.confirm('آیا از حذف کش سایت اطمینان دارید؟')) {
                      setSnackbar({
                        open: true,
                        message: 'کش سایت پاک شد',
                        severity: 'info'
                      })
                    }
                  }}
                >
                  پاک کردن کش سایت
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleReset}
        >
          انصراف
        </Button>
        
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ backgroundColor: '#795548' }}
        >
          ذخیره تنظیمات
        </Button>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}