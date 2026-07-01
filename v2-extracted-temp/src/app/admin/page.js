'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Alert,
  CircularProgress
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // IMPORTANT: Include cookies
      })
      
      const result = await response.json()
      
      if (response.ok && result.token) {
        console.log('✅ Login successful, storing token...')
        
        // Store token in localStorage (as backup)
        localStorage.setItem('adminToken', result.token)
        localStorage.setItem('adminAuth', 'true')
        localStorage.setItem('lastLogin', new Date().toISOString())
        
        if (result.user?.username) {
          localStorage.setItem('adminName', result.user.username)
        }
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/admin/dashboard')
          router.refresh() // Force refresh to update layout
        }, 100)
        
      } else {
        setError(result.error || 'خطا در ورود. لطفا مجددا تلاش کنید.')
        localStorage.clear()
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('خطا در ارتباط با سرور. لطفا اتصال اینترنت را بررسی کنید.')
      localStorage.clear()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 10, backgroundColor: '#f1e6d6', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 5, borderRadius: 3, backgroundColor: 'white' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <LockIcon sx={{ fontSize: 50, color: '#795548', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ color: '#795548', fontWeight: 700 }}>
            پنل مدیریت کافه کاریبو
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ورود امن به پنل مدیریت
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="نام کاربری"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 3 }}
            autoComplete="username"
            required
            disabled={loading}
            autoFocus
          />
          
          <TextField
            fullWidth
            label="رمز عبور"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            autoComplete="current-password"
            required
            disabled={loading}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !username || !password}
            sx={{
              backgroundColor: '#795548',
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: '#5d4037',
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(121, 85, 72, 0.5)',
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'ورود امن'
            )}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            سیستم احراز هویت امن با رمزنگاری
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            رمز عبور به صورت ایمن ذخیره می‌شود
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}