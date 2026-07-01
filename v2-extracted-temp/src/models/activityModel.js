// src/models/activityModel.js - MySQL-based Activity Logs Data Access Layer
import { query, queryOne, insert, remove, count } from '@/lib/mysql';

const TABLE = 'activity_logs';

/**
 * Get recent activities
 * @param {number} limit - Number of activities to return
 * @returns {Promise<Array>} Activities
 */
export async function getRecentActivities(limit = 10) {
  const sql = `
    SELECT * FROM ${TABLE}
    ORDER BY created_at DESC
    LIMIT ?
  `;
  return await query(sql, [limit]);
}

/**
 * Get all activities with optional filtering
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Activities
 */
export async function getAllActivities(filters = {}) {
  let sql = `SELECT * FROM ${TABLE} WHERE 1=1`;
  const params = [];

  if (filters.entityType) {
    sql += ' AND entity_type = ?';
    params.push(filters.entityType);
  }

  if (filters.action) {
    sql += ' AND action = ?';
    params.push(filters.action);
  }

  if (filters.userId) {
    sql += ' AND user_id = ?';
    params.push(filters.userId);
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
 * Log an activity
 * @param {Object} data - Activity data
 * @returns {Promise<number>} Inserted ID
 */
export async function logActivity(data) {
  return await insert(TABLE, {
    user_id: data.userId || 'admin',
    action: data.action,
    entity_type: data.entityType,
    entity_name: data.entityName,
    entity_id: data.entityId || null,
    details: data.details ? JSON.stringify(data.details) : null,
    ip_address: data.ipAddress || null,
    user_agent: data.userAgent || null
  });
}

/**
 * Delete old activities
 * @param {Date} beforeDate - Delete activities before this date
 * @returns {Promise<number>} Deleted count
 */
export async function deleteOldActivities(beforeDate) {
  const sql = `DELETE FROM ${TABLE} WHERE created_at < ?`;
  const result = await query(sql, [beforeDate]);
  return result.affectedRows;
}

/**
 * Get activities by entity
 * @param {string} entityType - Entity type
 * @param {number} entityId - Entity ID
 * @returns {Promise<Array>} Activities
 */
export async function getActivitiesByEntity(entityType, entityId) {
  const sql = `
    SELECT * FROM ${TABLE}
    WHERE entity_type = ? AND entity_id = ?
    ORDER BY created_at DESC
  `;
  return await query(sql, [entityType, entityId]);
}

/**
 * Count activities
 * @param {Object} filters - Optional filters
 * @returns {Promise<number>} Count
 */
export async function countActivities(filters = {}) {
  let where = '1=1';
  const params = [];

  if (filters.entityType) {
    where = 'entity_type = ?';
    params.push(filters.entityType);
  }

  return await count(TABLE, where, params);
}

export default {
  getRecentActivities,
  getAllActivities,
  logActivity,
  deleteOldActivities,
  getActivitiesByEntity,
  countActivities
};
