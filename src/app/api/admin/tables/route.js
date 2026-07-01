// src/app/api/admin/tables/route.js — Admin CRUD for cafe tables
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import tableModel from '@/models/tableModel';

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

// GET — List all tables
export async function GET(request) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ success: false, error: 'دسترسی غیرمجاز' }, { status: 401 });
    }
    const tables = await tableModel.getAllTables();
    return NextResponse.json({ success: true, data: tables });
  } catch (error) {
    console.error('Admin tables fetch error:', error);
    return NextResponse.json({ success: false, error: 'خطا در دریافت میزها' }, { status: 500 });
  }
}

// POST — Create a new table
export async function POST(request) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ success: false, error: 'دسترسی غیرمجاز' }, { status: 401 });
    }
    const body = await request.json();
    if (!body.table_number?.toString().trim() || !body.label?.trim()) {
      return NextResponse.json({ success: false, error: 'شماره و نام میز الزامی است' }, { status: 400 });
    }

    const id = await tableModel.createTable({
      table_number: body.table_number.toString().trim(),
      label: body.label.trim(),
      capacity: parseInt(body.capacity) || 4,
      active: body.active !== undefined ? body.active : true,
      sort_order: parseInt(body.sort_order) || 0,
    });

    const newTable = await tableModel.getTableById(id);
    return NextResponse.json({ success: true, data: newTable, message: 'میز اضافه شد' }, { status: 201 });
  } catch (error) {
    console.error('Table create error:', error);
    return NextResponse.json({ success: false, error: 'خطا در ایجاد میز' }, { status: 500 });
  }
}

// PUT — Update a table
export async function PUT(request) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ success: false, error: 'دسترسی غیرمجاز' }, { status: 401 });
    }
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'شناسه میز الزامی است' }, { status: 400 });
    }

    await tableModel.updateTable(body.id, body);
    const updated = await tableModel.getTableById(body.id);
    return NextResponse.json({ success: true, data: updated, message: 'میز بروزرسانی شد' });
  } catch (error) {
    console.error('Table update error:', error);
    return NextResponse.json({ success: false, error: 'خطا در بروزرسانی' }, { status: 500 });
  }
}

// DELETE — Delete a table
export async function DELETE(request) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ success: false, error: 'دسترسی غیرمجاز' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'شناسه الزامی است' }, { status: 400 });
    }

    await tableModel.deleteTable(parseInt(id));
    return NextResponse.json({ success: true, message: 'میز حذف شد' });
  } catch (error) {
    console.error('Table delete error:', error);
    return NextResponse.json({ success: false, error: 'خطا در حذف' }, { status: 500 });
  }
}