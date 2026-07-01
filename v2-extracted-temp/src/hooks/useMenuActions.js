// cafe-website/src/hooks/useMenuActions.js
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useMenuActions() {
  const queryClient = useQueryClient()

  const addMenuItem = useMutation({
    mutationFn: async (itemData) => {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      })
      if (!response.ok) throw new Error('خطا در افزودن آیتم')
      return response.json()
    },
    onSuccess: () => {
      // Invalidate menu cache to refetch
      queryClient.invalidateQueries({ queryKey: ['menu'] })
      // Also invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })

  const updateMenuItem = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data })
      })
      if (!response.ok) throw new Error('خطا در به‌روزرسانی آیتم')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] })
    },
  })

  return { addMenuItem, updateMenuItem }
}