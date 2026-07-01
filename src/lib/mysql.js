// src/lib/mysql.js - MySQL Database Connection and Utilities
import mysql from 'mysql2/promise';

// Database configuration from environment variables
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'cafe_website',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.MYSQL_CONNECTION_LIMIT || '10'),
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4',
  timezone: '+00:00',
  supportBigNumbers: true,
  bigNumberStrings: false
};

// Connection pool singleton
let pool = null;

/**
 * Create and return the MySQL connection pool
 */
export function getPool() {
  if (!pool) {
    console.log('Creating MySQL connection pool...');
    pool = mysql.createPool(dbConfig);
    console.log('✅ MySQL connection pool created');
  }
  return pool;
}

/**
 * Test database connection
 */
export async function testConnection() {
  try {
    const connection = await getPool().getConnection();
    await connection.ping();
    console.log('✅ MySQL connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    console.log('Please check:');
    console.log('1. Is MySQL running?');
    console.log('2. Are environment variables set correctly?');
    console.log('3. Does the database exist?');
    return false;
  }
}

/**
 * Execute a query with parameters
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
export async function query(sql, params = []) {
  const p = getPool();
  try {
    const [results] = await p.execute(sql, params);
    return results;
  } catch (error) {
    console.error('❌ MySQL Query Error:', error.message);
    console.error('Query:', sql);
    console.error('Params:', params);
    throw error;
  }
}

/**
 * Get a single row from the database
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Object|null>} Single row or null
 */
export async function queryOne(sql, params = []) {
  const results = await query(sql, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Insert a row and return the inserted ID
 * @param {string} table - Table name
 * @param {Object} data - Data to insert
 * @returns {Promise<number>} Inserted row ID
 */
export async function insert(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

  const result = await query(sql, values);
  return result.insertId;
}

/**
 * Update rows in the database
 * @param {string} table - Table name
 * @param {Object} data - Data to update
 * @param {string} where - WHERE clause (without WHERE keyword)
 * @param {Array} whereParams - WHERE clause parameters
 * @returns {Promise<number>} Number of affected rows
 */
export async function update(table, data, where, whereParams = []) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map(key => `${key} = ?`).join(', ');
  const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;

  const result = await query(sql, [...values, ...whereParams]);
  return result.affectedRows;
}

/**
 * Delete rows from the database
 * @param {string} table - Table name
 * @param {string} where - WHERE clause (without WHERE keyword)
 * @param {Array} params - WHERE clause parameters
 * @returns {Promise<number>} Number of affected rows
 */
export async function remove(table, where, params = []) {
  const sql = `DELETE FROM ${table} WHERE ${where}`;
  const result = await query(sql, params);
  return result.affectedRows;
}

/**
 * Check if a record exists
 * @param {string} table - Table name
 * @param {string} where - WHERE clause
 * @param {Array} params - WHERE parameters
 * @returns {Promise<boolean>} True if exists
 */
export async function exists(table, where, params = []) {
  const sql = `SELECT 1 FROM ${table} WHERE ${where} LIMIT 1`;
  const result = await query(sql, params);
  return result.length > 0;
}

/**
 * Count rows in a table
 * @param {string} table - Table name
 * @param {string} where - Optional WHERE clause
 * @param {Array} params - WHERE parameters
 * @returns {Promise<number>} Row count
 */
export async function count(table, where = '1=1', params = []) {
  const sql = `SELECT COUNT(*) as total FROM ${table} WHERE ${where}`;
  const result = await query(sql, params);
  return result[0].total;
}

/**
 * Close the connection pool
 */
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('✅ MySQL connection pool closed');
  }
}

export default {
  getPool,
  testConnection,
  query,
  queryOne,
  insert,
  update,
  remove,
  exists,
  count,
  closePool
};
