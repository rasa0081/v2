// cafe-website/src/app/admin/messages/page.js
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'

export default function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [adminNote, setAdminNote] = useState('')

  const fetchMessages = async (page = 0, limit = 10) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/contact?page=${page + 1}&limit=${limit}`)
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.data.messages || [])
        setTotal(data.data.pagination?.total || 0)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages(page, rowsPerPage)
  }, [page, rowsPerPage])

  const handleViewMessage = (message) => {
    setSelectedMessage(message)
    // Mark as read when viewed
    if (!message.read) {
      markAsRead(message._id)
    }
  }

  const markAsRead = async (messageId) => {
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true })
      })
      
      if (response.ok) {
        // Update local state
        setMessages(prev => prev.map(msg => 
          msg._id === messageId ? { ...msg, read: true, status: 'read' } : msg
        ))
      }
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleAddNote = async () => {
    if (!adminNote.trim() || !selectedMessage) return
    
    try {
      const response = await fetch(`/api/contact/${selectedMessage._id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note: adminNote })
      })
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'یادداشت اضافه شد',
          severity: 'success'
        })
        setAdminNote('')
        // Refresh messages
        fetchMessages(page, rowsPerPage)
      }
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'error'
      case 'read': return 'info'
      case 'replied': return 'success'
      case 'archived': return 'default'
      default: return 'default'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'جدید'
      case 'read': return 'خوانده شده'
      case 'replied': return 'پاسخ داده شده'
      case 'archived': return 'آرشیو شده'
      default: return status
    }
  }

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#795548', color: 'white', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <EmailIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4">
              مدیریت پیام‌ها
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              پیام‌های دریافتی از فرم تماس
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Messages Table */}
      <Paper sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>نام</TableCell>
                <TableCell>ایمیل</TableCell>
                <TableCell>موضوع</TableCell>
                <TableCell>وضعیت</TableCell>
                <TableCell>زمان</TableCell>
                <TableCell>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress sx={{ color: '#795548' }} />
                  </TableCell>
                </TableRow>
              ) : messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    هیچ پیامی یافت نشد
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow 
                    key={message._id} 
                    hover
                    sx={{ 
                      cursor: 'pointer',
                      backgroundColor: !message.read ? 'rgba(255, 235, 238, 0.3)' : 'inherit'
                    }}
                    onClick={() => handleViewMessage(message)}
                  >
                    <TableCell>
                      <Typography fontWeight={!message.read ? 600 : 400}>
                        {message.firstName} {message.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusText(message.status)} 
                        size="small" 
                        color={getStatusColor(message.status)}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(message.createdAt).toLocaleDateString('fa-IR')}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewMessage(message)
                        }}
                      >
                        <VisibilityIcon />
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
        />
      </Paper>

      {/* Message Detail Dialog */}
      <Dialog 
        open={!!selectedMessage} 
        onClose={() => setSelectedMessage(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedMessage && (
          <>
            <DialogTitle>
              پیام از: {selectedMessage.firstName} {selectedMessage.lastName}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  اطلاعات تماس:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>ایمیل:</strong> {selectedMessage.email}
                  {selectedMessage.phone && (
                    <> | <strong>تلفن:</strong> {selectedMessage.phone}</>
                  )}
                  <br />
                  <strong>زمان ارسال:</strong> {new Date(selectedMessage.createdAt).toLocaleString('fa-IR')}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  موضوع:
                </Typography>
                <Typography variant="body1">
                  {selectedMessage.subject}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  پیام:
                </Typography>
                <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedMessage.message}
                  </Typography>
                </Paper>
              </Box>

              {/* Admin Notes Section */}
              {selectedMessage.adminNotes && selectedMessage.adminNotes.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    یادداشت‌های مدیریت:
                  </Typography>
                  {selectedMessage.adminNotes.map((note, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 1, backgroundColor: '#fff8e1' }}>
                      <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                        {note.note}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(note.createdAt).toLocaleString('fa-IR')}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}

              {/* Add Note Form */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  افزودن یادداشت:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="یادداشت خود را اینجا بنویسید..."
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddNote}
                  disabled={!adminNote.trim()}
                  sx={{ backgroundColor: '#795548' }}
                >
                  افزودن یادداشت
                </Button>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedMessage(null)}>بستن</Button>
              <Button 
                variant="contained" 
                startIcon={<CheckIcon />}
                onClick={() => markAsRead(selectedMessage._id)}
                disabled={selectedMessage.read}
              >
                علامت‌گذاری به عنوان خوانده شده
              </Button>
            </DialogActions>
          </>
        )}
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