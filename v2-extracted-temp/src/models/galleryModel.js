// src/models/galleryModel.js - MySQL-based Gallery Images Data Access Layer
import { query, queryOne, insert, update, remove, count } from '@/lib/mysql';

const TABLE = 'gallery_images';

/**
 * Get all gallery images with optional filtering
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Gallery images
 */
export async function getAllGalleryImages(filters = {}) {
  let sql = `SELECT * FROM ${TABLE} WHERE 1=1`;
  const params = [];

  if (filters.category && filters.category !== 'all') {
    sql += ' AND category = ?';
    params.push(filters.category);
  }

  if (filters.activeOnly !== false) {
    sql += ' AND is_active = ?';
    params.push(true);
  }

  sql += ' ORDER BY sort_order ASC, created_at DESC';

  // Add pagination if provided
  if (filters.limit) {
    const offset = ((filters.page || 1) - 1) * filters.limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(filters.limit, offset);
  }

  return await query(sql, params);
}

/**
 * Get gallery image by ID
 * @param {number} id - Image ID
 * @returns {Promise<Object|null>} Image or null
 */
export async function getGalleryImageById(id) {
  const sql = `SELECT * FROM ${TABLE} WHERE id = ?`;
  return await queryOne(sql, [id]);
}

/**
 * Get gallery image by MongoDB-style _id
 * @param {string} mongoId - MongoDB ObjectId
 * @returns {Promise<Object|null>} Image or null
 */
export async function getGalleryImageByMongoId(mongoId) {
  const sql = `SELECT * FROM ${TABLE} WHERE _id = ?`;
  return await queryOne(sql, [mongoId]);
}

/**
 * Create a new gallery image
 * @param {Object} data - Image data
 * @returns {Promise<number>} Inserted ID
 */
export async function createGalleryImage(data) {
  return await insert(TABLE, {
    title: data.title,
    description: data.description || '',
    url: data.url,
    category: data.category || 'other',
    tags: Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags,
    alt_text: data.altText || data.title,
    sort_order: data.sortOrder || 0,
    is_active: data.isActive !== undefined ? data.isActive : true,
    uploaded_by: data.uploadedBy || 'admin'
  });
}

/**
 * Update a gallery image
 * @param {number} id - Image ID
 * @param {Object} data - Updated data
 * @returns {Promise<number>} Affected rows
 */
export async function updateGalleryImage(id, data) {
  const updateData = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.url !== undefined) updateData.url = data.url;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.tags !== undefined) updateData.tags = Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags;
  if (data.altText !== undefined) updateData.alt_text = data.altText;
  if (data.sortOrder !== undefined) updateData.sort_order = data.sortOrder;
  if (data.isActive !== undefined) updateData.is_active = data.isActive;

  if (Object.keys(updateData).length === 0) return 0;

  return await update(TABLE, updateData, 'id = ?', [id]);
}

/**
 * Delete a gallery image
 * @param {number} id - Image ID
 * @returns {Promise<number>} Affected rows
 */
export async function deleteGalleryImage(id) {
  return await remove(TABLE, 'id = ?', [id]);
}

/**
 * Count gallery images
 * @param {Object} filters - Optional filters
 * @returns {Promise<number>} Count
 */
export async function countGalleryImages(filters = {}) {
  let where = '1=1';
  const params = [];

  if (filters.activeOnly) {
    where = 'is_active = ?';
    params.push(true);
  }

  return await count(TABLE, where, params);
}

/**
 * Get distinct categories
 * @returns {Promise<Array>} Categories
 */
export async function getDistinctCategories() {
  const sql = `SELECT DISTINCT category FROM ${TABLE} WHERE is_active = true ORDER BY category`;
  const results = await query(sql);
  return results.map(r => r.category);
}

/**
 * Get random images for showcase
 * @param {number} limit - Number of images
 * @returns {Promise<Array>} Random images
 */
export async function getRandomImages(limit = 6) {
  const sql = `SELECT * FROM ${TABLE} WHERE is_active = true ORDER BY RAND() LIMIT ?`;
  return await query(sql, [limit]);
}

export default {
  getAllGalleryImages,
  getGalleryImageById,
  getGalleryImageByMongoId,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  countGalleryImages,
  getDistinctCategories,
  getRandomImages
};
