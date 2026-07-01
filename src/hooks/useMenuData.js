// cafe-website/src/hooks/useMenuData.js
import { useQuery } from '@tanstack/react-query'

async function fetchMenuData() {
  const response = await fetch('/api/menu')
  if (!response.ok) throw new Error('خطا در دریافت اطلاعات منو')
  return response.json()
}

export function useMenuData() {
  return useQuery({
    queryKey: ['menu'],
    queryFn: fetchMenuData,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  })
}

export function useMenuCategory(categoryId) {
  return useQuery({
    queryKey: ['menu', categoryId],
    queryFn: async () => {
      const response = await fetch(`/api/menu?category=${categoryId}`)
      if (!response.ok) throw new Error('خطا در دریافت دسته‌بندی')
      return response.json()
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!categoryId,
  })
}