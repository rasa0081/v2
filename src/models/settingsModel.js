// src/models/settingsModel.js - MySQL-based Settings Data Access Layer
import { query, queryOne, insert, update, exists } from '@/lib/mysql';

const TABLE = 'settings';

/**
 * Get all settings
 * @returns {Promise<Object>} Settings as key-value object
 */
export async function getAllSettings() {
  const sql = `SELECT setting_key, setting_value FROM ${TABLE}`;
  const results = await query(sql);

  const settings = {};
  results.forEach(row => {
    settings[row.setting_key] = row.setting_value;
  });

  return settings;
}

/**
 * Get a specific setting
 * @param {string} key - Setting key
 * @returns {Promise<Object|null>} Setting value or null
 */
export async function getSetting(key) {
  const sql = `SELECT setting_value FROM ${TABLE} WHERE setting_key = ?`;
  return await queryOne(sql, [key]);
}

/**
 * Get a setting with type conversion
 * @param {string} key - Setting key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Setting value or default
 */
export async function getSettingWithDefault(key, defaultValue = null) {
  const value = await getSetting(key);
  if (value === null) return defaultValue;
  return value;
}

/**
 * Set a setting
 * @param {string} key - Setting key
 * @param {*} value - Setting value (will be JSON stringified if object/array)
 * @param {string} updatedBy - Who updated it
 * @returns {Promise<boolean>} Success
 */
export async function setSetting(key, value, updatedBy = 'system') {
  // Stringify objects/arrays
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;

  // Use INSERT ... ON DUPLICATE KEY UPDATE
  const sql = `
    INSERT INTO ${TABLE} (setting_key, setting_value, updated_by)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_by = VALUES(updated_by)
  `;

  try {
    await query(sql, [key, stringValue, updatedBy]);
    return true;
  } catch (error) {
    console.error('Error setting setting:', error);
    return false;
  }
}

/**
 * Set multiple settings at once
 * @param {Object} settings - Settings object
 * @param {string} updatedBy - Who updated them
 * @returns {Promise<boolean>} Success
 */
export async function setMultipleSettings(settings, updatedBy = 'system') {
  for (const [key, value] of Object.entries(settings)) {
    await setSetting(key, value, updatedBy);
  }
  return true;
}

/**
 * Delete a setting
 * @param {string} key - Setting key
 * @returns {Promise<number>} Affected rows
 */
export async function deleteSetting(key) {
  const sql = `DELETE FROM ${TABLE} WHERE setting_key = ?`;
  const result = await query(sql, [key]);
  return result.affectedRows;
}

/**
 * Check if a setting exists
 * @param {string} key - Setting key
 * @returns {Promise<boolean>} Exists
 */
export async function settingExists(key) {
  return await exists(TABLE, 'setting_key = ?', [key]);
}

export default {
  getAllSettings,
  getSetting,
  getSettingWithDefault,
  setSetting,
  setMultipleSettings,
  deleteSetting,
  settingExists
};
