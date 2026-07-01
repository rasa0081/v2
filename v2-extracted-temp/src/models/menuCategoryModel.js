// src/models/menuCategoryModel.js - MySQL-based Menu Categories Data Access Layer
import { query, queryOne, insert, update, remove } from '@/lib/mysql';

const TABLE = 'menu_categories';

/**
 * Get all menu categories
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Categories
 */
export async function getAllCategories(filters = {}) {
  let sql = `SELECT * FROM ${TABLE} WHERE 1=1`;
  const params = [];

  if (filters.active !== undefined) {
    sql += ' AND active = ?';
    params.push(filters.active);
  }

  sql += ' ORDER BY sort_order ASC, title ASC';

  return await query(sql, params);
}

/**
 * Get category by ID
 * @param {string} categoryId - Category ID
 * @returns {Promise<Object|null>} Category or null
 */
export async function getCategoryById(categoryId) {
  const sql = `SELECT * FROM ${TABLE} WHERE category_id = ?`;
  return await queryOne(sql, [categoryId]);
}

/**
 * Get category by internal ID
 * @param {number} id - Internal ID
 * @returns {Promise<Object|null>} Category or null
 */
export async function getCategoryByInternalId(id) {
  const sql = `SELECT * FROM ${TABLE} WHERE id = ?`;
  return await queryOne(sql, [id]);
}

/**
 * Create a new category
 * @param {Object} data - Category data
 * @returns {Promise<number>} Inserted ID
 */
export async function createCategory(data) {
  return await insert(TABLE, {
    category_id: data.id,
    title: data.title,
    description: data.description || null,
    icon: data.icon || 'LocalCafe',
    color: data.color || null,
    sort_order: data.order || 0,
    active: data.active !== undefined ? data.active : true
  });
}

/**
 * Update a category
 * @param {string} categoryId - Category ID
 * @param {Object} data - Updated data
 * @returns {Promise<number>} Affected rows
 */
export async function updateCategory(categoryId, data) {
  const updateData = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.icon !== undefined) updateData.icon = data.icon;
  if (data.color !== undefined) updateData.color = data.color;
  if (data.order !== undefined) updateData.sort_order = data.order;
  if (data.active !== undefined) updateData.active = data.active;

  if (Object.keys(updateData).length === 0) return 0;

  return await update(updateData, 'category_id = ?', [categoryId]);
}

/**
 * Delete a category
 * @param {string} categoryId - Category ID
 * @returns {Promise<number>} Affected rows
 */
export async function deleteCategory(categoryId) {
  return await remove(TABLE, 'category_id = ?', [categoryId]);
}

/**
 * Count active categories
 * @returns {Promise<number>} Count
 */
export async function countActiveCategories() {
  return await count(TABLE, 'active = ?', [true]);
}

export default {
  getAllCategories,
  getCategoryById,
  getCategoryByInternalId,
  createCategory,
  updateCategory,
  deleteCategory,
  countActiveCategories
};
