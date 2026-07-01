// src/models/notificationModel.js - MySQL-based Notifications Data Access Layer
import { query, queryOne, insert, update, remove, count } from '@/lib/mysql';

const TABLE = 'notifications';

/**
 * Get all notifications with optional filtering
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Notifications
 */
export async function getAllNotifications(filters = {}) {
  let sql = `SELECT * FROM ${TABLE} WHERE 1=1`;
  const params = [];

  if (filters.type && filters.type !== 'all' && filters.type !== 'unread') {
    sql += ' AND type = ?';
    params.push(filters.type);
  }

  if (filters.unread === 'true' || filters.unread === true) {
    sql += ' AND is_read = ?';
    params.push(false);
  }

  sql += ' ORDER BY created_at DESC';

  // Add pagination
  if (filters.limit) {
    const offset = ((filters.page || 1) - 1) * filters.limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(filters.limit, offset);
  }

  return await query(sql, params);
}

/**
 * Get notification by ID
 * @param {number} id - Notification ID
 * @returns {Promise<Object|null>} Notification or null
 */
export async function getNotificationById(id) {
  const sql = `SELECT * FROM ${TABLE} WHERE id = ?`;
  return await queryOne(sql, [id]);
}

/**
 * Get notification by MongoDB-style _id
 * @param {string} mongoId - MongoDB ObjectId
 * @returns {Promise<Object|null>} Notification or null
 */
export async function getNotificationByMongoId(mongoId) {
  const sql = `SELECT * FROM ${TABLE} WHERE _id = ?`;
  return await queryOne(sql, [mongoId]);
}

/**
 * Create a new notification
 * @param {Object} data - Notification data
 * @returns {Promise<number>} Inserted ID
 */
export async function createNotification(data) {
  return await insert(TABLE, {
    type: data.type,
    title: data.title,
    message: data.message,
    data: data.data ? JSON.stringify(data.data) : null,
    is_read: data.read || false,
    priority: data.priority || 'medium'
  });
}

/**
 * Update a notification
 * @param {number} id - Notification ID
 * @param {Object} data - Updated data
 * @returns {Promise<number>} Affected rows
 */
export async function updateNotification(id, data) {
  const updateData = {};

  if (data.is_read !== undefined) updateData.is_read = data.is_read;
  if (data.read !== undefined) updateData.is_read = data.read;

  if (Object.keys(updateData).length === 0) return 0;

  return await update(TABLE, updateData, 'id = ?', [id]);
}

/**
 * Mark notification as read
 * @param {number} id - Notification ID
 * @returns {Promise<number>} Affected rows
 */
export async function markAsRead(id) {
  return await update(TABLE, { is_read: true }, 'id = ?', [id]);
}

/**
 * Mark all notifications as read
 * @returns {Promise<number>} Affected rows
 */
export async function markAllAsRead() {
  return await update(TABLE, { is_read: true }, 'is_read = ?', [false]);
}

/**
 * Delete a notification
 * @param {number} id - Notification ID
 * @returns {Promise<number>} Affected rows
 */
export async function deleteNotification(id) {
  return await remove(TABLE, 'id = ?', [id]);
}

/**
 * Count notifications
 * @param {Object} filters - Optional filters
 * @returns {Promise<number>} Count
 */
export async function countNotifications(filters = {}) {
  let where = '1=1';
  const params = [];

  if (filters.unread) {
    where = 'is_read = ?';
    params.push(false);
  }

  return await count(TABLE, where, params);
}

/**
 * Get unread count
 * @returns {Promise<number>} Unread count
 */
export async function getUnreadCount() {
  return await count(TABLE, 'is_read = ?', [false]);
}

export default {
  getAllNotifications,
  getNotificationById,
  getNotificationByMongoId,
  createNotification,
  updateNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  countNotifications,
  getUnreadCount
};
