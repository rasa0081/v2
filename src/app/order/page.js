'use client'

import { useState, useEffect } from 'react'
import { 
  Container, Typography, Box, Button, TextField, Snackbar, Alert,
  Grid, IconButton, Divider, Paper, FormControl, InputLabel,
  Select, MenuItem, CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SendIcon from '@mui/icons-material/Send'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'
import TableBarIcon from '@mui/icons-material/TableBar'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function OrderPage() {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerNote, setCustomerNote] = useState('')
  const [selectedTable, setSelectedTable] = useState('')
  const [tables, setTables] = useState([])
  const [tablesLoading, setTablesLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [orderResult, setOrderResult] = useState(null)
  const [errors, setErrors] = useState({})
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // Fetch available tables
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await fetch('/api/tables')
        const data = await res.json()
        if (data.success) setTables(data.data || [])
      } catch {
        console.error('Failed to fetch tables')
      } finally { setTablesLoading(false) }
    }
    fetchTables()
  }, [])

  const formatPrice = (price) => `${price.toLocaleString()} ت`

  const validate = () => {
    const e = {}
    if (!customerName.trim()) e.name = 'نام الزامی است'
    if (!customerPhone.trim()) e.phone = 'شماره تلفن الزامی است'
    else if (!/^09\d{9}$/.test(customerPhone.trim())) e.phone = 'شماره تلفن معتبر نیست'
    if (!selectedTable) e.table = 'انتخاب میز الزامی است'
    return e
  }

  const handleSubmit = async () => {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          customer_note: customerNote.trim() || null,
          table_id: selectedTable,
          items: items.map(i => ({
            menu_item_id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      })

      const result = await response.json()

      if (result.success) {
        setOrderResult(result.data)
        clearCart()
        setCustomerName('')
        setCustomerPhone('')
        setCustomerNote('')
        setSelectedTable('')
      } else {
        setSnackbar({ open: true, message: result.error || 'خطا در ثبت سفارش', severity: 'error' })
      }
    } catch {
      setSnackbar({ open: true, message: 'خطا در ارتباط با سرور', severity: 'error' })
    } finally { setLoading(false) }
  }

  // Order success screen
  if (orderResult) {
    return (
      <Box sx={{ backgroundColor: '#FDFBF7', minHeight: '100vh' }}>
        <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 72, color: '#4CAF50', mb: 3 }} />
          <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.5rem', md: '2rem' }, color: '#3E2723', mb: 1.5 }}>
            سفارش شما ثبت شد!
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            سفارش شما با موفقیت دریافت شد و در حال آماده‌سازی است.
          </Typography>
          
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid rgba(93,64,55,0.08)', textAlign: 'right' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ fontWeight: 700, color: '#5D4037' }}>شماره سفارش</Typography>
              <Typography sx={{ fontWeight: 800, color: '#3E2723', fontFamily: 'monospace', fontSize: '1rem' }}>{orderResult.order_number}</Typography>
            </Box>
            {orderResult.table_label && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ fontWeight: 700, color: '#5D4037' }}>میز</Typography>
                <Typography sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TableBarIcon sx={{ fontSize: 16, color: '#D4A574' }} /> {orderResult.table_label}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ fontWeight: 700, color: '#5D4037' }}>تعداد آیتم</Typography>
              <Typography>{orderResult.items_count} عدد</Typography>
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 800, color: '#3E2723' }}>جمع کل</Typography>
              <Typography sx={{ fontWeight: 900, color: '#D4A574', fontSize: '1.2rem' }}>{formatPrice(orderResult.total_price)}</Typography>
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/menu" style={{ textDecoration: 'none' }}>
              <Button variant="contained" sx={{ backgroundColor: '#5D4037', borderRadius: '10px', px: 4, '&:hover': { backgroundColor: '#3E2723' } }}>
                بازگشت به منو
              </Button>
            </Link>
            <Button variant="outlined" onClick={() => setOrderResult(null)}
              sx={{ borderColor: '#5D4037', color: '#5D4037', borderRadius: '10px', px: 4 }}>
              سفارش جدید
            </Button>
          </Box>
        </Container>
      </Box>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <Box sx={{ backgroundColor: '#FDFBF7', minHeight: '100vh' }}>
        <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 64, color: 'rgba(93,64,55,0.15)', mb: 3 }} />
          <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.3rem', md: '1.6rem' }, color: '#3E2723', mb: 1.5 }}>
            سبد خرید خالی است
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            از منوی کافه آیتم‌های مورد علاقه خود را انتخاب کنید
          </Typography>
          <Link href="/menu" style={{ textDecoration: 'none' }}>
            <Button variant="contained" startIcon={<LocalCafeIcon />}
              sx={{ backgroundColor: '#5D4037', borderRadius: '10px', px: 4, py: 1.3, '&:hover': { backgroundColor: '#3E2723' } }}>
              مشاهده منو
            </Button>
          </Link>
        </Container>
      </Box>
    )
  }

  // Cart with items
  return (
    <Box sx={{ backgroundColor: '#FDFBF7', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
        <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.5rem', md: '2rem' }, color: '#3E2723', mb: { xs: 3, md: 4 } }}>
          سبد خرید ({totalItems} آیتم)
        </Typography>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Cart Items */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ border: '1px solid rgba(93,64,55,0.06)', overflow: 'hidden' }}>
              {items.map((item, index) => (
                <Box key={item.id}>
                  <Box sx={{ display: 'flex', gap: 2, p: { xs: 2, md: 2.5 }, alignItems: 'center' }}>
                    <Box sx={{ width: { xs: 56, md: 72 }, height: { xs: 56, md: 72 }, borderRadius: '10px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f5f0eb' }}>
                      <img src={item.image || '/menu-images/default-item.jpg'} alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/menu-images/default-item.jpg' }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.85rem', md: '0.95rem' }, mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </Typography>
                      <Typography sx={{ color: '#D4A574', fontWeight: 800, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                        {formatPrice(item.price)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                      <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        sx={{ width: 30, height: 30, border: '1px solid rgba(93,64,55,0.12)', borderRadius: '8px' }}>
                        <RemoveIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', minWidth: 24, textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        sx={{ width: 30, height: 30, border: '1px solid rgba(93,64,55,0.12)', borderRadius: '8px' }}>
                        <AddIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                    <Box sx={{ textAlign: 'left', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#3E2723' }}>
                        {formatPrice(item.price * item.quantity)}
                      </Typography>
                      <IconButton size="small" onClick={() => removeItem(item.id)} sx={{ color: '#ccc', '&:hover': { color: '#e53935' } }}>
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </Box>
                  {index < items.length - 1 && <Divider />}
                </Box>
              ))}
            </Paper>
            <Button variant="text" size="small" onClick={clearCart} sx={{ mt: 1.5, color: '#999', fontSize: '0.8rem' }}>
              پاک کردن سبد خرید
            </Button>
          </Grid>

          {/* Checkout Form */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, border: '1px solid rgba(93,64,55,0.06)', position: { md: 'sticky' }, top: { md: 90 } }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#3E2723', mb: 2.5 }}>
                اطلاعات سفارش
              </Typography>

              <TextField fullWidth size="small" label="نام و نام خانوادگی" value={customerName}
                onChange={(e) => { setCustomerName(e.target.value); setErrors(p => ({...p, name: ''})) }}
                error={!!errors.name} helperText={errors.name} sx={{ mb: 2 }} />
              
              <TextField fullWidth size="small" label="شماره موبایل" value={customerPhone}
                onChange={(e) => { setCustomerPhone(e.target.value); setErrors(p => ({...p, phone: ''})) }}
                error={!!errors.phone} helperText={errors.phone} placeholder="09xxxxxxxxx"
                inputProps={{ dir: 'ltr', style: { textAlign: 'left' } }} sx={{ mb: 2 }} />
              
              {/* Table Selection */}
              <FormControl fullWidth size="small" sx={{ mb: 2 }} error={!!errors.table}>
                <InputLabel>انتخاب میز</InputLabel>
                <Select 
                  value={selectedTable} 
                  onChange={(e) => { setSelectedTable(e.target.value); setErrors(p => ({...p, table: ''})) }}
                  label="انتخاب میز"
                  startAdornment={
                    tablesLoading ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null
                  }
                >
                  {tables.map((table) => (
                    <MenuItem key={table.id} value={table.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                        <TableBarIcon sx={{ fontSize: 18, color: '#5D4037' }} />
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                          {table.label}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#999', mr: 'auto' }}>
                          ({table.capacity} نفره)
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                  {tables.length === 0 && !tablesLoading && (
                    <MenuItem disabled>
                      <Typography sx={{ fontSize: '0.85rem', color: '#999' }}>میزی تعریف نشده</Typography>
                    </MenuItem>
                  )}
                </Select>
                {errors.table && (
                  <Typography sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 0.5, mx: 1.5 }}>{errors.table}</Typography>
                )}
              </FormControl>

              <TextField fullWidth size="small" label="توضیحات (اختیاری)" value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)} multiline rows={2} sx={{ mb: 3 }} />

              {/* Summary */}
              <Box sx={{ py: 2, borderTop: '1px solid rgba(93,64,55,0.06)', borderBottom: '1px solid rgba(93,64,55,0.06)', mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">تعداد آیتم‌ها</Typography>
                  <Typography variant="body2">{totalItems} عدد</Typography>
                </Box>
                {selectedTable && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">میز</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {tables.find(t => t.id === selectedTable)?.label || '-'}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 800, color: '#3E2723' }}>جمع کل</Typography>
                  <Typography sx={{ fontWeight: 900, color: '#D4A574', fontSize: '1.2rem' }}>{formatPrice(totalPrice)}</Typography>
                </Box>
              </Box>

              <Button variant="contained" fullWidth onClick={handleSubmit} disabled={loading}
                endIcon={<SendIcon />}
                sx={{ py: 1.5, backgroundColor: '#5D4037', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', '&:hover': { backgroundColor: '#3E2723' } }}>
                {loading ? 'در حال ثبت...' : 'ثبت سفارش'}
              </Button>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2, fontSize: '0.7rem' }}>
                پرداخت حضوری در کافه انجام می‌شود
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  )
}