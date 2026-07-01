// src/app/api/admin/orders/route.js — Admin orders list + status update
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import orderModel from '@/models/orderModel';

const JWT_SECRET = process.env.JWT_SECRET || 'caribou-cafe-jwt-secret-2024';

const verifyAdmin = (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return false;
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.role === 'admin';
  } catch { return false; }
};

// GET — List orders
export async function GET(request) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ success: false, error: 'دسترسی غیرمجاز' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');

    const orders = await orderModel.getAllOrders({ status, limit });
    const stats = await orderModel.getOrderStats();

    return NextResponse.json({ success: true, data: { orders, stats } });
  } catch (error) {
    console.error('Admin orders fetch error:', error);
    return NextResponse.json({ success: false, error: 'خطا در دریافت سفارشات' }, { status: 500 });
  }
}

// PATCH — Update order status
export async function PATCH(request) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ success: false, error: 'دسترسی غیرمجاز' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'اطلاعات ناقص' }, { status: 400 });
    }

    const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'وضعیت نامعتبر' }, { status: 400 });
    }

    const updated = await orderModel.updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'سفارش یافت نشد' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'وضعیت سفارش بروزرسانی شد' });
  } catch (error) {
    console.error('Order status update error:', error);
    return NextResponse.json({ success: false, error: 'خطا در بروزرسانی' }, { status: 500 });
  }
}