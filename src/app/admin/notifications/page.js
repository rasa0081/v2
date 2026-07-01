'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import WarningIcon from '@mui/icons-material/Warning'
import NotificationsIcon from '@mui/icons-material/Notifications'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState('all')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const url = `/api/admin/notifications?type=${filter}&limit=${rowsPerPage}&page=${page + 1}`
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.data.notifications || [])
        setTotal(data.data.total || 0)
      } else {
        setSnackbar({
          open: true,
          message: data.error || 'خطا در دریافت اطلاعیه‌ها',
          severity: 'error'
        })
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
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
    fetchNotifications()
  }, [page, rowsPerPage, filter])

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: notificationId })
      })
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'اطلاعیه به عنوان خوانده شده علامت‌گذاری شد',
          severity: 'success'
        })
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'تمامی اطلاعیه‌ها به عنوان خوانده شده علامت‌گذاری شدند',
          severity: 'success'
        })
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const handleDelete = async (notificationId) => {
    try {
      const response = await fetch('/api/admin/notifications?id=' + notificationId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'اطلاعیه با موفقیت حذف شد',
          severity: 'success'
        })
        fetchNotifications()
      } else {
        const data = await response.json()
        setSnackbar({
          open: true,
          message: data.error || 'خطا در حذف اطلاعیه',
          severity: 'error'
        })
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      setSnackbar({
        open: true,
        message: 'خطا در حذف اطلاعیه',
        severity: 'error'
      })
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setPage(0)
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'contact': return <EmailIcon fontSize="small" />
      case 'order': return <RestaurantMenuIcon fontSize="small" />
      case 'alert': return <WarningIcon fontSize="small" />
      default: return <NotificationsIcon fontSize="small" />
    }
  }

  const getTypeText = (type) => {
    switch (type) {
      case 'contact': return 'تماس'
      case 'order': return 'سفارش'
      case 'system': return 'سیستم'
      case 'alert': return 'هشدار'
      default: return type
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) {
      return `${diffMins} دقیقه قبل`
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)} ساعت قبل`
    } else {
      return date.toLocaleDateString('fa-IR')
    }
  }

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#795548', color: 'white', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <NotificationsIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4">
                مدیریت اطلاعیه‌ها
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                مشاهده و مدیریت تمامی اطلاعیه‌های سیستم
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchNotifications}
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white'
                }
              }}
            >
              بروزرسانی
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={handleMarkAllAsRead}
              sx={{
                backgroundColor: 'white',
                color: '#795548',
                '&:hover': { 
                  backgroundColor: '#f5f5f5' 
                }
              }}
            >
              علامت‌گذاری همه به عنوان خوانده شده
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Filter Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            فیلتر اطلاعیه‌ها
          </Typography>
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>نوع اطلاعیه</InputLabel>
            <Select
              value={filter}
              onChange={handleFilterChange}
              label="نوع اطلاعیه"
            >
              <MenuItem value="all">همه</MenuItem>
              <MenuItem value="contact">تماس</MenuItem>
              <MenuItem value="system">سیستم</MenuItem>
              <MenuItem value="alert">هشدار</MenuItem>
              <MenuItem value="unread">خوانده نشده</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Notifications Table */}
      <Paper sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell width="60px"></TableCell>
                <TableCell>عنوان</TableCell>
                <TableCell>پیام</TableCell>
                <TableCell>نوع</TableCell>
                <TableCell>وضعیت</TableCell>
                <TableCell>زمان</TableCell>
                <TableCell>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow key="loading">
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress sx={{ color: '#795548' }} />
                  </TableCell>
                </TableRow>
              ) : notifications.length === 0 ? (
                <TableRow key="empty">
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      هیچ اطلاعیه‌ای یافت نشد
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((notification) => (
                  <TableRow 
                    key={notification._id || notification.id} 
                    hover
                    sx={{ 
                      backgroundColor: notification.read ? 'inherit' : 'rgba(25, 118, 210, 0.04)'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        {getNotificationIcon(notification.type)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={notification.read ? 400 : 600}>
                        {notification.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getTypeText(notification.type)} 
                        size="small"
                        color={notification.type === 'alert' ? 'error' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={notification.read ? 'خوانده شده' : 'جدید'} 
                        size="small"
                        color={notification.read ? 'default' : 'primary'}
                      />
                    </TableCell>
                    <TableCell>
                      {formatTime(notification.createdAt)}
                    </TableCell>
                    <TableCell>
                      {!notification.read && (
                        <IconButton 
                          size="small" 
                          onClick={() => handleMarkAsRead(notification._id)}
                          title="علامت‌گذاری به عنوان خوانده شده"
                        >
                          <CheckIcon />
                        </IconButton>
                      )}
                      <IconButton 
                        size="small" 
                        color="error"
                        title="حذف"
                        onClick={() => {
                          if (window.confirm('آیا از حذف این اطلاعیه اطمینان دارید؟')) {
                            handleDelete(notification._id || notification.id)
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="تعداد در هر صفحه:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} از ${count}`
          }
        />
      </Paper>

      {/* Stats */}
      <Paper sx={{ p: 3, mt: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          آمار اطلاعیه‌ها
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 2 }}>
          <Paper sx={{ p: 2, minWidth: 150, textAlign: 'center', backgroundColor: 'rgba(121, 85, 72, 0.1)' }}>
            <Typography variant="h4">{total}</Typography>
            <Typography variant="body2">کل اطلاعیه‌ها</Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 150, textAlign: 'center', backgroundColor: 'rgba(25, 118, 210, 0.1)' }}>
            <Typography variant="h4">
              {notifications.filter(n => !n.read).length}
            </Typography>
            <Typography variant="body2">خوانده نشده</Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 150, textAlign: 'center', backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
            <Typography variant="h4">
              {notifications.filter(n => n.type === 'contact').length}
            </Typography>
            <Typography variant="body2">تماس</Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 150, textAlign: 'center', backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
            <Typography variant="h4">
              {notifications.filter(n => n.type === 'system').length}
            </Typography>
            <Typography variant="body2">سیستم</Typography>
          </Paper>
        </Box>
      </Paper>

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