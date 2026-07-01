'use client'

import { useQuery } from '@tanstack/react-query'

// Function to fetch settings from API
async function fetchSettings() {
  try {
    const response = await fetch('/api/settings')
    
    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch settings')
    }
    
    return data
  } catch (error) {
    console.error('Error fetching settings:', error)
    
    // Return default settings as fallback
    return {
      success: true,
      data: getDefaultSettings(),
      timestamp: new Date().toISOString(),
      fromCache: false
    }
  }
}

// Default settings if API fails
function getDefaultSettings() {
  return {
    // General
    site_name: 'کافه کاریبو',
    site_description: 'کافه مورد علاقه شما در محله',
    site_logo: '/logo.png',
    
    // Business
    currency: 'IRR',
    currency_symbol: 'ریال',
    currency_format: 'تومان',
    opening_hours: 'همه روزه 11 صبح الی 10 شب',
    
    // Contact
    contact_address: 'تهران - شهر قدس بلوار ۴۵ متری انقلاب نبش کوچه توحید',
    contact_phone: '09212620316',
    contact_email: 'info@cariboucafe.ir',
    contact_whatsapp: '09212620316',
    
    // Social
    social_instagram: 'https://www.instagram.com/cafecaribou',
    social_telegram: 'https://t.me/cariboucafe',
    
    // Features
    maintenance_mode: false,
    enable_online_orders: false,
    enable_reservations: false,
    enable_gallery: true
  }
}

// Custom hook to use settings
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    retry: 2, // Retry twice on failure
    retryDelay: 1000, // 1 second between retries
    
    // Return default settings immediately while loading
    placeholderData: {
      success: true,
      data: getDefaultSettings(),
      timestamp: new Date().toISOString(),
      fromCache: true
    }
  })
}

// Helper to get a specific setting
export function useSetting(key) {
  const { data } = useSettings()
  
  if (!data?.data) {
    return getDefaultSettings()[key]
  }
  
  return data.data[key] || getDefaultSettings()[key]
}

// Helper to format opening hours
export function useFormattedOpeningHours() {
  const { data } = useSettings()
  const openingHours = data?.data?.opening_hours || getDefaultSettings().opening_hours
  
  if (!openingHours) return []
  
  return openingHours.split('\n').filter(line => line.trim())
}

// Helper to check if feature is enabled
export function useFeatureEnabled(featureKey) {
  const { data } = useSettings()
  
  if (!data?.data) {
    return getDefaultSettings()[featureKey] || false
  }
  
  return data.data[featureKey] || false
}

export default useSettings