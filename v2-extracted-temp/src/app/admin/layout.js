'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton,
  Container,
  CircularProgress,
  Avatar,
  Chip,
  Badge
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AdminNotifications from '@/components/AdminNotifications';
import DashboardIcon from '@mui/icons-material/Dashboard'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import HomeIcon from '@mui/icons-material/Home'
import EmailIcon from '@mui/icons-material/Email'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SecurityIcon from '@mui/icons-material/Security'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import TableBarIcon from '@mui/icons-material/TableBar'

const drawerWidth = 280

const menuItems = [
  { text: 'داشبورد', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'سفارشات', icon: <ShoppingCartIcon />, path: '/admin/orders' },
  { text: 'مدیریت منو', icon: <RestaurantMenuIcon />, path: '/admin/menu' },
  { text: 'مدیریت میزها', icon: <TableBarIcon />, path: '/admin/tables' },
  { text: 'گالری تصاویر', icon: <PhotoLibraryIcon />, path: '/admin/gallery' },
  { text: 'پیام‌ها', icon: <EmailIcon />, path: '/admin/messages' },
  { text: 'اطلاعیه‌ها', icon: <NotificationsIcon />, path: '/admin/notifications' },
  { text: 'تنظیمات', icon: <SettingsIcon />, path: '/admin/settings' },
  { text: 'امنیت', icon: <SecurityIcon />, path: '/admin/security' },
]

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adminName, setAdminName] = useState('مدیر')
  const [lastLogin, setLastLogin] = useState(null)

  // Simple auth check - checks localStorage only
  const checkAuth = () => {
    console.log('🔐 Checking authentication...')
    
    // Skip if we're on the login page
    if (pathname === '/admin') {
      console.log('📍 On login page, skipping auth check')
      setIsAuthenticated(false)
      setLoading(false)
      return false
    }

    const token = localStorage.getItem('adminToken')
    const hasAuth = localStorage.getItem('adminAuth') === 'true'
    
    console.log('💾 Token exists:', !!token)
    console.log('💾 Auth flag:', hasAuth)
    
    if (!token || !hasAuth) {
      console.log('❌ No auth data found')
      setIsAuthenticated(false)
      return false
    }
    
    // Basic token check (optional)
    try {
      const parts = token.split('.')
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]))
        if (payload.username) {
          setAdminName(payload.username)
        }
        // Check expiration
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          console.log('Token expired')
          localStorage.clear()
          setIsAuthenticated(false)
          return false
        }
      }
    } catch (error) {
      console.log('Token parsing error:', error)
    }
    
    console.log('✅ Authentication valid')
    setIsAuthenticated(true)
    
    // Set last login
    const storedLastLogin = localStorage.getItem('lastLogin')
    if (storedLastLogin) {
      setLastLogin(storedLastLogin)
    }
    
    return true
  }

  const clearAuthData = () => {
    console.log('🔄 Clearing auth data...')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('lastLogin')
    localStorage.removeItem('adminName')
    setIsAuthenticated(false)
  }

  // Main authentication effect
  useEffect(() => {
    console.log('🚀 Layout mounted, path:', pathname)
    
    // Always check auth on mount and when path changes
    const authResult = checkAuth()
    
    if (!authResult && pathname !== '/admin') {
      console.log('🔄 Not authenticated, redirecting to login...')
      router.push('/admin')
    }
    
    // Add a small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setLoading(false)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [pathname, router])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    clearAuthData()
    router.push('/admin?message=logout_success')
  }

  // Show loading spinner
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f1e6d6',
        gap: 3
      }}>
        <CircularProgress sx={{ color: '#795548' }} size={60} />
        <Typography variant="h6" color="#795548">
          در حال بارگذاری...
        </Typography>
      </Box>
    )
  }

  // If on login page, show children without layout
  if (pathname === '/admin') {
    return <>{children}</>
  }

  // If not authenticated, show loading (will redirect)
  if (!isAuthenticated) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f1e6d6'
      }}>
        <CircularProgress sx={{ color: '#795548' }} />
        <Typography variant="h6" color="#795548" sx={{ ml: 2 }}>
          در حال انتقال...
        </Typography>
      </Box>
    )
  }

  // ✅ RENDER THE LAYOUT ONLY WHEN AUTHENTICATED
  const drawer = (
    <Box sx={{ 
      backgroundColor: '#f1e6d6', 
      height: '100vh', // Full viewport height
      display: 'flex', 
      flexDirection: 'column',
      overflowY: 'auto', // Enable scrolling for entire sidebar
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'rgba(0,0,0,0.05)',
        borderRadius: '3px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(121, 85, 72, 0.3)',
        borderRadius: '3px',
        '&:hover': {
          background: 'rgba(121, 85, 72, 0.5)',
        }
      }
    }}>
      {/* Admin Profile Section */}
      <Box sx={{ 
        backgroundColor: '#795548',
        color: 'white',
        p: 3,
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0 // Prevent shrinking
      }}>
        <Avatar
          sx={{ 
            width: 70, 
            height: 70, 
            bgcolor: 'white', 
            color: '#795548',
            margin: '0 auto 16px',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          {adminName.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          {adminName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <VerifiedUserIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            مدیر سیستم
          </Typography>
        </Box>
        {lastLogin && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
            آخرین ورود: {new Date(lastLogin).toLocaleTimeString('fa-IR')}
          </Typography>
        )}
        <Chip 
          label="آنلاین" 
          size="small" 
          color="success"
          sx={{ 
            mt: 2,
            backgroundColor: '#4CAF50',
            color: 'white',
            fontWeight: 600,
            '& .MuiChip-label': {
              fontSize: '0.7rem'
            }
          }}
        />
      </Box>
      
      {/* Navigation Menu */}
      <List sx={{ py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path || 
                          (item.path !== '/admin/dashboard' && pathname?.startsWith(item.path))
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => {
                  router.push(item.path)
                  if (mobileOpen) handleDrawerToggle()
                }}
                sx={{ 
                  textAlign: 'right',
                  py: 2.5,
                  pr: 3,
                  pl: 1,
                  borderRight: isActive ? '4px solid #795548' : 'none',
                  backgroundColor: isActive ? 'rgba(121, 85, 72, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(121, 85, 72, 0.05)',
                    transform: 'translateX(-4px)',
                  },
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: isActive ? '4px' : '0px',
                    backgroundColor: '#795548',
                    transition: 'width 0.3s ease'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40, 
                  color: isActive ? '#795548' : 'rgba(0, 0, 0, 0.6)',
                  transition: 'color 0.3s ease'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.95rem',
                    color: isActive ? '#795548' : 'inherit'
                  }}
                />
                {isActive && (
                  <Box sx={{ 
                    position: 'absolute',
                    left: 8,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#795548'
                  }} />
                )}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      
      {/* Bottom Actions */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        flexShrink: 0 // Prevent shrinking
      }}>
        <ListItemButton 
          onClick={() => router.push('/')}
          sx={{ 
            textAlign: 'right', 
            mb: 1.5, 
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(121, 85, 72, 0.08)',
              transform: 'translateX(-2px)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: '#795548' }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText 
            primary="بازگشت به سایت" 
            primaryTypographyProps={{ 
              color: '#795548',
              fontWeight: 500,
              fontSize: '0.9rem'
            }}
          />
        </ListItemButton>
        
        <ListItemButton 
          onClick={handleLogout}
          sx={{ 
            textAlign: 'right', 
            borderRadius: 2, 
            backgroundColor: 'rgba(220, 53, 69, 0.08)',
            border: '1px solid rgba(220, 53, 69, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(220, 53, 69, 0.15)',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              transform: 'translateX(-2px)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: '#dc3545' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="خروج ایمن" 
            primaryTypographyProps={{ 
              color: '#dc3545', 
              fontWeight: 600,
              fontSize: '0.9rem'
            }} 
          />
        </ListItemButton>
        
        {/* Security Status */}
        <Box sx={{ 
          mt: 2, 
          p: 1.5, 
          borderRadius: 2,
          backgroundColor: 'rgba(76, 175, 80, 0.08)',
          border: '1px solid rgba(76, 175, 80, 0.2)',
          textAlign: 'center'
        }}>
          <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 600 }}>
            🔒 سیستم امنیت فعال
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}>
            آخرین بررسی: {new Date().toLocaleTimeString('fa-IR')}
          </Typography>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: '#795548',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          zIndex: 1200
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              backgroundColor: 'rgba(121, 85, 72, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(121, 85, 72, 0.15)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              {menuItems.find(item => item.path === pathname)?.text || 'مدیریت کافه'}
              <Badge 
                color="success" 
                variant="dot" 
                sx={{ 
                  '& .MuiBadge-dot': {
                    backgroundColor: '#4CAF50',
                    width: 8,
                    height: 8,
                    borderRadius: '50%'
                  }
                }}
              />
            </Typography>
            <Typography variant="caption" color="text.secondary">
              پنل مدیریت کافه کاریبو • نسخه ۱.۰
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AdminNotifications />
            <Chip 
              icon={<SecurityIcon sx={{ fontSize: 16 }} />}
              label="حالت امن" 
              size="small"
              sx={{ 
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                color: '#4CAF50',
                fontWeight: 600,
                border: '1px solid rgba(76, 175, 80, 0.3)',
                '& .MuiChip-icon': {
                  color: '#4CAF50',
                  marginRight: '4px'
                }
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Drawer for mobile */}
      <Box
        component="nav"
        sx={{ 
          width: { sm: drawerWidth }, 
          flexShrink: { sm: 0 }
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ 
            keepMounted: true,
            disableScrollLock: false
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderTopRightRadius: 16,
              borderBottomRightRadius: 16,
              boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Permanent drawer for desktop - FIXED POSITION */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: '2px 0 15px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              position: 'fixed',
              height: '100vh',
              top: 0,
              left: 0,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main content - FIXED FOR CENTERING */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }, // Add margin to account for fixed drawer
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f8f9fa',
          minHeight: '100vh'
        }}
      >
        {/* Spacer for fixed AppBar */}
        <Toolbar sx={{ minHeight: '70px !important' }} />
        
        {/* Content container with security indicator - CENTERED */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center', // Center horizontally
            alignItems: 'flex-start', // Align to top
            width: '100%',
            py: 4,
          }}
        >
          <Container 
            maxWidth={false}
            sx={{ 
              flexGrow: 1,
              width: '100%',
              maxWidth: '1400px',
              px: { xs: 2, sm: 3, md: 4 },
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #795548 0%, #8D6E63 50%, #A1887F 100%)',
                borderRadius: '0 0 4px 4px',
                opacity: 0.7
              }
            }}
          >
            {children}
            
            {/* Security footer */}
            <Box sx={{ 
              mt: 4, 
              pt: 2, 
              borderTop: '1px solid rgba(0,0,0,0.06)',
              textAlign: 'center'
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <SecurityIcon sx={{ fontSize: 14 }} />
                دسترسی امن • آخرین فعالیت: {new Date().toLocaleTimeString('fa-IR')}
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  backgroundColor: '#4CAF50',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 }
                  }
                }} />
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}