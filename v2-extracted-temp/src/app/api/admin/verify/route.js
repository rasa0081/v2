// cafe-website/src/app/api/admin/logout/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    console.log('👋 Logout endpoint called')
    
    // Check if user was authenticated
    const token = request.cookies.get('adminToken')?.value
    if (token) {
      try {
        const JWT_SECRET = process.env.JWT_SECRET || 'caribou-cafe-jwt-secret-2024'
        const jwt = await import('jsonwebtoken')
        const decoded = jwt.verify(token, JWT_SECRET)
        console.log(`👤 User ${decoded.username} logged out`)
      } catch (e) {
        console.log('ℹ️ Invalid token during logout (expected)')
      }
    }
    
    const response = NextResponse.json({
      success: true,
      message: 'با موفقیت خارج شدید',
      timestamp: new Date().toISOString()
    })
    
    // Clear all auth cookies with proper settings
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    }
    
    // Clear adminToken
    response.cookies.set({
      ...cookieOptions,
      name: 'adminToken',
      value: '',
      expires: new Date(0),
    })
    
    // Clear adminAuth
    response.cookies.set({
      ...cookieOptions,
      name: 'adminAuth',
      value: '',
      expires: new Date(0),
      httpOnly: false,
    })
    
    // Clear lastLogin
    response.cookies.set({
      ...cookieOptions,
      name: 'lastLogin',
      value: '',
      expires: new Date(0),
      httpOnly: false,
    })
    
    // Clear any other related cookies
    response.cookies.set({
      ...cookieOptions,
      name: 'session',
      value: '',
      expires: new Date(0),
    })
    
    console.log('✅ Logout successful')
    return response

  } catch (error) {
    console.error('💥 Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'خطا در خروج' },
      { status: 500 }
    )
  }
}

// Also handle GET requests for convenience
export async function GET(request) {
  return POST(request)
}