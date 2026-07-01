// cafe-website/src/components/AdminNotifications.js
'use client'

import { useState, useEffect } from 'react'
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import EmailIcon from '@mui/icons-material/Email'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useRouter } from 'next/navigation'

export default function AdminNotifications() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications?unread=true&limit=10')
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.data.notifications || [])
        setUnreadCount(data.data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.read) {
      try {
        await fetch('/api/admin/notifications', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: notification._id })
        })
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'contact':
        router.push('/admin/messages')
        break
      case 'order':
        // router.push('/admin/orders')
        break
      default:
        break
    }

    handleClose()
  }

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      // Update local state
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'contact': return <EmailIcon fontSize="small" />
      case 'order': return <RestaurantMenuIcon fontSize="small" />
      case 'alert': return <WarningIcon fontSize="small" />
      default: return <CheckCircleIcon fontSize="small" />
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return 'الان'
    
    const date = new Date(dateString)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'الان'
    }
    
    const now = new Date()
    const diffMs = Math.abs(now - date) // Use absolute value
    const diffMins = Math.floor(diffMs / 60000)
    
    // If date is in the future, show it as future time
    if (date > now) {
      return date.toLocaleDateString('fa-IR')
    }
    
    if (diffMins < 60) {
      return `${diffMins} دقیقه قبل`
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)} ساعت قبل`
    } else {
      return date.toLocaleDateString('fa-IR')
    }
  }

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ position: 'relative' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 360, maxHeight: 480 }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="h6">اطلاعیه‌ها</Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllAsRead}
              sx={{ mt: 1 }}
            >
              علامت‌گذاری همه به عنوان خوانده شده
            </Button>
          )}
        </Box>

        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="هیچ اطلاعیه جدیدی وجود ندارد" 
                secondary="همه چیز به روز است!"
              />
            </ListItem>
          ) : (
            notifications.slice(0, 10).map((notification, index) => (
              <MenuItem 
                key={notification._id || notification.id || `notification-${index}`}
                onClick={() => handleNotificationClick(notification)}
                sx={{ 
                  borderBottom: '1px solid #f5f5f5',
                  backgroundColor: notification.read ? 'inherit' : 'rgba(25, 118, 210, 0.04)'
                }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                        {notification.title}
                      </Typography>
                      <Chip 
                        label={formatTime(notification.createdAt || notification.created_at)} 
                        size="small" 
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {notification.message}
                    </Typography>
                  }
                />
              </MenuItem>
            ))
          )}
        </List>

        {notifications.length > 0 && (
          <Box sx={{ p: 2, borderTop: '1px solid #eee', textAlign: 'center' }}>
            <Button 
              size="small" 
              fullWidth
              onClick={() => {
                router.push('/admin/notifications')
                handleClose()
              }}
            >
              مشاهده همه اطلاعیه‌ها
            </Button>
          </Box>
        )}
      </Menu>
    </>
  )
}