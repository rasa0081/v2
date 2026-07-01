// src/app/api/tables/route.js — Public: list active tables
import { NextResponse } from 'next/server';
import tableModel from '@/models/tableModel';

export async function GET() {
  try {
    const tables = await tableModel.getAllTables({ activeOnly: true });
    return NextResponse.json({ success: true, data: tables });
  } catch (error) {
    console.error('Tables fetch error:', error);
    return NextResponse.json({ success: false, error: 'خطا در دریافت میزها' }, { status: 500 });
  }
}