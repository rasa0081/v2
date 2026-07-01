// src/models/adminModel.js - MySQL-based Admin Users Data Access Layer
import { query, queryOne, insert, update, remove, exists } from '@/lib/mysql';
import bcrypt from 'bcryptjs';

const TABLE = 'admin_users';

/**
 * Get admin user by username
 * @param {string} username - Username
 * @returns {Promise<Object|null>} Admin user or null
 */
export async function getAdminByUsername(username) {
  const sql = `SELECT * FROM ${TABLE} WHERE username = ? AND is_active = true`;
  return await queryOne(sql, [username]);
}

/**
 * Get admin user by ID
 * @param {number} id - Admin ID
 * @returns {Promise<Object|null>} Admin user or null
 */
export async function getAdminById(id) {
  const sql = `SELECT * FROM ${TABLE} WHERE id = ?`;
  return await queryOne(sql, [id]);
}

/**
 * Create a new admin user
 * @param {Object} data - Admin data
 * @returns {Promise<number>} Inserted ID
 */
export async function createAdmin(data) {
  const passwordHash = await bcrypt.hash(data.password, 10);

  return await insert(TABLE, {
    username: data.username,
    password_hash: passwordHash,
    role: data.role || 'admin',
    is_active: true
  });
}

/**
 * Update admin password
 * @param {number} id - Admin ID
 * @param {string} newPassword - New password (plain text)
 * @returns {Promise<number>} Affected rows
 */
export async function updateAdminPassword(id, newPassword) {
  const passwordHash = await bcrypt.hash(newPassword, 10);
  return await update(TABLE, { password_hash: passwordHash }, 'id = ?', [id]);
}

/**
 * Verify admin password
 * @param {string} username - Username
 * @param {string} password - Password to verify
 * @returns {Promise<Object|null>} Admin user if valid, null otherwise
 */
export async function verifyAdminPassword(username, password) {
  const admin = await getAdminByUsername(username);
  if (!admin) return null;

  const isValid = await bcrypt.compare(password, admin.password_hash);
  if (!isValid) return null;

  // Return without password hash
  const { password_hash, ...safeAdmin } = admin;
  return safeAdmin;
}

/**
 * Check if admin exists
 * @param {string} username - Username
 * @returns {Promise<boolean>} Exists
 */
export async function adminExists(username) {
  return await exists(TABLE, 'username = ?', [username]);
}

/**
 * Get all admin users
 * @returns {Promise<Array>} All admin users
 */
export async function getAllAdmins() {
  const sql = `SELECT id, username, role, is_active, created_at FROM ${TABLE} ORDER BY created_at DESC`;
  return await query(sql);
}

/**
 * Deactivate an admin
 * @param {number} id - Admin ID
 * @returns {Promise<number>} Affected rows
 */
export async function deactivateAdmin(id) {
  return await update(TABLE, { is_active: false }, 'id = ?', [id]);
}

/**
 * Activate an admin
 * @param {number} id - Admin ID
 * @returns {Promise<number>} Affected rows
 */
export async function activateAdmin(id) {
  return await update(TABLE, { is_active: true }, 'id = ?', [id]);
}

export default {
  getAdminByUsername,
  getAdminById,
  createAdmin,
  updateAdminPassword,
  verifyAdminPassword,
  adminExists,
  getAllAdmins,
  deactivateAdmin,
  activateAdmin
};
