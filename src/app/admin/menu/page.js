// cafe-website/src/app/admin/menu/page.js - COMPLETE WITH NEW CATEGORIES
'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem as MuiMenuItem,
  FormControl,
  InputLabel,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'

// Import icons for categories
import WhatshotIcon from '@mui/icons-material/Whatshot' // گرم
import AcUnitIcon from '@mui/icons-material/AcUnit' // سرد
import LocalBarIcon from '@mui/icons-material/LocalBar' // چای/نوشیدنی
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu' // میان وعده
import CakeIcon from '@mui/icons-material/Cake' // کیک
import LocalCafeIcon from '@mui/icons-material/LocalCafe' // اسپرسو
import LocalDrinkIcon from '@mui/icons-material/LocalDrink' // نوشیدنی

// New Category Options
const categoryOptions = [
  { value: 'espresso-hot', label: 'نوشیدنی گرم پایه اسپرسو' },
  { value: 'espresso-cold', label: 'نوشیدنی سرد پایه اسپرسو' },
  { value: 'tea', label: 'چای و دمنوش' },
  { value: 'cold-drinks', label: 'نوشیدنی سرد' },
  { value: 'snacks', label: 'میان وعده' },
  { value: 'smoothies', label: 'اسموتی' },
  { value: 'shakes', label: 'شیک' },
  { value: 'syrups', label: 'شربت' },
  { value: 'cakes', label: 'کیک' }
]

// Category Icons with different colors
const categoryIcons = {
  'espresso-hot': <WhatshotIcon sx={{ color: '#d32f2f' }} />,
  'espresso-cold': <AcUnitIcon sx={{ color: '#1976d2' }} />,
  'tea': <LocalBarIcon sx={{ color: '#388e3c' }} />,
  'cold-drinks': <LocalDrinkIcon sx={{ color: '#0288d1' }} />,
  'snacks': <RestaurantMenuIcon sx={{ color: '#f57c00' }} />,
  'smoothies': <LocalBarIcon sx={{ color: '#7b1fa2' }} />,
  'shakes': <LocalBarIcon sx={{ color: '#c2185b' }} />,
  'syrups': <LocalDrinkIcon sx={{ color: '#00796b' }} />,
  'cakes': <CakeIcon sx={{ color: '#5d4037' }} />
}

// Category colors for badges and backgrounds
const categoryColors = {
  'espresso-hot': '#d32f2f',
  'espresso-cold': '#1976d2',
  'tea': '#388e3c',
  'cold-drinks': '#0288d1',
  'snacks': '#f57c00',
  'smoothies': '#7b1fa2',
  'shakes': '#c2185b',
  'syrups': '#00796b',
  'cakes': '#5d4037'
}

