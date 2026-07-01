// src/models/tableModel.js
import { query, queryOne, insert, update, remove } from '@/lib/mysql';

const TABLE = 'cafe_tables';

export async function getAllTables({ activeOnly = false } = {}) {
  let sql = `SELECT * FROM ${TABLE}`;
  if (activeOnly) sql += ' WHERE active = 1';
  sql += ' ORDER BY sort_order ASC, table_number ASC';
  return await query(sql);
}

export async function getTableById(id) {
  return await queryOne(`SELECT * FROM ${TABLE} WHERE id = ?`, [id]);
}

export async function createTable(data) {
  return await insert(TABLE, {
    table_number: data.table_number,
    label: data.label,
    capacity: data.capacity || 4,
    active: data.active !== undefined ? data.active : 1,
    sort_order: data.sort_order || 0,
  });
}

export async function updateTable(id, data) {
  const fields = {};
  if (data.table_number !== undefined) fields.table_number = data.table_number;
  if (data.label !== undefined) fields.label = data.label;
  if (data.capacity !== undefined) fields.capacity = data.capacity;
  if (data.active !== undefined) fields.active = data.active ? 1 : 0;
  if (data.sort_order !== undefined) fields.sort_order = data.sort_order;
  
  if (Object.keys(fields).length === 0) return 0;
  return await update(TABLE, fields, 'id = ?', [id]);
}

export async function deleteTable(id) {
  return await remove(TABLE, 'id = ?', [id]);
}

export default { getAllTables, getTableById, createTable, updateTable, deleteTable };