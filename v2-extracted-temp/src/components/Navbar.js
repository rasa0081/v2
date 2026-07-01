'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  AppBar, Toolbar, Typography, Button, Box, Container,
  IconButton, Drawer, List, ListItem, Badge,
  useTheme, useMediaQuery
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import HomeIcon from '@mui/icons-material/Home'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import InfoIcon from '@mui/icons-material/Info'
import PhoneIcon from '@mui/icons-material/Phone'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useCart } from '@/context/CartContext'

const navItems = [
  { label: 'خانه', path: '/', icon: <HomeIcon /> },
  { label: 'منو', path: '/menu', icon: <RestaurantMenuIcon /> },
  { label: 'درباره ما', path: '/about', icon: <InfoIcon /> },
  { label: 'تماس با ما', path: '/contact', icon: <PhoneIcon /> },
  { label: 'گالری', path: '/gallery', icon: <PhotoLibraryIcon /> },
]

export default function Navbar() {
  const theme = useTheme()
  const pathname = usePathname()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const isHomePage = pathname === '/'
  const { totalItems } = useCart()

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (path) => path === '/' ? pathname === path : pathname.startsWith(path)
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  const isTransparent = isHomePage && !scrolled
  const navBg = isTransparent ? 'rgba(255,255,255,0)' : 'rgba(253,251,247,0.85)'
  const navShadow = isTransparent ? 'none' : '0 1px 12px rgba(0,0,0,0.06)'
  const textColor = isTransparent ? '#fff' : theme.palette.text.primary
  const logoColor = isTransparent ? '#fff' : theme.palette.primary.main

  return (
    <>
      <AppBar 
        position="fixed" elevation={0}
        sx={{ 
          backgroundColor: navBg,
          backdropFilter: isTransparent ? 'none' : 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: isTransparent ? 'none' : 'blur(20px) saturate(180%)',
          boxShadow: navShadow,
          borderBottom: isTransparent ? 'none' : '1px solid rgba(93,64,55,0.06)',
          transition: 'all 0.35s ease',
          color: textColor,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            justifyContent: 'space-between', 
            py: { xs: 0.5, md: 0.25 },
            minHeight: { xs: 60, md: 68 },
            px: { xs: 0, md: 1 },
          }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
                <Box sx={{ width: { xs: 40, md: 44 }, height: { xs: 40, md: 44 }, overflow: 'hidden', flexShrink: 0 }}>
                  <img src="/logo.png" alt="Caribou Cafe" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: logoColor, fontSize: '1.05rem', lineHeight: 1.2, transition: 'color 0.3s ease' }}>
                    Caribou Cafe
                  </Typography>
                  <Typography variant="caption" sx={{ color: isTransparent ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary, fontSize: '0.65rem', letterSpacing: '1px', textTransform: 'uppercase', transition: 'color 0.3s ease' }}>
                    Stay Awake For It
                  </Typography>
                </Box>
              </Box>
            </Link>

            {/* Right side: nav + cart */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
              {/* Desktop Nav */}
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {navItems.map((item) => {
                    const active = isActive(item.path)
                    return (
                      <Link key={item.label} href={item.path} style={{ textDecoration: 'none' }}>
                        <Button size="small" sx={{
                          color: active ? (isTransparent ? '#fff' : theme.palette.primary.main) : textColor,
                          backgroundColor: active ? (isTransparent ? 'rgba(255,255,255,0.15)' : theme.palette.action.selected) : 'transparent',
                          fontWeight: active ? 700 : 500, px: 2, py: 0.8, fontSize: '0.85rem', borderRadius: '8px',
                          transition: 'all 0.25s ease',
                          '&:hover': { backgroundColor: isTransparent ? 'rgba(255,255,255,0.12)' : theme.palette.action.hover },
                        }}>
                          {item.label}
                        </Button>
                      </Link>
                    )
                  })}
                </Box>
              )}

              {/* Cart Button */}
              <Link href="/order" style={{ textDecoration: 'none' }}>
                <IconButton sx={{
                  color: totalItems > 0 ? (isTransparent ? '#D4A574' : theme.palette.primary.main) : textColor,
                  transition: 'color 0.3s ease',
                  position: 'relative',
                }}>
                  <Badge 
                    badgeContent={totalItems} 
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        backgroundColor: '#D4A574', color: '#3E2723',
                        fontWeight: 800, fontSize: '0.65rem',
                        minWidth: 18, height: 18,
                      } 
                    }}
                  >
                    <ShoppingCartIcon sx={{ fontSize: 22 }} />
                  </Badge>
                </IconButton>
              </Link>

              {/* Mobile Hamburger */}
              {isMobile && (
                <IconButton onClick={handleDrawerToggle} sx={{ color: textColor, transition: 'color 0.3s ease' }}>
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 280, backgroundColor: '#FDFBF7', borderTopRightRadius: 24, borderBottomRightRadius: 24 } }}>
        <Box sx={{ py: 2, px: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, pb: 2, borderBottom: '1px solid rgba(93,64,55,0.08)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 40, height: 40, overflow: 'hidden' }}>
                <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: theme.palette.primary.main }}>Caribou Cafe</Typography>
                <Typography sx={{ fontSize: '0.65rem', color: theme.palette.text.secondary }}>کافه کاریبو</Typography>
              </Box>
            </Box>
            <IconButton onClick={handleDrawerToggle} size="small"><CloseIcon fontSize="small" /></IconButton>
          </Box>

          <List sx={{ flex: 1, pt: 1 }}>
            {[...navItems, { label: `سبد خرید ${totalItems > 0 ? `(${totalItems})` : ''}`, path: '/order', icon: <ShoppingCartIcon /> }].map((item) => {
              const active = isActive(item.path)
              return (
                <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                  <Link href={item.path} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }} onClick={handleDrawerToggle}>
                    <Box sx={{
                      display: 'flex', alignItems: 'center', gap: 2,
                      px: 2, py: 1.5, borderRadius: '12px',
                      backgroundColor: active ? 'rgba(93,64,55,0.08)' : 'transparent',
                      '&:active': { backgroundColor: 'rgba(93,64,55,0.12)', transform: 'scale(0.98)' },
                    }}>
                      <Box sx={{ color: active ? theme.palette.primary.main : theme.palette.text.secondary, display: 'flex', '& .MuiSvgIcon-root': { fontSize: 20 } }}>
                        {item.path === '/order' && totalItems > 0 ? (
                          <Badge badgeContent={totalItems} sx={{ '& .MuiBadge-badge': { backgroundColor: '#D4A574', color: '#3E2723', fontSize: '0.6rem', minWidth: 16, height: 16 } }}>
                            {item.icon}
                          </Badge>
                        ) : item.icon}
                      </Box>
                      <Typography sx={{ fontWeight: active ? 700 : 500, fontSize: '0.95rem', color: active ? theme.palette.primary.main : theme.palette.text.primary }}>
                        {item.label}
                      </Typography>
                    </Box>
                  </Link>
                </ListItem>
              )
            })}
          </List>

          <Box sx={{ pt: 2, borderTop: '1px solid rgba(93,64,55,0.08)', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Life is short, stay awake for it ☕</Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}