'use client'

import { useState, useEffect } from 'react'
import { 
  Container, Typography, Box, Grid, Card, CardContent,
  Chip, Alert, Snackbar, Button, Select,
  MenuItem, FormControl, InputLabel, Paper, useTheme
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import LocalBarIcon from '@mui/icons-material/LocalBar'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import CakeIcon from '@mui/icons-material/Cake'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'
import LocalDrinkIcon from '@mui/icons-material/LocalDrink'
import StarIcon from '@mui/icons-material/Star'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import CheckIcon from '@mui/icons-material/Check'
import Link from 'next/link'
import { useMenuData } from '@/hooks/useMenuData'
import LoadingSpinner from '@/components/LoadingSpinner'
import { MenuItemSkeleton } from '@/components/SkeletonLoader'
import ImageWithFallback from '@/components/ImageWithFallback'
import { useCart } from '@/context/CartContext'

const allCategories = [
  { id: 'espresso-hot', title: 'نوشیدنی گرم پایه اسپرسو', icon: <WhatshotIcon />, color: '#C62828' },
  { id: 'espresso-cold', title: 'نوشیدنی سرد پایه اسپرسو', icon: <AcUnitIcon />, color: '#1565C0' },
  { id: 'tea', title: 'چای و دمنوش', icon: <LocalBarIcon />, color: '#2E7D32' },
  { id: 'cold-drinks', title: 'نوشیدنی سرد', icon: <LocalDrinkIcon />, color: '#0277BD' },
  { id: 'snacks', title: 'میان وعده', icon: <RestaurantMenuIcon />, color: '#E65100' },
  { id: 'smoothies', title: 'اسموتی', icon: <LocalBarIcon />, color: '#6A1B9A' },
  { id: 'shakes', title: 'شیک', icon: <LocalBarIcon />, color: '#AD1457' },
  { id: 'syrups', title: 'شربت', icon: <LocalDrinkIcon />, color: '#00695C' },
  { id: 'cakes', title: 'کیک', icon: <CakeIcon />, color: '#4E342E' },
]

export default function MenuPage() {
  const theme = useTheme()
  const { addItem, items: cartItems } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showOnlyPopular, setShowOnlyPopular] = useState(false)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [addedId, setAddedId] = useState(null)
  const { data: menuData, isLoading, isError, error: queryError, refetch, isRefetching } = useMenuData()

  useEffect(() => {
    if (isError && queryError) setError(queryError.message || 'خطا در دریافت اطلاعات منو')
    else if (!isError) setError(null)
  }, [isError, queryError])

  const handleRefresh = async () => {
    setRefreshing(true)
    try { await refetch() } catch (err) { setError(err?.message || 'خطا') } 
    finally { setRefreshing(false) }
  }

  const handleAddToCart = (item) => {
    addItem({ id: item._id, name: item.name, price: item.price, image: item.image })
    setAddedId(item._id)
    setTimeout(() => setAddedId(null), 1200)
  }

  const getCartQuantity = (itemId) => {
    const found = cartItems.find(i => i.id === itemId)
    return found ? found.quantity : 0
  }

  const filteredCategories = (menuData?.data?.categories || []).filter(c => 
    selectedCategory === 'all' || c.id === selectedCategory
  )

  const totalItems = (menuData?.data?.categories || []).reduce((t, c) => t + (c.items?.length || 0), 0)
  const totalPopular = (menuData?.data?.categories || []).reduce((t, c) => 
    t + (c.items?.filter(i => i.popular)?.length || 0), 0)
  
  const formatPrice = (price) => `${price.toLocaleString()} ت`

  const hasAnyItems = filteredCategories.some(c => {
    const items = showOnlyPopular ? c.items?.filter(i => i.popular) : c.items
    return items && items.length > 0
  })

  if (isLoading && !menuData) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h1" gutterBottom>منوی کافه</Typography>
          <LoadingSpinner message="در حال بارگذاری منو..." />
        </Box>
        <MenuItemSkeleton count={6} />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, sm: 3 } }}>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" onClose={() => setError(null)}
          action={<Button color="inherit" size="small" onClick={handleRefresh} disabled={refreshing}>تلاش مجدد</Button>}>
          {error}
        </Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography variant="h1" gutterBottom sx={{ color: '#3E2723' }}>منوی کافه</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>انتخاب از میان ۹ دسته‌بندی متنوع</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mt: 2 }}>
          <Chip size="small" icon={<LocalCafeIcon sx={{ fontSize: 16 }} />} label={`${totalItems} آیتم`} variant="outlined" />
          <Chip size="small" icon={<StarIcon sx={{ fontSize: 16 }} />} label={`${totalPopular} پرفروش`} color="primary" variant="outlined" />
          {(isRefetching || refreshing) && <Chip size="small" icon={<RefreshIcon sx={{ fontSize: 16 }} />} label="بروزرسانی..." color="info" variant="outlined" />}
        </Box>
      </Box>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: { xs: 3, md: 4 }, border: '1px solid rgba(93,64,55,0.06)', backgroundColor: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <FilterListIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>فیلترها</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="text" size="small" startIcon={<RefreshIcon sx={{ fontSize: 16 }} />} 
            onClick={handleRefresh} disabled={isRefetching || refreshing} sx={{ minWidth: 'auto', fontSize: '0.8rem' }}>
            {isRefetching || refreshing ? '...' : 'بروزرسانی'}
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>دسته‌بندی</InputLabel>
              <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} label="دسته‌بندی" disabled={isRefetching}>
                <MenuItem value="all">همه دسته‌بندی‌ها</MenuItem>
                {allCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: cat.color, display: 'flex', '& .MuiSvgIcon-root': { fontSize: 18 } }}>{cat.icon}</Box>
                      <Typography sx={{ fontSize: '0.85rem' }}>{cat.title}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button fullWidth variant={showOnlyPopular ? 'contained' : 'outlined'}
              startIcon={<StarIcon sx={{ fontSize: 18 }} />} onClick={() => setShowOnlyPopular(!showOnlyPopular)}
              sx={{ height: 40, borderRadius: '10px', fontSize: '0.85rem',
                ...(showOnlyPopular ? { backgroundColor: '#D4A574', color: '#3E2723', '&:hover': { backgroundColor: '#E8C9A0' } } 
                  : { borderColor: 'rgba(93,64,55,0.2)', color: theme.palette.text.secondary }) }}>
              فقط پرفروش‌ها ({totalPopular})
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Menu Items */}
      {!hasAnyItems ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <LocalCafeIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
          <Typography variant="h5" color="text.secondary">آیتمی یافت نشد</Typography>
        </Box>
      ) : (
        filteredCategories.map((category) => {
          const items = showOnlyPopular ? category.items?.filter(i => i.popular) : category.items
          if (!items || items.length === 0) return null
          const catMeta = allCategories.find(c => c.id === category.id)
          const catColor = catMeta?.color || theme.palette.primary.main

          return (
            <Box key={category.id} sx={{ mb: { xs: 4, md: 6 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 2, md: 3 } }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: `${catColor}12`, color: catColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', '& .MuiSvgIcon-root': { fontSize: 20 } }}>
                  {catMeta?.icon}
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#3E2723', fontSize: { xs: '1.05rem', md: '1.2rem' } }}>{category.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{items.length} آیتم</Typography>
                </Box>
              </Box>

              <Grid container spacing={{ xs: 1.5, md: 2.5 }}>
                {items.map((item) => {
                  const inCart = getCartQuantity(item._id)
                  const justAdded = addedId === item._id

                  return (
                    <Grid item xs={6} sm={4} md={3} key={item._id}>
                      <Card elevation={0} sx={{ 
                        height: '100%', display: 'flex', flexDirection: 'column',
                        border: inCart > 0 ? `1.5px solid ${catColor}40` : '1px solid rgba(0,0,0,0.04)',
                        overflow: 'hidden', opacity: item.available ? 1 : 0.55,
                        transition: 'all 0.25s ease',
                        '&:hover': { boxShadow: '0 6px 24px rgba(0,0,0,0.08)', transform: { md: 'translateY(-2px)' } },
                      }}>
                        <Box sx={{ position: 'relative', height: { xs: 120, sm: 150, md: 170 }, overflow: 'hidden' }}>
                          <ImageWithFallback src={item.image} alt={item.name} width={300} height={170}
                            fallbackSrc="/menu-images/default-item.jpg"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <Box sx={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: '8px', px: 1.2, py: 0.4 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.78rem', color: catColor }}>{formatPrice(item.price)}</Typography>
                          </Box>
                          {item.popular && (
                            <Box sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#D4A574', color: '#3E2723', fontWeight: 700, fontSize: '0.62rem', px: 1, py: 0.3, borderRadius: '6px' }}>پرفروش</Box>
                          )}
                          {!item.available && (
                            <Box sx={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(200,30,30,0.85)', color: '#fff', fontWeight: 600, fontSize: '0.62rem', px: 1, py: 0.3, borderRadius: '6px' }}>ناموجود</Box>
                          )}
                          {inCart > 0 && (
                            <Box sx={{ position: 'absolute', top: 8, left: 8, backgroundColor: catColor, color: '#fff', fontWeight: 800, fontSize: '0.65rem', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {inCart}
                            </Box>
                          )}
                        </Box>
                        
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 1.5, md: 2 }, '&:last-child': { pb: { xs: 1.5, md: 2 } } }}>
                          <Typography sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5, fontSize: { xs: '0.82rem', md: '0.92rem' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.name}
                          </Typography>
                          <Typography sx={{ color: '#888', fontSize: { xs: '0.7rem', md: '0.78rem' }, lineHeight: 1.6, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {item.description}
                          </Typography>
                          
                          {/* Add to cart button */}
                          <Button
                            size="small"
                            disabled={!item.available}
                            onClick={() => handleAddToCart(item)}
                            startIcon={justAdded ? <CheckIcon sx={{ fontSize: 14 }} /> : <AddShoppingCartIcon sx={{ fontSize: 14 }} />}
                            sx={{
                              mt: 1.5, borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700,
                              py: 0.6, minHeight: 32,
                              backgroundColor: justAdded ? '#4CAF50' : `${catColor}0D`,
                              color: justAdded ? '#fff' : catColor,
                              transition: 'all 0.2s ease',
                              '&:hover': { backgroundColor: justAdded ? '#43A047' : `${catColor}1A` },
                              '&.Mui-disabled': { color: '#bbb', backgroundColor: '#f5f5f5' },
                            }}
                          >
                            {!item.available ? 'ناموجود' : justAdded ? 'اضافه شد' : inCart > 0 ? `افزودن (${inCart})` : 'افزودن به سبد'}
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
            </Box>
          )
        })
      )}
    </Container>
  )
}