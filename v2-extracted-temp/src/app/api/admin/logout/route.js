// cafe-website/src/app/api/admin/logout/route.js
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'با موفقیت خارج شدید'
    })
    
    // Clear cookies
    response.cookies.set({
      name: 'adminToken',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })

    response.cookies.set({
      name: 'adminAuth',
      value: '',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'خطا در خروج' },
      { status: 500 }
    )
  }
}