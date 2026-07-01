// src/models/menuModel.js - MySQL-based Menu Items Data Access Layer
import { query, queryOne, insert, update, remove, count } from '@/lib/mysql';
// Table name
const TABLE = 'menu_items';

/**
 * Get all menu items with optional filtering
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Menu items
 */
export async function getAllMenuItems(filters = {}) {
  let sql = `SELECT * FROM ${TABLE} WHERE 1=1`;
  const params = [];

  if (filters.available !== undefined) {
    sql += ' AND available = ?';
    params.push(filters.available);
  }

  if (filters.category) {
    sql += ' AND category_id = ?';
    params.push(filters.category);
  }

  if (filters.popular) {
    sql += ' AND popular = ?';
    params.push(filters.popular);
  }

  sql += ' ORDER BY sort_order ASC, name ASC';

  return await query(sql, params);
}

/**
 * Get menu item by ID
 * @param {number} id - Item ID
 * @returns {Promise<Object|null>} Menu item or null
 */
export async function getMenuItemById(id) {
  const sql = `SELECT * FROM ${TABLE} WHERE id = ?`;
  return await queryOne(sql, [id]);
}

/**
 * Get menu item by MongoDB-style _id (for compatibility)
 * @param {string} mongoId - MongoDB ObjectId string
 * @returns {Promise<Object|null>} Menu item or null
 */
export async function getMenuItemByMongoId(mongoId) {
  // Try to find by _id field which might store MongoDB-style IDs
  const sql = `SELECT * FROM ${TABLE} WHERE _id = ?`;
  return await queryOne(sql, [mongoId]);
}

/**
 * Create a new menu item
 * @param {Object} data - Menu item data
 * @returns {Promise<number>} Inserted item ID
 */
export async function createMenuItem(data) {
  return await insert(TABLE, {
    name: data.name,
    description: data.description || '',
    price: parseFloat(data.price) || 0,
    category_id: data.category,
    popular: data.popular || false,
    ingredients: Array.isArray(data.ingredients) ? JSON.stringify(data.ingredients) : data.ingredients,
    calories: data.calories ? parseInt(data.calories) : null,
    image: data.image || '/menu-images/default-item.jpg',
    available: data.available !== undefined ? data.available : true,
    sort_order: data.order || 0
  });
}

/**
 * Update a menu item
 * @param {number} id - Item ID
 * @param {Object} data - Updated data
 * @returns {Promise<number>} Affected rows
 */
export async function updateMenuItem(id, data) {
  const updateData = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = parseFloat(data.price);
  if (data.category !== undefined) updateData.category_id = data.category;
  if (data.popular !== undefined) updateData.popular = data.popular;
  if (data.ingredients !== undefined) updateData.ingredients = Array.isArray(data.ingredients) ? JSON.stringify(data.ingredients) : data.ingredients;
  if (data.calories !== undefined) updateData.calories = data.calories ? parseInt(data.calories) : null;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.available !== undefined) updateData.available = data.available;
  if (data.order !== undefined) updateData.sort_order = data.order;

  if (Object.keys(updateData).length === 0) return 0;

  return await update(TABLE, updateData, 'id = ?', [id]);
}

/**
 * Delete a menu item
 * @param {number} id - Item ID
 * @returns {Promise<number>} Affected rows
 */
export async function deleteMenuItem(id) {
  return await remove(TABLE, 'id = ?', [id]);
}

/**
 * Count available menu items
 * @returns {Promise<number>} Count
 */
export async function countAvailableItems() {
  return await count(TABLE, 'available = ?', [true]);
}

/**
 * Count popular items
 * @returns {Promise<number>} Count
 */
export async function countPopularItems() {
  return await count(TABLE, 'available = ? AND popular = ?', [true, true]);
}

/**
 * Search menu items
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Matching items
 */
export async function searchMenuItems(searchTerm) {
  const sql = `
    SELECT * FROM ${TABLE}
    WHERE (name LIKE ? OR description LIKE ? OR ingredients LIKE ?)
    AND available = ?
    ORDER BY name ASC
  `;
  const likeTerm = `%${searchTerm}%`;
  return await query(sql, [likeTerm, likeTerm, likeTerm, true]);
}

/**
 * Get items by category
 * @param {string} categoryId - Category ID
 * @param {boolean} availableOnly - Only available items
 * @returns {Promise<Array>} Items in category
 */
export async function getItemsByCategory(categoryId, availableOnly = true) {
  let sql = `SELECT * FROM ${TABLE} WHERE category_id = ?`;
  const params = [categoryId];

  if (availableOnly) {
    sql += ' AND available = ?';
    params.push(true);
  }

  sql += ' ORDER BY sort_order ASC, name ASC';

  return await query(sql, params);
}

export default {
  getAllMenuItems,
  getMenuItemById,
  getMenuItemByMongoId,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  countAvailableItems,
  countPopularItems,
  searchMenuItems,
  getItemsByCategory
};
