// src/models/orderModel.js
import { query, queryOne, insert, update } from '@/lib/mysql';

export async function generateOrderNumber() {
  const now = new Date();
  const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '');
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  
  const result = await queryOne(
    'SELECT COUNT(*) as cnt FROM orders WHERE created_at >= ?',
    [startOfDay.toISOString().slice(0, 19).replace('T', ' ')]
  );
  const seq = String((result?.cnt || 0) + 1).padStart(4, '0');
  return `ORD-${dateStr}-${seq}`;
}

export async function createOrder({ customer_name, customer_phone, customer_note, table_id, table_label, items }) {
  const order_number = await generateOrderNumber();
  const total_price = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const items_count = items.reduce((sum, i) => sum + i.quantity, 0);

  const orderData = {
    order_number,
    customer_name,
    customer_phone,
    customer_note: customer_note || null,
    table_id: table_id || null,
    table_label: table_label || null,
    total_price,
    items_count,
    status: 'pending',
  };

  const orderId = await insert('orders', orderData);

  for (const item of items) {
    await insert('order_items', {
      order_id: orderId,
      menu_item_id: item.menu_item_id || null,
      item_name: item.name,
      item_price: item.price,
      quantity: item.quantity,
    });
  }

  return { id: orderId, order_number, total_price, items_count, table_label };
}

export async function getAllOrders({ status, limit = 50, offset = 0 } = {}) {
  let sql = 'SELECT * FROM orders';
  const params = [];

  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }

  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const orders = await query(sql, params);

  for (const order of orders) {
    order.items = await query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
  }

  return orders;
}

export async function getOrderById(id) {
  const order = await queryOne('SELECT * FROM orders WHERE id = ?', [id]);
  if (!order) return null;
  order.items = await query('SELECT * FROM order_items WHERE order_id = ?', [id]);
  return order;
}

export async function updateOrderStatus(id, status) {
  const affected = await update('orders', { status }, 'id = ?', [id]);
  return affected > 0;
}

export async function getOrderStats() {
  const rows = await query('SELECT status, COUNT(*) as count FROM orders GROUP BY status');
  const stats = { pending: 0, preparing: 0, ready: 0, delivered: 0, cancelled: 0, total: 0 };
  for (const row of rows) {
    stats[row.status] = row.count;
    stats.total += row.count;
  }

  const todayResult = await queryOne(
    `SELECT COUNT(*) as cnt, COALESCE(SUM(total_price), 0) as revenue 
     FROM orders WHERE DATE(created_at) = CURDATE() AND status != 'cancelled'`
  );
  stats.today_count = todayResult?.cnt || 0;
  stats.today_revenue = todayResult?.revenue || 0;

  return stats;
}

export default { generateOrderNumber, createOrder, getAllOrders, getOrderById, updateOrderStatus, getOrderStats };