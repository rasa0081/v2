// cafe-website/src/hooks/useGalleryData.js
import { useQuery } from '@tanstack/react-query'

async function fetchGalleryData() {
  const response = await fetch('/api/gallery')
  if (!response.ok) throw new Error('خطا در دریافت گالری')
  return response.json()
}

export function useGalleryData() {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: fetchGalleryData,
    staleTime: 15 * 60 * 1000, // Gallery changes less often
    gcTime: 60 * 60 * 1000, // 1 hour cache
  })
}