// cafe-website/src/app/api/admin/login/route.js - MySQL Version
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import adminModel from '@/models/adminModel';
import activityModel from '@/models/activityModel';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    console.log('🔐 Login attempt for username:', username);

    // Get credentials from environment
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
    const JWT_SECRET = process.env.JWT_SECRET || 'caribou-cafe-jwt-secret-2024';

    // Validate input
    if (!username || !password) {
      console.log('❌ Missing username or password');
      return NextResponse.json(
        {
          success: false,
          error: 'نام کاربری و رمز عبور الزامی است'
        },
        { status: 400 }
      );
    }

    // Try database authentication first, then fall back to environment
    let adminUser = null;
    let isDbAuth = false;

    try {
      adminUser = await adminModel.verifyAdminPassword(username, password);
      if (adminUser) {
        isDbAuth = true;
        console.log('✅ Database authentication successful for:', username);
      }
    } catch (dbError) {
      console.log('Database auth failed, using environment credentials:', dbError.message);
    }

    // Fall back to environment credentials if DB auth didn't work
    if (!adminUser && username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      console.log('✅ Environment credentials correct for:', username);
      adminUser = {
        id: 0,
        username: username,
        role: 'admin'
      };
    }

    if (adminUser) {
      console.log('✅ Credentials correct for:', username);

      // Create JWT token
      const tokenPayload = {
        username,
        role: 'admin',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent')?.substring(0, 100) || '',
        sessionId: Math.random().toString(36).substring(2) + Date.now().toString(36),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8), // 8 hours
        iat: Math.floor(Date.now() / 1000)
      };

      console.log('📝 Creating JWT token with payload:', {
        username: tokenPayload.username,
        role: tokenPayload.role,
        expiresIn: '8 hours'
      });

      const token = jwt.sign(tokenPayload, JWT_SECRET, { algorithm: 'HS256' });
      console.log('✅ JWT token created successfully');

      // Log successful login
      try {
        await activityModel.logActivity({
          action: 'login',
          entityType: 'user',
          entityName: username,
          entityId: adminUser.id,
          userId: username
        });
      } catch (logError) {
        console.log('Failed to log login activity:', logError);
      }

      // Create response
      const response = NextResponse.json({
        success: true,
        token,
        user: {
          username,
          role: 'admin',
          sessionId: tokenPayload.sessionId
        },
        expiresAt: new Date(tokenPayload.exp * 1000).toISOString(),
        message: 'ورود موفقیت‌آمیز'
      });

      // Set cookies
      console.log('🍪 Setting cookies...');

      response.cookies.set({
        name: 'adminToken',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8,
        path: '/',
      });
      console.log('✅ Set adminToken cookie');

      response.cookies.set({
        name: 'adminAuth',
        value: 'true',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8,
        path: '/',
      });
      console.log('✅ Set adminAuth cookie');

      response.cookies.set({
        name: 'lastLogin',
        value: Date.now().toString(),
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
      console.log('✅ Set lastLogin cookie');

      // Also set response headers
      response.headers.set('X-Auth-Status', 'success');
      response.headers.set('X-User', username);

      console.log('🎉 Login successful! Redirecting to dashboard...');
      console.log('📋 Response cookies:', response.cookies.getAll());

      return response;
    } else {
      console.log('❌ Invalid credentials for:', username);

      // Log failed login attempt
      try {
        await activityModel.logActivity({
          action: 'login',
          entityType: 'user',
          entityName: username,
          userId: username,
          details: { success: false, reason: 'invalid_credentials' }
        });
      } catch (logError) {
        console.log('Failed to log failed login:', logError);
      }

      return NextResponse.json(
        {
          success: false,
          error: 'نام کاربری یا رمز عبور اشتباه است'
        },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('💥 Login API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'خطا در سرور. لطفاً بعداً تلاش کنید.'
      },
      { status: 500 }
    );
  }
}

// GET method to check if login endpoint is working
export async function GET(request) {
  console.log('ℹ️ GET request to login endpoint');

  return NextResponse.json({
    success: true,
    message: 'Admin login API endpoint',
    status: 'operational',
    method: 'POST',
    required_fields: ['username', 'password'],
    note: 'Use POST method with JSON body to authenticate'
  });
}
