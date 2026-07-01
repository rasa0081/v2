'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
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
  Alert,
  Snackbar,
  CircularProgress,
  LinearProgress,
  FormControlLabel,
  Switch
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ImageIcon from '@mui/icons-material/Image'
import RefreshIcon from '@mui/icons-material/Refresh'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'

// Category options
const categoryOptions = [
  { value: 'interior', label: 'داخلی کافه' },
  { value: 'coffee', label: 'قهوه و نوشیدنی' },
  { value: 'food', label: 'غذا و شیرینی' },
  { value: 'events', label: 'رویدادها' },
  { value: 'staff', label: 'کارکنان' },
  { value: 'other', label: 'متفرقه' }
]

export default function GalleryManagement() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    thumbnailUrl: '',
    category: 'interior',
    tags: '',
    altText: '',
    sortOrder: 0,
    isActive: true
  })

  const getCategoryLabel = (value) => {
    const category = categoryOptions.find(cat => cat.value === value)
    return category ? category.label : value
  }

  // Fetch gallery data
  const fetchGalleryData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/gallery?active=false')
      if (!response.ok) throw new Error('Failed to fetch gallery data')
      
      const result = await response.json()
      
      if (result.success) {
        setImages(result.data.images || [])
      } else {
        setSnackbar({
          open: true,
          message: result.error || 'خطا در دریافت تصاویر',
          severity: 'error'
        })
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
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
    fetchGalleryData()
  }, [])

  const handleOpenDialog = (image = null) => {
    if (image) {
      setSelectedImage(image)
      setFormData({
        title: image.title,
        description: image.description || '',
        url: image.url,
        thumbnailUrl: image.thumbnailUrl || image.url,
        category: image.category || 'interior',
        tags: image.tags ? image.tags.join(', ') : '',
        altText: image.altText || '',
        sortOrder: image.sortOrder || 0,
        isActive: image.isActive !== undefined ? image.isActive : true
      })
      setPreviewUrl(image.url)
    } else {
      setSelectedImage(null)
      setFormData({
        title: '',
        description: '',
        url: '',
        thumbnailUrl: '',
        category: 'interior',
        tags: '',
        altText: '',
        sortOrder: 0,
        isActive: true
      })
      setPreviewUrl('')
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedImage(null)
    setPreviewUrl('')
    setUploadProgress(0)
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setSnackbar({
        open: true,
        message: 'فرمت فایل مجاز نیست. فقط JPG, PNG, WebP, GIF قابل قبول است.',
        severity: 'error'
      })
      return
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      setSnackbar({
        open: true,
        message: `حجم فایل نباید بیشتر از ۱۰ مگابایت باشد. حجم فعلی: ${fileSizeMB}MB`,
        severity: 'error'
      })
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target.result)
      setFormData(prev => ({ ...prev, url: e.target.result }))
    }
    reader.readAsDataURL(file)

    // Automatically upload
    uploadImage(file)
  }

  // Upload image to server
  const uploadImage = async (file) => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(10)

    // Simulate progress
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
      const formData = new FormData()
      formData.append('image', file)
      formData.append('type', 'gallery')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await response.json()

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          url: result.data.url,
          thumbnailUrl: result.data.url
        }))
        
        setSnackbar({
          open: true,
          message: `تصویر با موفقیت آپلود شد (${result.data.dimensions})`,
          severity: 'success'
        })
        
        // Clear progress after success
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
        setPreviewUrl('')
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
      setPreviewUrl('')
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ 
      ...prev, 
      url: '',
      thumbnailUrl: ''
    }))
    setPreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    // Validate form
    if (!formData.title) {
      setSnackbar({
        open: true,
        message: 'عنوان تصویر الزامی است',
        severity: 'error'
      })
      return
    }

    if (!formData.url) {
      setSnackbar({
        open: true,
        message: 'لطفا تصویر را آپلود کنید',
        severity: 'error'
      })
      return
    }

    // Prepare data for API
    const imageData = {
      title: formData.title,
      description: formData.description,
      url: formData.url,
      thumbnailUrl: formData.thumbnailUrl || formData.url,
      category: formData.category,
      tags: formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [],
      altText: formData.altText || formData.title,
      sortOrder: parseInt(formData.sortOrder) || 0,
      isActive: formData.isActive
    }

    try {
      let response
      
      if (selectedImage) {
        // Update existing image
        response = await fetch('/api/gallery', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selectedImage._id,
            ...imageData
          })
        })
      } else {
        // Create new image
        response = await fetch('/api/gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(imageData)
        })
      }

      const result = await response.json()

      if (response.ok) {
        setSnackbar({
          open: true,
          message: selectedImage ? 'تصویر با موفقیت به‌روزرسانی شد' : 'تصویر جدید با موفقیت اضافه شد',
          severity: 'success'
        })
        
        // Refresh data
        fetchGalleryData()
        handleCloseDialog()
      } else {
        setSnackbar({
          open: true,
          message: result.error || 'خطا در ذخیره‌سازی',
          severity: 'error'
        })
      }
    } catch (error) {
      console.error('Error saving image:', error)
      setSnackbar({
        open: true,
        message: 'خطا در ارتباط با سرور',
        severity: 'error'
      })
    }
  }

  const handleDelete = async (imageId) => {
    if (!window.confirm('آیا از حذف این تصویر اطمینان دارید؟')) {
      return
    }

    try {
      const response = await fetch(`/api/gallery?id=${imageId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'تصویر با موفقیت حذف شد',
          severity: 'success'
        })
        
        // Refresh data
        fetchGalleryData()
      } else {
        setSnackbar({
          open: true,
          message: result.error || 'خطا در حذف تصویر',
          severity: 'error'
        })
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      setSnackbar({
        open: true,
        message: 'خطا در ارتباط با سرور',
        severity: 'error'
      })
    }
  }

  const handleToggleActive = async (imageId, currentStatus) => {
    try {
      const response = await fetch('/api/gallery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: imageId,
          isActive: !currentStatus
        })
      })

      if (response.ok) {
        setSnackbar({
          open: true,
          message: `تصویر ${!currentStatus ? 'فعال' : 'غیرفعال'} شد`,
          severity: 'success'
        })
        
        // Refresh data
        fetchGalleryData()
      }
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

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
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#795548', color: 'white', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">
            مدیریت گالری تصاویر
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: 'white',
              color: '#795548',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            افزودن تصویر جدید
          </Button>
        </Box>
      </Paper>

      {/* Actions Bar */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchGalleryData}
          disabled={loading}
        >
          بروزرسانی
        </Button>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Typography variant="body2" color="text.secondary">
          {images.length} تصویر
        </Typography>
      </Paper>

      {/* Image Grid */}
      <Grid container spacing={3}>
        {images.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ 
              textAlign: 'center', 
              py: 6, 
              color: 'text.secondary',
              border: '2px dashed #e0e0e0',
              borderRadius: 3
            }}>
              <ImageIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                هنوز تصویری اضافه نشده است
              </Typography>
              <Typography variant="body2" paragraph>
                اولین تصویر گالری را اضافه کنید
              </Typography>
              <Button 
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ 
                  backgroundColor: '#795548',
                  '&:hover': {
                    backgroundColor: '#5d4037'
                  }
                }}
              >
                افزودن اولین تصویر
              </Button>
            </Paper>
          </Grid>
        ) : (
          images.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image._id}>
              <Card sx={{ 
                height: '100%',
                position: 'relative',
                opacity: image.isActive === false ? 0.7 : 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                }
              }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={image.url}
                  alt={image.altText || image.title}
                  sx={{ 
                    objectFit: 'cover',
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
                      {image.title}
                    </Typography>
                    <Chip 
                      label={getCategoryLabel(image.category)} 
                      size="small"
                      sx={{ 
                        backgroundColor: '#795548', 
                        color: 'white',
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                    {image.description || 'بدون توضیحات'}
                  </Typography>
                  
                  {image.tags && image.tags.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        برچسب‌ها:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {image.tags.slice(0, 3).map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                        {image.tags.length > 3 && (
                          <Chip
                            label={`+${image.tags.length - 3}`}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={image.isActive}
                            onChange={() => handleToggleActive(image._id, image.isActive)}
                          />
                        }
                        label={image.isActive ? 'فعال' : 'غیرفعال'}
                        sx={{ m: 0 }}
                      />
                    </Box>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog(image)}
                        title="ویرایش"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(image._id)} 
                        color="error"
                        title="حذف"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {selectedImage ? 'ویرایش تصویر' : 'افزودن تصویر جدید'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="عنوان تصویر *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                required
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
              />
            </Grid>

            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CloudUploadIcon /> آپلود تصویر
                </Typography>
                
                {/* Upload Area */}
                <Box
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    border: '2px dashed #ddd',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9',
                    cursor: 'pointer',
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: '#795548',
                      backgroundColor: 'rgba(121, 85, 72, 0.05)'
                    }
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  
                  {isUploading ? (
                    <>
                      <CircularProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        sx={{ mb: 2, color: '#795548' }} 
                        size={60}
                      />
                      <Typography variant="body2">
                        در حال آپلود... {uploadProgress}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        sx={{ width: '80%', mt: 2, borderRadius: 5 }}
                      />
                    </>
                  ) : previewUrl ? (
                    <>
                      <Box sx={{ position: 'relative', width: '100%' }}>
                        <img
                          src={previewUrl}
                          alt="Preview"
                          style={{
                            width: '100%',
                            maxHeight: 300,
                            objectFit: 'contain',
                            borderRadius: 8
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveImage()
                          }}
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
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </>
                  ) : (
                    <>
                      <CloudUploadIcon sx={{ fontSize: 50, color: '#999', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        برای آپلود تصویر کلیک کنید یا فایل را اینجا بکشید
                      </Typography>
                      <Typography variant="caption" color="text.secondary" paragraph>
                        فرمت‌های مجاز: JPG, PNG, WebP, GIF | حداکثر حجم: 10MB
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation()
                          fileInputRef.current?.click()
                        }}
                      >
                        انتخاب فایل
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>دسته‌بندی</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="دسته‌بندی"
                >
                  {categoryOptions.map((option) => (
                    <MuiMenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ترتیب نمایش"
                name="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="برچسب‌ها"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                placeholder="برچسب‌ها را با کاما جدا کنید (مثال: کافه, قهوه, دنج)"
                helperText="برای جدا کردن برچسب‌ها از کاما استفاده کنید"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="متن جایگزین (Alt Text)"
                name="altText"
                value={formData.altText}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                placeholder="توضیح تصویر برای موتورهای جستجو"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                }
                label="فعال"
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>لغو</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.url || isUploading}
            sx={{ 
              backgroundColor: '#795548',
              '&:hover': {
                backgroundColor: '#5d4037'
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(121, 85, 72, 0.5)'
              }
            }}
          >
            {selectedImage ? 'ذخیره تغییرات' : 'افزودن'}
          </Button>
        </DialogActions>
      </Dialog>

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