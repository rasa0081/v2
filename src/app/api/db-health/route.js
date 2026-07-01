// src/app/api/db-health/route.js
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      database: process.env.MYSQL_DATABASE || 'cafe_website',
      user: process.env.MYSQL_USERNAME || 'root',
      password: process.env.MYSQL_PASSWORD || ''
    });
    
    // Test connection
    await connection.ping();
    
    // Get tables
    const [tables] = await connection.execute('SHOW TABLES');
    
    // Get counts
    const tableCounts = {};
    for (const table of tables) {
      const tableName = table[`Tables_in_${process.env.MYSQL_DATABASE || 'cafe_website'}`];
      const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
      tableCounts[tableName] = count[0].count;
    }
    
    await connection.end();
    
    return NextResponse.json({
      success: true,
      database: 'XAMPP MySQL',
      status: 'connected',
      tables: tables.map(t => Object.values(t)[0]),
      counts: tableCounts,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Database health check failed:', error);
    
    return NextResponse.json({
      success: false,
      database: 'XAMPP MySQL',
      status: 'disconnected',
      error: error.message,
      help: 'Check if XAMPP MySQL is running (green light in control panel)',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}