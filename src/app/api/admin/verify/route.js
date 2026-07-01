import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'caribou-cafe-jwt-secret-2024';

function getToken(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '');
  }
  return request.cookies.get('adminToken')?.value || null;
}

export async function GET(request) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false, error: 'توکن یافت نشد' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, authenticated: false, error: 'دسترسی غیرمجاز' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        username: decoded.username,
        role: decoded.role
      },
      expiresAt: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, authenticated: false, error: 'توکن نامعتبر یا منقضی شده' },
      { status: 401 }
    );
  }
}

export async function POST(request) {
  return GET(request);
}