// Image Guidelines Component
function ImageGuidelines() {
  return (
    <Paper sx={{ p: 3, mb: 3, backgroundColor: 'rgba(121, 85, 72, 0.05)', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#795548', display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon /> راهنمای تصاویر منو
      </Typography>
      
      <List dense sx={{ mb: 1 }}>
        <ListItem sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <CheckCircleIcon sx={{ fontSize: 18, color: '#4CAF50' }} />
          </ListItemIcon>
          <ListItemText 
            primary="ابعاد استاندارد: 400×300 پیکسل (نسبت 4:3)"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </ListItem>
        
        <ListItem sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <CheckCircleIcon sx={{ fontSize: 18, color: '#4CAF50' }} />
          </ListItemIcon>
          <ListItemText 
            primary="فرمت‌های مجاز: JPG، PNG، WebP"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </ListItem>
        
        <ListItem sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <CheckCircleIcon sx={{ fontSize: 18, color: '#4CAF50' }} />
          </ListItemIcon>
          <ListItemText 
            primary="حداکثر حجم: 10 مگابایت"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </ListItem>
        
        <ListItem sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <CheckCircleIcon sx={{ fontSize: 18, color: '#4CAF50' }} />
          </ListItemIcon>
          <ListItemText 
            primary="تصاویر به صورت خودکار پردازش و بهینه می‌شوند"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </ListItem>
      </List>
      
      <Typography variant="caption" color="text.secondary">
        نکته: تصاویر بزرگ به ابعاد استاندارد برش و تغییر اندازه داده می‌شوند
      </Typography>
    </Paper>
  )
}

export default function MenuManagement() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  })
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'espresso-hot', // Default to first category
    popular: false,
    ingredients: '',
    calories: '',
    image: '/menu-images/default-item.jpg',
    imageFile: null,
    available: true
  })

  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Fetch menu data from API
  const fetchMenuData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/menu')
      const result = await response.json()
      
      if (result.success) {
        setCategories(result.data.categories || [])
      } else {
        setSnackbar({
          open: true,
          message: result.error || 'خطا در دریافت اطلاعات منو',
          severity: 'error'
        })
      }
    } catch (error) {
      console.error('Error fetching menu:', error)
      setSnackbar({
        open: true,
        message: 'خطا در ارتباط با سرور',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenuData()
  }, [])

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        popular: item.popular || false,
        ingredients: item.ingredients?.join(', ') || '',
        calories: item.calories?.toString() || '',
        image: item.image || '/menu-images/default-item.jpg',
        imageFile: null,
        available: item.available !== undefined ? item.available : true
      })
    } else {
      setEditingItem(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'espresso-hot',
        popular: false,
        ingredients: '',
        calories: '',
        image: '/menu-images/default-item.jpg',
        imageFile: null,
        available: true
      })
    }
    setOpenDialog(true)
    setUploadProgress(0)
    setIsUploading(false)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingItem(null)
    setUploadProgress(0)
    setIsUploading(false)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const validateImageBeforeUpload = (file) => {
    const errors = []
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      errors.push('فرمت فایل مجاز نیست. فقط JPG, PNG, WebP قابل قبول است.')
    }
    
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      errors.push(`حجم فایل (${fileSizeMB}MB) نباید بیشتر از ۱۰ مگابایت باشد.`)
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const validation = validateImageBeforeUpload(file)
    if (!validation.isValid) {
      setSnackbar({
        open: true,
        message: validation.errors.join(' '),
        severity: 'error'
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(10)
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('image', file)
      formDataToSend.append('type', 'menu')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataToSend
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await response.json()

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          image: result.data.url,
          imageFile: file
        }))
        
        setSnackbar({
          open: true,
          message: `تصویر با موفقیت آپلود شد (${result.data.sizeMB}MB, ${result.data.dimensions})`,
          severity: 'success'
        })
        
        setTimeout(() => {
          setUploadProgress(0)
          setIsUploading(false)
        }, 1000)
      } else {
        setSnackbar({
          open: true,
          message: result.error || 'خطا در آپلود تصویر',
          severity: 'error'
        })
        setUploadProgress(0)
        setIsUploading(false)
      }
    } catch (error) {
      console.error('Upload error:', error)
      clearInterval(progressInterval)
      setSnackbar({
        open: true,
        message: 'خطا در ارتباط با سرور',
        severity: 'error'
      })
      setUploadProgress(0)
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ 
      ...prev, 
      image: '/menu-images/default-item.jpg',
      imageFile: null 
    }))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      setSnackbar({
        open: true,
        message: 'لطفا نام، قیمت و دسته‌بندی را وارد کنید',
        severity: 'error'
      })
      return
    }

    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      popular: formData.popular,
      ingredients: formData.ingredients 
        ? formData.ingredients.split(',').map(i => i.trim()).filter(i => i) 
        : [],
      calories: formData.calories ? parseInt(formData.calories) : null,
      image: formData.image,
      available: formData.available
    }

    try {
      let response
      
      if (editingItem) {
        response = await fetch('/api/menu', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingItem._id,
            ...itemData
          })
        })
      } else {
        response = await fetch('/api/menu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData)
        })
      }

      const result = await response.json()

      if (response.ok) {
        setSnackbar({
          open: true,
          message: editingItem ? 'آیتم با موفقیت به‌روزرسانی شد' : 'آیتم جدید با موفقیت اضافه شد',
          severity: 'success'
        })
        
        fetchMenuData()
        handleCloseDialog()
      } else {
        setSnackbar({
          open: true,
          message: result.error || 'خطا در ذخیره‌سازی',
          severity: 'error'
        })
      }
    } catch (error) {
      console.error('Error saving item:', error)
      setSnackbar({
        open: true,
        message: 'خطا در ارتباط با سرور',
        severity: 'error'
      })
    }
  }

  const handleDelete = async (itemId) => {
    if (!window.confirm('آیا از حذف این آیتم اطمینان دارید؟')) {
      return
    }

    try {
      const response = await fetch(`/api/menu?id=${itemId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'آیتم با موفقیت حذف شد',
          severity: 'success'
        })
        
        fetchMenuData()
      } else {
        setSnackbar({
          open: true,
          message: result.error || 'خطا در حذف آیتم',
          severity: 'error'
        })
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      setSnackbar({
        open: true,
        message: 'خطا در ارتباط با سرور',
        severity: 'error'
      })
    }
  }

  const handleToggleAvailability = async (itemId, currentStatus) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: itemId,
          available: !currentStatus
        })
      })

      if (response.ok) {
        setSnackbar({
          open: true,
          message: `آیتم ${!currentStatus ? 'فعال' : 'غیرفعال'} شد`,
          severity: 'success'
        })
        
        fetchMenuData()
      }
    } catch (error) {
      console.error('Error toggling availability:', error)
    }
  }

  const totalItems = categories.reduce((total, cat) => total + (cat.items?.length || 0), 0)
  const totalPopular = categories.reduce((total, cat) => 
    total + (cat.items?.filter(item => item.popular).length || 0), 0
  )

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <CircularProgress sx={{ color: '#795548' }} />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ 
        p: 3, 
        mb: 4, 
        backgroundColor: '#795548', 
        color: 'white', 
        borderRadius: 3 
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Box>
            <Typography variant="h4">
              مدیریت منو
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              مجموع آیتم‌ها: {totalItems} | پرفروش: {totalPopular}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchMenuData}
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white'
                }
              }}
            >
              به‌روزرسانی
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                backgroundColor: 'white',
                color: '#795548',
                '&:hover': { 
                  backgroundColor: '#f5f5f5' 
                }
              }}
            >
              افزودن آیتم جدید
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Statistics Cards - One for each category */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {categoryOptions.map((categoryOption) => {
          const category = categories.find(cat => cat.id === categoryOption.value)
          const itemCount = category?.items?.length || 0
          const categoryColor = categoryColors[categoryOption.value] || '#795548'
          
          return (
            <Grid item xs={12} sm={6} md={4} key={categoryOption.value}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 3,
                backgroundColor: `${categoryColor}10`,
                border: `2px solid ${categoryColor}30`,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${categoryColor}20`
                }
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 2 
                }}>
                  <Box sx={{ 
                    width: 50, 
                    height: 50, 
                    borderRadius: '50%', 
                    backgroundColor: `${categoryColor}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: categoryColor
                  }}>
                    {categoryIcons[categoryOption.value] || <LocalCafeIcon />}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: categoryColor }}>
                      {categoryOption.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {itemCount} آیتم
                    </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, category: categoryOption.value }))
                    handleOpenDialog()
                  }}
                  sx={{ 
                    borderColor: categoryColor,
                    color: categoryColor,
                    '&:hover': {
                      borderColor: categoryColor,
                      backgroundColor: `${categoryColor}10`
                    }
                  }}
                >
                  افزودن آیتم
                </Button>
              </Paper>
            </Grid>
          )
        })}
      </Grid>

      {/* Categories List */}
      {categories.map((category) => {
        const categoryColor = categoryColors[category.id] || '#795548'
        
        return (
          <Paper key={category.id} sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: 3,
            border: `2px solid ${categoryColor}20`,
            backgroundColor: `${categoryColor}05`
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              mb: 3 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  backgroundColor: `${categoryColor}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: categoryColor
                }}>
                  {categoryIcons[category.id] || <LocalCafeIcon />}
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600, 
                    color: categoryColor 
                  }}>
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label={`${category.items?.length || 0} آیتم`} 
                sx={{ 
                  backgroundColor: categoryColor, 
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Box>
            
            {!category.items || category.items.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 6, 
                color: 'text.secondary',
                border: `2px dashed ${categoryColor}30`,
                borderRadius: 2,
                backgroundColor: `${categoryColor}05`
              }}>
                <Typography variant="h6" gutterBottom>
                  هنوز آیتمی در این دسته وجود ندارد
                </Typography>
                <Typography variant="body2" paragraph>
                  اولین آیتم این دسته را اضافه کنید
                </Typography>
                <Button 
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, category: category.id }))
                    handleOpenDialog()
                  }}
                  sx={{ 
                    backgroundColor: categoryColor,
                    '&:hover': {
                      backgroundColor: categoryColor,
                      opacity: 0.9
                    }
                  }}
                >
                  افزودن اولین آیتم
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {category.items.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <Card sx={{ 
                      height: '100%', 
                      position: 'relative',
                      opacity: item.available === false ? 0.7 : 1,
                      transition: 'all 0.3s ease',
                      border: `1px solid ${categoryColor}20`,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 25px ${categoryColor}15`
                      }
                    }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.image || '/menu-images/default-item.jpg'}
                        alt={item.name}
                        sx={{ 
                          objectFit: 'cover',
                          objectPosition: 'center',
                          width: '100%',
                          aspectRatio: '4/3'
                        }}
                      />
                      <CardContent>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          mb: 1 
                        }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                            ${item.price}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {item.description}
                        </Typography>
                        
                        {item.ingredients && item.ingredients.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              مواد: {item.ingredients.join('، ')}
                            </Typography>
                          </Box>
                        )}
                        
                        {item.calories && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                            🔥 {item.calories} کالری
                          </Typography>
                        )}
                        
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          mt: 'auto' 
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {item.popular && (
                              <Chip 
                                label="پرفروش" 
                                size="small" 
                                sx={{ 
                                  backgroundColor: categoryColor, 
                                  color: 'white',
                                  fontSize: '0.7rem'
                                }}
                              />
                            )}
                            {!item.available && (
                              <Chip 
                                label="غیرفعال" 
                                size="small" 
                                color="error"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                          <Box>
                            <IconButton 
                              size="small" 
                              onClick={() => handleToggleAvailability(item._id, item.available)}
                              color={item.available ? 'default' : 'success'}
                              title={item.available ? 'غیرفعال کردن' : 'فعال کردن'}
                            >
                              {item.available ? '🔴' : '🟢'}
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenDialog(item)}
                              title="ویرایش"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDelete(item._id)} 
                              color="error"
                              title="حذف"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        )
      })}

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ backgroundColor: '#795548', color: 'white' }}>
          {editingItem ? 'ویرایش آیتم' : 'افزودن آیتم جدید'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <ImageGuidelines />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="نام آیتم *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="قیمت (T) *"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                required
                inputProps={{ 
                  step: "0.01", 
                  min: "0",
                  placeholder: "مثال: 4.50"
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="توضیحات"
                name="description"
                multiline
                rows={2}
                value={formData.description}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                placeholder="توضیح کوتاه درباره آیتم"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>دسته‌بندی *</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="دسته‌بندی *"
                  required
                >
                  {categoryOptions.map((option) => (
                    <MuiMenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 20, 
                          height: 20, 
                          color: categoryColors[option.value] || '#795548',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {categoryIcons[option.value]}
                        </Box>
                        {option.label}
                      </Box>
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="کالری"
                name="calories"
                type="number"
                value={formData.calories}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                placeholder="اختیاری"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="مواد تشکیل دهنده"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                placeholder="مواد را با کاما جدا کنید (مثال: شیر, شکر, قهوه)"
                helperText="برای جدا کردن مواد از کاما استفاده کنید"
              />
            </Grid>

            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CloudUploadIcon /> تصویر آیتم
                  <Typography component="span" variant="caption" color="text.secondary">
                    (400×300 پیکسل)
                  </Typography>
                </Typography>
                
                {/* Image Preview */}
                <Box sx={{ 
                  mb: 2, 
                  position: 'relative',
                  border: '2px dashed #ddd',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9',
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: '4/3',
                  overflow: 'hidden'
                }}>
                  {isUploading ? (
                    <>
                      <CircularProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        sx={{ mb: 2, color: '#795548' }} 
                        size={60}
                      />
                      <Typography variant="body2">
                        در حال آپلود و پردازش تصویر... {uploadProgress}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        sx={{ width: '80%', mt: 2, borderRadius: 5 }}
                      />
                    </>
                  ) : formData.image && formData.image !== '/menu-images/default-item.jpg' ? (
                    <>
                      <Box sx={{ 
                        position: 'relative', 
                        width: '100%',
                        height: '100%'
                      }}>
                        <img
                          src={formData.image}
                          alt="Preview"
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            borderRadius: 8
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={handleRemoveImage}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: 1,
                            '&:hover': { 
                              backgroundColor: 'white',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <DeleteForeverIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        {formData.imageFile?.name || 'تصویر پردازش شده'}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CloudUploadIcon sx={{ fontSize: 50, color: '#999', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        تصویر آیتم را اینجا بکشید یا کلیک کنید
                      </Typography>
                      <Typography variant="caption" color="text.secondary" paragraph>
                        تصویر به ابعاد استاندارد پردازش می‌شود
                      </Typography>
                    </>
                  )}
                  
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    disabled={isUploading}
                    sx={{ 
                      mt: 1,
                      borderColor: '#795548',
                      color: '#795548',
                      '&:hover': {
                        borderColor: '#5d4037',
                        backgroundColor: 'rgba(121, 85, 72, 0.05)'
                      }
                    }}
                  >
                    {formData.image !== '/menu-images/default-item.jpg' ? 'تغییر تصویر' : 'آپلود تصویر'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>
                </Box>
                
                <TextField
                  fullWidth
                  label="آدرس تصویر"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  sx={{ mb: 1 }}
                  placeholder="/menu-items/filename.jpg"
                  helperText="می‌توانید آدرس تصویر را مستقیماً وارد کنید یا با دکمه بالا آپلود کنید"
                />
                
                <Typography variant="caption" color="text.secondary">
                  فرمت‌های مجاز: JPG, PNG, WebP | حداکثر حجم: 10MB
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="popular"
                    checked={formData.popular}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="پرفروش"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="فعال"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ 
              color: '#795548', 
              borderColor: '#795548',
              '&:hover': {
                borderColor: '#5d4037',
                backgroundColor: 'rgba(121, 85, 72, 0.05)'
              }
            }}
          >
            لغو
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={isUploading}
            sx={{ 
              backgroundColor: '#795548',
              px: 4,
              '&:hover': {
                backgroundColor: '#5d4037'
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(121, 85, 72, 0.5)',
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          >
            {editingItem ? 'ذخیره تغییرات' : 'افزودن آیتم'}
          </Button>
        </DialogActions>
      </Dialog>

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