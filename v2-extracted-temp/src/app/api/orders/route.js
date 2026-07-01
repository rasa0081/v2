// src/app/api/orders/route.js — Public order creation
import { NextResponse } from 'next/server';
import orderModel from '@/models/orderModel';
import tableModel from '@/models/tableModel';

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, customer_note, table_id, items } = body;

    if (!customer_name?.trim()) {
      return NextResponse.json({ success: false, error: 'نام مشتری الزامی است' }, { status: 400 });
    }
    if (!customer_phone?.trim()) {
      return NextResponse.json({ success: false, error: 'شماره تلفن الزامی است' }, { status: 400 });
    }
    if (!table_id) {
      return NextResponse.json({ success: false, error: 'انتخاب میز الزامی است' }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'سبد خرید خالی است' }, { status: 400 });
    }

    for (const item of items) {
      if (!item.name || !item.price || !item.quantity) {
        return NextResponse.json({ success: false, error: 'اطلاعات آیتم ناقص است' }, { status: 400 });
      }
    }

    // Lookup table label
    let table_label = null;
    if (table_id) {
      const table = await tableModel.getTableById(parseInt(table_id));
      table_label = table?.label || `میز ${table_id}`;
    }

    const order = await orderModel.createOrder({
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      customer_note: customer_note?.trim() || null,
      table_id: parseInt(table_id),
      table_label,
      items,
    });

    return NextResponse.json({
      success: true,
      data: order,
      message: 'سفارش شما با موفقیت ثبت شد',
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, error: 'خطا در ثبت سفارش' }, { status: 500 });
  }
}