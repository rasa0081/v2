'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box, Typography, Paper, Chip, Button, Grid, IconButton,
  Dialog, DialogTitle, DialogContent, Table, TableBody,
  TableCell, TableRow, Alert, CircularProgress, Badge, Collapse
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import PhoneIcon from '@mui/icons-material/Phone'
import TableBarIcon from '@mui/icons-material/TableBar'

const STATUS_CONFIG = {
  pending: { label: 'در انتظار', color: '#FF9800', bg: '#FFF3E0', icon: <AccessTimeIcon sx={{ fontSize: 16 }} /> },
  preparing: { label: 'در حال آماده‌سازی', color: '#2196F3', bg: '#E3F2FD', icon: <LocalCafeIcon sx={{ fontSize: 16 }} /> },
  ready: { label: 'آماده تحویل', color: '#4CAF50', bg: '#E8F5E9', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
  delivered: { label: 'تحویل داده شده', color: '#9E9E9E', bg: '#F5F5F5', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
  cancelled: { label: 'لغو شده', color: '#F44336', bg: '#FFEBEE', icon: <CancelIcon sx={{ fontSize: 16 }} /> },
}

const NEXT_STATUS = { pending: 'preparing', preparing: 'ready', ready: 'delivered' }

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLive, setIsLive] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [newOrderAlert, setNewOrderAlert] = useState(false)
  const prevOrderCount = useRef(0)
  const audioRef = useRef(null)
  const eventSourceRef = useRef(null)

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

  // Fetch orders manually
  const fetchOrders = useCallback(async () => {
    try {
      const token = getToken()
      if (!token) return
      
      const res = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setOrders(data.data.orders)
        setStats(data.data.stats)
        setLastUpdate(new Date())
        setError(null)
      }
    } catch (err) {
      setError('خطا در دریافت سفارشات')
    } finally { setLoading(false) }
  }, [])

  // SSE connection for live updates
  useEffect(() => {
    // Initial fetch
    fetchOrders()

    // Start SSE
    const startSSE = () => {
      if (eventSourceRef.current) eventSourceRef.current.close()

      const es = new EventSource('/api/admin/orders/stream')
      eventSourceRef.current = es

      es.onopen = () => { setIsLive(true) }

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'orders_update') {
            // Check for new orders
            if (prevOrderCount.current > 0 && data.stats.total > prevOrderCount.current) {
              setNewOrderAlert(true)
              // Try to play sound
              try {
                const audio = new Audio('data:audio/wav;base64,UklGRl9vT19teleXyEABAAB...')
                audio.volume = 0.3
                audio.play().catch(() => {})
              } catch {}
              setTimeout(() => setNewOrderAlert(false), 5000)
            }
            prevOrderCount.current = data.stats.total

            setOrders(data.orders)
            setStats(data.stats)
            setLastUpdate(new Date())
            setError(null)
          } else if (data.type === 'heartbeat') {
            setStats(data.stats)
            setLastUpdate(new Date())
          }
        } catch {}
      }

      es.onerror = () => {
        setIsLive(false)
        es.close()
        // Reconnect after 5 seconds
        setTimeout(startSSE, 5000)
      }
    }

    startSSE()

    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close()
    }
  }, [fetchOrders])

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = getToken()
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        // Update locally
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        fetchOrders() // Refresh for accurate data
      }
    } catch { setError('خطا در بروزرسانی') }
  }

  const formatTime = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })
  }

  const formatPrice = (price) => `${Number(price).toLocaleString()} ت`

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: '#5D4037' }} />
      </Box>
    )
  }

  return (
    <Box>
      {/* New Order Alert */}
      {newOrderAlert && (
        <Alert 
          severity="info" 
          icon={<NotificationsActiveIcon />}
          sx={{ 
            mb: 3, borderRadius: '12px',
            animation: 'pulse 1s ease-in-out 3',
            '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.7 } },
            backgroundColor: '#FFF3E0', color: '#E65100', border: '1px solid #FFB74D',
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>سفارش جدید دریافت شد! 🎉</Typography>
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: '#3E2723' }}>
            سفارشات
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <FiberManualRecordIcon sx={{ fontSize: 10, color: isLive ? '#4CAF50' : '#F44336' }} />
            <Typography variant="caption" color="text.secondary">
              {isLive ? 'زنده' : 'آفلاین'} 
              {lastUpdate && ` • آخرین بروزرسانی: ${formatTime(lastUpdate)}`}
            </Typography>
          </Box>
        </Box>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchOrders} size="small"
          sx={{ borderRadius: '8px', borderColor: 'rgba(93,64,55,0.2)' }}>
          بروزرسانی
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'در انتظار', count: stats.pending || 0, color: '#FF9800', bg: '#FFF3E0' },
          { label: 'در حال آماده‌سازی', count: stats.preparing || 0, color: '#2196F3', bg: '#E3F2FD' },
          { label: 'آماده تحویل', count: stats.ready || 0, color: '#4CAF50', bg: '#E8F5E9' },
          { label: 'سفارش امروز', count: stats.today_count || 0, color: '#5D4037', bg: '#EFEBE9', extra: stats.today_revenue ? formatPrice(stats.today_revenue) : null },
        ].map((s, i) => (
          <Grid item xs={6} sm={3} key={i}>
            <Paper elevation={0} sx={{ p: 2, textAlign: 'center', backgroundColor: s.bg, border: `1px solid ${s.color}20`, borderRadius: '12px' }}>
              <Typography sx={{ fontWeight: 900, fontSize: '1.8rem', color: s.color }}>{s.count}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: s.color, fontWeight: 600 }}>{s.label}</Typography>
              {s.extra && <Typography sx={{ fontSize: '0.7rem', color: s.color, mt: 0.5, opacity: 0.7 }}>{s.extra}</Typography>}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Chip label={`همه (${orders.length})`} onClick={() => setFilterStatus('all')}
          variant={filterStatus === 'all' ? 'filled' : 'outlined'}
          sx={{ borderRadius: '8px', ...(filterStatus === 'all' ? { backgroundColor: '#5D4037', color: '#fff' } : {}) }} />
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = orders.filter(o => o.status === key).length
          if (count === 0 && key !== 'pending') return null
          return (
            <Chip key={key} label={`${cfg.label} (${count})`} onClick={() => setFilterStatus(key)}
              variant={filterStatus === key ? 'filled' : 'outlined'}
              sx={{ borderRadius: '8px', ...(filterStatus === key ? { backgroundColor: cfg.color, color: '#fff' } : { borderColor: cfg.color, color: cfg.color }) }} />
          )
        })}
      </Box>

      {/* Error */}
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>{error}</Alert>}

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: '1px solid rgba(93,64,55,0.06)' }}>
          <LocalCafeIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
          <Typography color="text.secondary">سفارشی یافت نشد</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {filteredOrders.map((order) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            const isExpanded = expandedOrder === order.id
            const nextStatus = NEXT_STATUS[order.status]

            return (
              <Paper key={order.id} elevation={0} sx={{ 
                border: `1px solid ${cfg.color}25`, borderRadius: '12px', overflow: 'hidden',
                borderRight: `4px solid ${cfg.color}`,
                transition: 'all 0.2s ease',
              }}>
                {/* Order Header */}
                <Box sx={{ 
                  p: { xs: 2, md: 2.5 }, display: 'flex', alignItems: 'center', gap: 2,
                  cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0,0,0,0.01)' },
                }}
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', fontFamily: 'monospace', color: '#3E2723' }}>
                        {order.order_number}
                      </Typography>
                      <Chip label={cfg.label} size="small" icon={cfg.icon}
                        sx={{ backgroundColor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: '0.7rem', height: 24,
                          '& .MuiChip-icon': { color: cfg.color } }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#555' }}>
                        {order.customer_name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#999', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 12 }} /> {order.customer_phone}
                      </Typography>
                      {order.table_label && (
                        <Chip size="small" icon={<TableBarIcon sx={{ fontSize: 12 }} />} label={order.table_label}
                          sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, backgroundColor: '#EFEBE9', color: '#5D4037',
                            '& .MuiChip-icon': { color: '#5D4037' } }} />
                      )}
                      <Typography sx={{ fontSize: '0.75rem', color: '#bbb' }}>
                        {formatDate(order.created_at)} • {formatTime(order.created_at)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: 'left', flexShrink: 0 }}>
                    <Typography sx={{ fontWeight: 800, color: '#D4A574', fontSize: '0.95rem' }}>
                      {formatPrice(order.total_price)}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#999' }}>
                      {order.items_count} آیتم
                    </Typography>
                  </Box>

                  <IconButton size="small">
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                {/* Expanded Details */}
                <Collapse in={isExpanded}>
                  <Box sx={{ px: { xs: 2, md: 2.5 }, pb: 2.5, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                    {/* Items */}
                    <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#5D4037', mt: 2, mb: 1 }}>
                      آیتم‌های سفارش
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        {order.items?.map((item, i) => (
                          <TableRow key={i} sx={{ '&:last-child td': { border: 0 } }}>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem', py: 1 }}>{item.item_name}</TableCell>
                            <TableCell align="center" sx={{ fontSize: '0.8rem', py: 1 }}>×{item.quantity}</TableCell>
                            <TableCell align="left" sx={{ fontWeight: 700, fontSize: '0.8rem', py: 1, color: '#5D4037' }}>
                              {formatPrice(item.item_price * item.quantity)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {order.customer_note && (
                      <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#FFF8E1', borderRadius: '8px', fontSize: '0.82rem' }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#F57F17', mb: 0.5 }}>توضیحات مشتری:</Typography>
                        <Typography sx={{ fontSize: '0.82rem', color: '#555' }}>{order.customer_note}</Typography>
                      </Box>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 2.5, flexWrap: 'wrap' }}>
                      {nextStatus && (
                        <Button variant="contained" size="small"
                          onClick={(e) => { e.stopPropagation(); updateStatus(order.id, nextStatus) }}
                          sx={{ 
                            backgroundColor: STATUS_CONFIG[nextStatus].color, borderRadius: '8px',
                            fontSize: '0.8rem', fontWeight: 700,
                            '&:hover': { filter: 'brightness(0.9)' },
                          }}>
                          تغییر به: {STATUS_CONFIG[nextStatus].label}
                        </Button>
                      )}
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <Button variant="outlined" size="small" color="error"
                          onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'cancelled') }}
                          sx={{ borderRadius: '8px', fontSize: '0.8rem' }}>
                          لغو سفارش
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Collapse>
              </Paper>
            )
          })}
        </Box>
      )}
    </Box>
  )
}