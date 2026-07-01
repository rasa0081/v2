// cafe-website/src/hooks/useDashboardStats.js
import { useQuery } from '@tanstack/react-query'

async function fetchDashboardStats() {
  const response = await fetch('/api/dashboard/stats')
  if (!response.ok) throw new Error('خطا در دریافت آمار داشبورد')
  return response.json()
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time stats
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    retry: 2, // Retry twice on failure
    retryDelay: 1000, // Wait 1 second between retries
  })
}