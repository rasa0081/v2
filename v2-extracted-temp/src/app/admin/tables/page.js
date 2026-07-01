'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Box, Typography, Paper, Button, Grid, TextField,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Switch, FormControlLabel, Alert, Snackbar, Chip, CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import TableBarIcon from '@mui/icons-material/TableBar'
import PeopleIcon from '@mui/icons-material/People'

export default function AdminTablesPage() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTable, setEditingTable] = useState(null)
  const [formData, setFormData] = useState({ table_number: '', label: '', capacity: 4, active: true, sort_order: 0 })
  const [saving, setSaving] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const getToken = () => localStorage.getItem('adminToken')

  const fetchTables = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/tables', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      const data = await res.json()
      if (data.success) setTables(data.data || [])
    } catch { setSnackbar({ open: true, message: 'خطا در دریافت میزها', severity: 'error' }) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchTables() }, [fetchTables])

  const openAddDialog = () => {
    setEditingTable(null)
    setFormData({ table_number: '', label: '', capacity: 4, active: true, sort_order: tables.length + 1 })
    setDialogOpen(true)
  }

  const openEditDialog = (table) => {
    setEditingTable(table)
    setFormData({
      table_number: table.table_number,
      label: table.label,
      capacity: table.capacity,
      active: Boolean(table.active),
      sort_order: table.sort_order,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.table_number.toString().trim() || !formData.label.trim()) {
      setSnackbar({ open: true, message: 'شماره و نام میز الزامی است', severity: 'error' })
      return
    }

    setSaving(true)
    try {
      const url = '/api/admin/tables'
      const method = editingTable ? 'PUT' : 'POST'
      const body = editingTable ? { ...formData, id: editingTable.id } : formData

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (data.success) {
        setSnackbar({ open: true, message: editingTable ? 'میز بروزرسانی شد' : 'میز اضافه شد', severity: 'success' })
        setDialogOpen(false)
        fetchTables()
      } else {
        setSnackbar({ open: true, message: data.error || 'خطا', severity: 'error' })
      }
    } catch {
      setSnackbar({ open: true, message: 'خطا در ذخیره', severity: 'error' })
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این میز مطمئن هستید؟')) return

    try {
      const res = await fetch(`/api/admin/tables?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      })
      const data = await res.json()
      if (data.success) {
        setSnackbar({ open: true, message: 'میز حذف شد', severity: 'success' })
        fetchTables()
      }
    } catch {
      setSnackbar({ open: true, message: 'خطا در حذف', severity: 'error' })
    }
  }

  const handleToggleActive = async (table) => {
    try {
      const res = await fetch('/api/admin/tables', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ id: table.id, active: !table.active }),
      })
      const data = await res.json()
      if (data.success) fetchTables()
    } catch {}
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: '#5D4037' }} />
      </Box>
    )
  }

  const activeTables = tables.filter(t => t.active)
  const inactiveTables = tables.filter(t => !t.active)

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: '#3E2723' }}>مدیریت میزها</Typography>
          <Typography variant="caption" color="text.secondary">
            {activeTables.length} میز فعال • {inactiveTables.length} غیرفعال
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog}
          sx={{ backgroundColor: '#5D4037', borderRadius: '10px', '&:hover': { backgroundColor: '#3E2723' } }}>
          میز جدید
        </Button>
      </Box>

      {/* Tables Grid */}
      {tables.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: '1px solid rgba(93,64,55,0.06)' }}>
          <TableBarIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
          <Typography color="text.secondary" sx={{ mb: 2 }}>هنوز میزی تعریف نشده</Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={openAddDialog} sx={{ borderRadius: '8px' }}>
            اضافه کردن اولین میز
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {tables.map((table) => (
            <Grid item xs={6} sm={4} md={3} key={table.id}>
              <Paper elevation={0} sx={{ 
                p: 2.5, textAlign: 'center',
                border: `1px solid ${table.active ? 'rgba(93,64,55,0.08)' : 'rgba(244,67,54,0.15)'}`,
                borderRadius: '14px',
                opacity: table.active ? 1 : 0.6,
                transition: 'all 0.2s ease',
                '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.06)' },
              }}>
                <Box sx={{ 
                  width: 52, height: 52, borderRadius: '14px', mx: 'auto', mb: 2,
                  backgroundColor: table.active ? 'rgba(93,64,55,0.06)' : 'rgba(244,67,54,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <TableBarIcon sx={{ fontSize: 26, color: table.active ? '#5D4037' : '#F44336' }} />
                </Box>

                <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#3E2723', mb: 0.5 }}>
                  {table.label}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1.5 }}>
                  <Chip size="small" label={`شماره ${table.table_number}`} sx={{ fontSize: '0.7rem', height: 22 }} />
                  <Chip size="small" icon={<PeopleIcon sx={{ fontSize: 12 }} />} label={`${table.capacity} نفر`} sx={{ fontSize: '0.7rem', height: 22 }} />
                </Box>

                <Chip size="small" label={table.active ? 'فعال' : 'غیرفعال'}
                  onClick={() => handleToggleActive(table)}
                  sx={{ 
                    cursor: 'pointer', mb: 2, fontSize: '0.7rem', height: 22, fontWeight: 700,
                    backgroundColor: table.active ? '#E8F5E9' : '#FFEBEE',
                    color: table.active ? '#2E7D32' : '#C62828',
                  }} />

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  <IconButton size="small" onClick={() => openEditDialog(table)}
                    sx={{ color: '#5D4037', border: '1px solid rgba(93,64,55,0.1)', borderRadius: '8px', width: 32, height: 32 }}>
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(table.id)}
                    sx={{ color: '#F44336', border: '1px solid rgba(244,67,54,0.15)', borderRadius: '8px', width: 32, height: 32 }}>
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#3E2723' }}>
          {editingTable ? 'ویرایش میز' : 'میز جدید'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="شماره میز" value={formData.table_number}
                onChange={(e) => setFormData(p => ({ ...p, table_number: e.target.value }))} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="ظرفیت (نفر)" type="number" value={formData.capacity}
                onChange={(e) => setFormData(p => ({ ...p, capacity: parseInt(e.target.value) || 1 }))} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="نام نمایشی" value={formData.label}
                onChange={(e) => setFormData(p => ({ ...p, label: e.target.value }))}
                placeholder="مثلا: میز ۱ یا میز VIP" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="ترتیب نمایش" type="number" value={formData.sort_order}
                onChange={(e) => setFormData(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Switch checked={formData.active} onChange={(e) => setFormData(p => ({ ...p, active: e.target.checked }))} />}
                label={<Typography sx={{ fontSize: '0.85rem' }}>فعال</Typography>} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#999' }}>انصراف</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}
            sx={{ backgroundColor: '#5D4037', borderRadius: '8px', '&:hover': { backgroundColor: '#3E2723' } }}>
            {saving ? 'ذخیره...' : editingTable ? 'بروزرسانی' : 'اضافه کردن'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  )
}