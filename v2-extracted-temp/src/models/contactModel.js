// src/models/contactModel.js - MySQL-based Contact Messages Data Access Layer
import { query, queryOne, insert, update, remove, count } from '@/lib/mysql';

const TABLE = 'contact_messages';

/**
 * Get all contact messages with optional filtering
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Contact messages
 */
export async function getAllContactMessages(filters = {}) {
  let sql = `SELECT * FROM ${TABLE} WHERE 1=1`;
  const params = [];

  if (filters.status && filters.status !== 'all') {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  sql += ' ORDER BY created_at DESC';

  // Add pagination if provided
  if (filters.limit) {
    const offset = ((filters.page || 1) - 1) * filters.limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(filters.limit, offset);
  }

  return await query(sql, params);
}

/**
 * Get contact message by ID
 * @param {number} id - Message ID
 * @returns {Promise<Object|null>} Message or null
 */
export async function getContactMessageById(id) {
  const sql = `SELECT * FROM ${TABLE} WHERE id = ?`;
  return await queryOne(sql, [id]);
}

/**
 * Get contact message by MongoDB-style _id
 * @param {string} mongoId - MongoDB ObjectId
 * @returns {Promise<Object|null>} Message or null
 */
export async function getContactMessageByMongoId(mongoId) {
  const sql = `SELECT * FROM ${TABLE} WHERE _id = ?`;
  return await queryOne(sql, [mongoId]);
}

/**
 * Create a new contact message
 * @param {Object} data - Message data
 * @returns {Promise<number>} Inserted ID
 */
export async function createContactMessage(data) {
  return await insert(TABLE, {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone || null,
    subject: data.subject,
    message: data.message,
    status: data.status || 'new',
    is_read: data.read || false
  });
}

/**
 * Update a contact message
 * @param {number} id - Message ID
 * @param {Object} data - Updated data
 * @returns {Promise<number>} Affected rows
 */
export async function updateContactMessage(id, data) {
  const updateData = {};

  if (data.status !== undefined) updateData.status = data.status;
  if (data.is_read !== undefined) updateData.is_read = data.is_read;
  if (data.read !== undefined) updateData.is_read = data.read;

  if (Object.keys(updateData).length === 0) return 0;

  return await update(TABLE, updateData, 'id = ?', [id]);
}

/**
 * Mark message as read
 * @param {number} id - Message ID
 * @returns {Promise<number>} Affected rows
 */
export async function markAsRead(id) {
  return await update(TABLE, { is_read: true }, 'id = ?', [id]);
}

/**
 * Update message status
 * @param {number} id - Message ID
 * @param {string} status - New status
 * @returns {Promise<number>} Affected rows
 */
export async function updateMessageStatus(id, status) {
  return await update(TABLE, { status }, 'id = ?', [id]);
}

/**
 * Delete a contact message
 * @param {number} id - Message ID
 * @returns {Promise<number>} Affected rows
 */
export async function deleteContactMessage(id) {
  return await remove(TABLE, 'id = ?', [id]);
}

/**
 * Count messages
 * @param {Object} filters - Optional filters
 * @returns {Promise<number>} Count
 */
export async function countContactMessages(filters = {}) {
  let where = '1=1';
  const params = [];

  if (filters.status) {
    where = 'status = ?';
    params.push(filters.status);
  }

  return await count(TABLE, where, params);
}

/**
 * Count new messages for today
 * @param {Date} date - Date to count from
 * @returns {Promise<number>} Count
 */
export async function countNewMessagesForDate(date) {
  const sql = `SELECT COUNT(*) as total FROM ${TABLE} WHERE DATE(created_at) = DATE(?) AND status = 'new'`;
  const result = await query(sql, [date]);
  return result[0].total;
}

export default {
  getAllContactMessages,
  getContactMessageById,
  getContactMessageByMongoId,
  createContactMessage,
  updateContactMessage,
  markAsRead,
  updateMessageStatus,
  deleteContactMessage,
  countContactMessages,
  countNewMessagesForDate
};
