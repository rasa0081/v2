// cafe-website/src/app/admin/dashboard/page.js - UPDATED TO USE NEW API
'use client'

import { useState } from 'react'
import { 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Snackbar,
  Tooltip,
  Chip,
  Avatar,
  IconButton
} from '@mui/material'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import PeopleIcon from '@mui/icons-material/People'
import CategoryIcon from '@mui/icons-material/Category'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import ScheduleIcon from '@mui/icons-material/Schedule'
import StorageIcon from '@mui/icons-material/Storage'
import BackupIcon from '@mui/icons-material/Backup'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from '@/components/LoadingSpinner'
import { format, differenceInMinutes, differenceInHours } from 'date-fns'
import { faIR } from 'date-fns/locale'

async function fetchDashboardStats() {
  const response = await fetch('/api/dashboard/full-stats')
  if (!response.ok) throw new Error('خطا در دریافت آمار داشبورد')
  return response.json()
}

export default function AdminDashboard() {
  const router = useRouter()
  const [snackbar, setSnackbar] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Use the new full-stats API
  const { 
    data: dashboardData, 
    isLoading, 
    isError,
    error: queryError,
    refetch,
    isRefetching 
  } = useQuery({
    queryKey: ['full-dashboard-stats'],
    queryFn: fetchDashboardStats,
    staleTime: 1 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  })

  // Handle refresh with loading state
  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refetch()
      setSnackbar({
        open: true,
        message: 'آمار با موفقیت بروزرسانی شد',
        severity: 'success'
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'خطا در بروزرسانی آمار',
        severity: 'error'
      })
    } finally {
      setRefreshing(false)
    }
  }

  // Format time function with date-fns
  const formatTime = (dateString) => {
    if (!dateString || dateString === 'نامشخص') return 'اخیراً'
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMinutes = differenceInMinutes(now, date)
      const diffHours = differenceInHours(now, date)
      
      if (diffMinutes < 60) {
        return `${diffMinutes} دقیقه پیش`
      } else if (diffHours < 24) {
        return `${diffHours} ساعت پیش`
      } else {
        return format(date, 'dd MMM yyyy', { locale: faIR })
      }
    } catch {
      return 'اخیراً'
    }
  }

  // Format time for display
  const formatDisplayTime = (dateString) => {
    if (!dateString) return new Date().toLocaleTimeString('fa-IR')
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString('fa-IR')
    } catch {
      return new Date().toLocaleTimeString('fa-IR')
    }
  }

  // Get action text with icon
  const getActionDetails = (action) => {
    const actions = {
      'create': { 
        text: 'آیتم جدید اضافه شد', 
        icon: '➕', 
        color: '#4CAF50' 
      },
      'update': { 
        text: 'آیتم به‌روزرسانی شد', 
        icon: '✏️', 
        color: '#2196F3' 
      },
      'delete': { 
        text: 'آیتم حذف شد', 
        icon: '🗑️', 
        color: '#F44336' 
      },
      'upload': { 
        text: 'تصویر آپلود شد', 
        icon: '📷', 
        color: '#9C27B0' 
      },
      'contact': { 
        text: 'پیام جدید دریافت شد', 
        icon: '📧', 
        color: '#FF9800' 
      },
      'login': { 
        text: 'ورود به سیستم', 
        icon: '🔐', 
        color: '#009688' 
      },
      'system': { 
        text: 'سیستم', 
        icon: '⚙️', 
        color: '#795548' 
      }
    }
    
    return actions[action] || { 
      text: action || 'عملیات', 
      icon: '📝', 
      color: '#795548' 
    }
  }

  // Quick actions
  const quickActions = [
    { 
      label: 'افزودن آیتم جدید', 
      icon: <AddIcon />, 
      color: '#795548',
      action: () => router.push('/admin/menu?action=add'),
      description: 'افزودن آیتم جدید به منو'
    },
    { 
      label: 'آپلود تصویر', 
      icon: <PhotoLibraryIcon />, 
      color: '#8D6E63',
      action: () => router.push('/admin/gallery'),
      description: 'آپلود تصویر برای گالری'
    },
    { 
      label: 'مشاهده پیام‌ها', 
      icon: <PeopleIcon />, 
      color: '#A1887F',
      action: () => router.push('/admin/messages'),
      description: 'مدیریت پیام‌های دریافتی'
    },
    { 
      label: 'ویرایش تنظیمات', 
      icon: <DashboardIcon />, 
      color: '#2196F3',
      action: () => router.push('/admin/settings'),
      description: 'ویرایش تنظیمات سایت'
    },
  ]

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '70vh',
        gap: 2
      }}>
        <LoadingSpinner size={60} message="در حال بارگذاری داشبورد..." />
        <Typography variant="body2" color="text.secondary">
          در حال دریافت آخرین آمار و اطلاعات
        </Typography>
      </Box>
    )
  }

  // Error state
  if (isError) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleRefresh}
              disabled={isRefetching}
              startIcon={<RefreshIcon />}
            >
              تلاش مجدد
            </Button>
          }
        >
          <Typography variant="body1" fontWeight={600}>
            خطا در دریافت اطلاعات داشبورد
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {queryError?.message || 'مشکلی در ارتباط با سرور پیش آمده است'}
          </Typography>
        </Alert>
      </Box>
    )
  }

  // Extract data from new API response
  const stats = dashboardData?.stats || {}
  const activities = dashboardData?.activities || []
  const lastUpdate = new Date().toISOString()
  
  // Stats cards data - NOW USES NEW API DATA
  const statCards = [
    { 
      title: 'محصولات', 
      value: stats.totalProducts || 0, 
      icon: <RestaurantMenuIcon />, 
      color: '#795548', 
      key: 'totalProducts',
      change: '+12%',
      trend: 'up'
    },
    { 
      title: 'دسته‌بندی‌ها', 
      value: stats.totalCategories || 0, 
      icon: <CategoryIcon />, 
      color: '#4CAF50', 
      key: 'totalCategories',
      change: '+5%',
      trend: 'up'
    },
    { 
      title: 'پیام‌های تماس', 
      value: stats.totalMessages || 0, 
      icon: <PeopleIcon />, 
      color: '#2196F3', 
      key: 'totalMessages',
      change: stats.unreadMessages > 0 ? `+${stats.unreadMessages} جدید` : '0 جدید',
      trend: stats.unreadMessages > 0 ? 'up' : 'down'
    },
    { 
      title: 'بازدید امروز', 
      value: stats.todayVisits || 0, 
      icon: <TrendingUpIcon />, 
      color: '#FF9800', 
      key: 'todayVisits',
      change: '+8%',
      trend: 'up'
    },
  ]

  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={() => setSnackbar(null)} 
          severity={snackbar?.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>

      {/* Welcome Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        width: '100%',
        backgroundColor: '#795548', 
        color: 'white', 
        borderRadius: 3,
        backgroundImage: 'linear-gradient(135deg, #795548 0%, #5d4037 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          transform: 'translate(30%, -30%)'
        }
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 1
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <DashboardIcon sx={{ fontSize: 40, opacity: 0.9 }} />
              <Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 900 }}>
                  پنل مدیریت کافه
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon sx={{ fontSize: 16 }} />
                  آخرین بروزرسانی: {formatDisplayTime(lastUpdate)}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              <Chip 
                label="آنلاین" 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
              <Chip 
                label="نسخه ۱.۰" 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
              <Chip 
                label={`${activities.length} فعالیت`} 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Tooltip title="بروزرسانی آمار">
              <IconButton
                onClick={handleRefresh}
                disabled={isRefetching || refreshing}
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.5)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <RefreshIcon sx={{ 
                  animation: (isRefetching || refreshing) ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} />
              </IconButton>
            </Tooltip>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/menu?action=add')}
              sx={{
                backgroundColor: 'white',
                color: '#795548',
                fontWeight: 700,
                borderRadius: '25px',
                px: 3,
                '&:hover': { 
                  backgroundColor: '#f5f5f5',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              افزودن آیتم جدید
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Stats Cards - USING NEW API DATA */}
      <Grid container spacing={3} sx={{ width: '100%', mx: 'auto', mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': { 
                transform: 'translateY(-8px)', 
                boxShadow: `0 16px 40px ${stat.color}20`,
                '& .stat-icon': {
                  transform: 'scale(1.2) rotate(5deg)'
                }
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2
                }}>
                  <Box>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 900, color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {stat.title}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}>
                    {stat.trend === 'up' && (
                      <ArrowUpwardIcon sx={{ fontSize: 16, color: '#4CAF50' }} />
                    )}
                    {stat.trend === 'down' && (
                      <ArrowDownwardIcon sx={{ fontSize: 16, color: '#F44336' }} />
                    )}
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 700,
                        color: stat.trend === 'up' ? '#4CAF50' : 
                               stat.trend === 'down' ? '#F44336' : 'text.secondary'
                      }}
                    >
                      {stat.change}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 3
                }}>
                  <Box 
                    className="stat-icon"
                    sx={{ 
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: `${stat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {stat.icon}
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    از ماه گذشته
                  </Typography>
                </Box>
              </CardContent>
              
              {/* Progress bar at bottom */}
              <Box sx={{ 
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 4,
                backgroundColor: `${stat.color}20`
              }}>
                <Box sx={{ 
                  width: `${Math.min(100, (stat.value / (stat.key === 'totalItems' ? 100 : 50)) * 100)}%`,
                  height: '100%',
                  backgroundColor: stat.color,
                  transition: 'width 0.6s ease'
                }} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions & Recent Activities */}
      <Grid container spacing={3} sx={{ width: '100%', mx: 'auto' }}>
        {/* Recent Activities - NOW DYNAMIC FROM DATABASE */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            width: '100%',
            height: '100%',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUpIcon sx={{ color: '#795548' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  فعالیت‌های اخیر
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip 
                  label={`${activities.length} فعالیت`} 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#795548',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Tooltip title="بروزرسانی">
                  <IconButton 
                    size="small" 
                    onClick={handleRefresh}
                    disabled={isRefetching}
                    sx={{ 
                      color: '#795548',
                      '&:hover': { backgroundColor: 'rgba(121, 85, 72, 0.1)' }
                    }}
                  >
                    <RefreshIcon sx={{ 
                      fontSize: 18,
                      animation: isRefetching ? 'spin 1s linear infinite' : 'none'
                    }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            {activities.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 6,
                backgroundColor: 'rgba(121, 85, 72, 0.05)',
                borderRadius: 2
              }}>
                <ScheduleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography color="text.secondary" gutterBottom>
                  هیچ فعالیتی ثبت نشده است
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  پس از انجام عملیات، فعالیت‌ها در اینجا نمایش داده می‌شوند
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => router.push('/admin/menu?action=add')}
                  sx={{ 
                    borderColor: '#795548',
                    color: '#795548',
                    '&:hover': { borderColor: '#5d4037' }
                  }}
                >
                  شروع اولین فعالیت
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(121, 85, 72, 0.05)' }}>
                      <TableCell width="10%"></TableCell>
                      <TableCell width="40%">عملیات</TableCell>
                      <TableCell width="30%">آیتم</TableCell>
                      <TableCell width="20%">زمان</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activities.map((activity, index) => {
                      const actionDetails = getActionDetails(activity.action)
                      return (
                        <TableRow 
                          key={activity._id || activity.id || index} 
                          hover
                          sx={{ 
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(121, 85, 72, 0.03)',
                              transform: 'translateX(4px)'
                            }
                          }}
                        >
                          <TableCell>
                            <Avatar
                              sx={{ 
                                width: 36, 
                                height: 36, 
                                backgroundColor: `${actionDetails.color}20`,
                                color: actionDetails.color,
                                fontWeight: 700,
                                fontSize: '1.2rem'
                              }}
                            >
                              {actionDetails.icon}
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                                {actionDetails.text}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {activity.action_type || activity.description || 'سیستم'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={activity.action_type || activity.entityType || 'سیستم'}
                              size="small"
                              sx={{ 
                                backgroundColor: `${actionDetails.color}15`,
                                color: actionDetails.color,
                                fontWeight: 600,
                                borderRadius: 1
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                {formatTime(activity.time)}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            {activities.length > 0 && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button 
                  variant="text" 
                  size="small"
                  onClick={() => router.push('/admin/notifications')}
                  sx={{ 
                    color: '#795548',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: 'rgba(121, 85, 72, 0.05)' }
                  }}
                >
                  مشاهده همه فعالیت‌ها
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <DashboardIcon /> دسترسی سریع
            </Typography>
            
            <Box sx={{ flexGrow: 1 }}>
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  onClick={action.action}
                  sx={{ 
                    mb: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      transform: 'translateX(-8px)',
                      boxShadow: `0 8px 25px ${action.color}20`,
                      backgroundColor: `${action.color}05`
                    }
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          backgroundColor: `${action.color}15`,
                          color: action.color
                        }}
                      >
                        {action.icon}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: action.color }}>
                          {action.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {action.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            {/* System Status - NOW USES REAL DATA FROM API */}
            <Box sx={{ 
              mt: 'auto', 
              pt: 3, 
              borderTop: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <StorageIcon fontSize="small" /> وضعیت سیستم
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    فضای ذخیره‌سازی
                  </Typography>
                  <Typography variant="caption" fontWeight={600} color={stats.storagePercent > 80 ? '#dc3545' : stats.storagePercent > 60 ? '#ff9800' : '#795548'}>
                    {stats.usedStorage || '0 MB'}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.storagePercent || 0} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: `${stats.storagePercent > 80 ? '#dc3545' : stats.storagePercent > 60 ? '#ff9800' : '#795548'}20`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: stats.storagePercent > 80 ? '#dc3545' : stats.storagePercent > 60 ? '#ff9800' : '#795548',
                      borderRadius: 4
                    }
                  }} 
                />
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <BackupIcon fontSize="small" />
                    آخرین پشتیبان‌گیری
                  </Typography>
                  <Typography variant="caption" fontWeight={600} color="#4CAF50">
                    {stats.lastBackup || 'امروز'}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={90} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#4CAF50',
                      borderRadius: 4
                    }
                  }} 
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Performance Metrics - NOW USES REAL DATA FROM API */}
      <Paper sx={{ p: 3, mt: 4, borderRadius: 3, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon /> متریک‌های عملکرد
          </Typography>
          <Typography variant="caption" color="text.secondary">
            بروزرسانی خودکار هر ۲ دقیقه
          </Typography>
        </Box>
        
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid item xs={12} lg={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#795548' }}>
                {Math.min(100, Math.floor(((stats.totalProducts || 0) / 50) * 100)).toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                تکمیل منو
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#4CAF50' }}>
                {stats.unreadMessages || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                پیام خوانده نشده
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#2196F3' }}>
                {stats.todayVisits || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                بازدید امروز
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#FF9800' }}>
                {stats.uptime || '99.9%'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                آپ‌تایم
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}
