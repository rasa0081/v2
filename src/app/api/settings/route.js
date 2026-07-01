import { NextResponse } from 'next/server';
import settingsModel from '@/models/settingsModel';

// Default settings if database is empty
const DEFAULT_SETTINGS = {
  // General
  site_name: 'کافه کاریبو',
  site_description: 'کافه مورد علاقه شما در محله',
  site_logo: '/logo.png',

  // Business
  currency: 'IRR',
  currency_symbol: 'ریال',
  currency_format: 'تومان',
  opening_hours: 'شنبه تا چهارشنبه: ۷ صبح تا ۹ شب\nپنجشنبه و جمعه: ۸ صبح تا ۱۰ شب',

  // Contact
  contact_address: 'تهران - شهر قدس بلوار ۴۵ متری انقلاب نبش کوچه توحید',
  contact_phone: '۰۹۲۱۲۶۲۰۳۱۶',
  contact_email: 'info@cariboucafe.ir',
  contact_whatsapp: '۰۹۲۱۲۶۲۰۳۱۶',

  // Social
  social_instagram: 'https://www.instagram.com/cafecaribou',
  social_telegram: 'https://t.me/cariboucafe',

  // Features
  maintenance_mode: false,
  enable_online_orders: false,
  enable_reservations: false,
  enable_gallery: true
};

// GET public settings
export async function GET() {
  try {
    // Get all settings from database
    const dbSettings = await settingsModel.getAllSettings();

    // Convert JSON strings back to objects where needed
    const settingsObj = {};
    for (const [key, value] of Object.entries(dbSettings)) {
      try {
        settingsObj[key] = JSON.parse(value);
      } catch {
        settingsObj[key] = value;
      }
    }

    // Merge with defaults (database overrides defaults)
    const mergedSettings = { ...DEFAULT_SETTINGS, ...settingsObj };

    // Filter to only return public settings (not sensitive ones)
    const publicSettings = {
      // General
      site_name: mergedSettings.site_name,
      site_description: mergedSettings.site_description,
      site_logo: mergedSettings.site_logo,

      // Business
      currency: mergedSettings.currency,
      currency_symbol: mergedSettings.currency_symbol,
      currency_format: mergedSettings.currency_format,
      opening_hours: mergedSettings.opening_hours,

      // Contact
      contact_address: mergedSettings.contact_address,
      contact_phone: mergedSettings.contact_phone,
      contact_email: mergedSettings.contact_email,
      contact_whatsapp: mergedSettings.contact_whatsapp,

      // Social
      social_instagram: mergedSettings.social_instagram,
      social_telegram: mergedSettings.social_telegram,

      // Features (for UI display)
      enable_online_orders: mergedSettings.enable_online_orders,
      enable_reservations: mergedSettings.enable_reservations,
      enable_gallery: mergedSettings.enable_gallery
    };

    // Add cache headers for better performance
    const headers = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    };

    return NextResponse.json({
      success: true,
      data: publicSettings,
      timestamp: new Date().toISOString(),
      source: Object.keys(dbSettings).length > 0 ? 'database' : 'defaults'
    }, { headers });

  } catch (error) {
    console.error('Error fetching public settings:', error);

    // Return defaults on error
    return NextResponse.json({
      success: true,
      data: DEFAULT_SETTINGS,
      timestamp: new Date().toISOString(),
      source: 'defaults-fallback',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
