// scripts/setup-database.js - Database Setup Script for MySQL
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  console.log('🚀 Setting up MySQL database for Cafe Website...\n');

  // Create connection without database
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    charset: 'utf8mb4',
    timezone: '+00:00'
  });

  const dbName = process.env.MYSQL_DATABASE || 'cafe_website';

  try {
    // Create database
    console.log(`📦 Creating database "${dbName}"...`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database "${dbName}" created/verified\n`);

    // Use the database - use query() instead of execute() for USE command
    await connection.query(`USE ${dbName}`);
    console.log(`✅ Using database "${dbName}"\n`);

    // Create tables
    console.log('📋 Creating tables...\n');

    // 1. Admin Users Table
    console.log('1. Creating admin_users table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('   ✅ admin_users table created\n');

    // 2. Menu Categories Table
    console.log('2. Creating menu_categories table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS menu_categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        category_id VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(100),
        color VARCHAR(20),
        sort_order INT DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('   ✅ menu_categories table created\n');

    // 3. Menu Items Table
    console.log('3. Creating menu_items table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category_id VARCHAR(50) NOT NULL,
        popular BOOLEAN DEFAULT FALSE,
        ingredients TEXT,
        calories INT,
        image VARCHAR(500) DEFAULT '/menu-images/default-item.jpg',
        available BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category (category_id),
        INDEX idx_available (available),
        INDEX idx_popular (popular)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('   ✅ menu_items table created\n');

    // 4. Contact Messages Table
    console.log('4. Creating contact_messages table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'new',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('   ✅ contact_messages table created\n');

    // 5. Gallery Images Table
    console.log('5. Creating gallery_images table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        url VARCHAR(500) NOT NULL,
        category VARCHAR(50) DEFAULT 'other',
        tags TEXT,
        alt_text VARCHAR(500),
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        uploaded_by VARCHAR(100) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('   ✅ gallery_images table created\n');

    // 6. Notifications Table
    console.log('6. Creating notifications table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        data TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        priority VARCHAR(20) DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_read (is_read),
        INDEX idx_type (type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('   ✅ notifications table created\n');

    // 7. Settings Table
    console.log('7. Creating settings table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        updated_by VARCHAR(100),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Add missing columns if table exists but columns are missing
    try {
      try {
        await connection.execute(`ALTER TABLE settings ADD COLUMN updated_by VARCHAR(100)`);
      } catch (colError) {
        // Column might already exist, ignore error
      }
    } catch (e) {
      // Ignore column addition errors - table might already have the column
    }
    
    console.log('   ✅ settings table created\n');

    // 8. Activity Logs Table
    console.log('8. Creating activity_logs table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id VARCHAR(100) DEFAULT 'admin',
        action VARCHAR(50) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_name VARCHAR(255) NOT NULL,
        entity_id INT,
        details TEXT,
        ip_address VARCHAR(100),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_entity (entity_type, entity_id),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('   ✅ activity_logs table created\n');

    // Insert default admin user
    console.log('👤 Setting up default admin user...');
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';

    await connection.execute(`
      INSERT INTO admin_users (username, password_hash, role)
      VALUES (?, ?, 'admin')
      ON DUPLICATE KEY UPDATE username = username
    `, [adminUsername, hashedPassword]);
    console.log(`   ✅ Admin user "${adminUsername}" created/verified (password: ${adminPassword})\n`);

    // Insert default settings
    console.log('⚙️  Inserting default settings...');
    const defaultSettings = [
      ['site_name', JSON.stringify('کافه کاریبو'), 'system'],
      ['site_description', JSON.stringify('کافه مورد علاقه شما در محله'), 'system'],
      ['site_logo', JSON.stringify('/logo.png'), 'system'],
      ['currency', JSON.stringify('IRR'), 'system'],
      ['currency_symbol', JSON.stringify('ریال'), 'system'],
      ['currency_format', JSON.stringify('تومان'), 'system'],
      ['opening_hours', JSON.stringify('همه روزه 11 صبح الی 10 شب'), 'system'],
      ['contact_address', JSON.stringify('تهران - شهر قدس'), 'system'],
      ['contact_phone', JSON.stringify('09212620316'), 'system'],
      ['contact_email', JSON.stringify('info@cariboucafe.ir'), 'system'],
      ['social_instagram', JSON.stringify('https://www.instagram.com/cafecaribou'), 'system'],
      ['social_telegram', JSON.stringify('https://t.me/cariboucafe'), 'system'],
      ['maintenance_mode', JSON.stringify(false), 'system'],
      ['enable_online_orders', JSON.stringify(false), 'system'],
      ['enable_reservations', JSON.stringify(false), 'system'],
      ['enable_gallery', JSON.stringify(true), 'system']
    ];

    for (const [key, value, updatedBy] of defaultSettings) {
      await connection.execute(`
        INSERT INTO settings (setting_key, setting_value, updated_by)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_by = VALUES(updated_by)
      `, [key, value, updatedBy]);
    }
    console.log('   ✅ Default settings inserted\n');

    // Insert default menu categories
    console.log('🍽️  Inserting default menu categories...');
    const defaultCategories = [
      ['espresso-hot', 'نوشیدنی گرم', 'نوشیدنی‌های گرم پایه اسپرسو', 'LocalCafe', '#8B4513', 1],
      ['espresso-cold', 'نوشیدنی سرد', 'نوشیدنی‌های سرد پایه اسپرسو', 'IceCoffee', '#4682B4', 2],
      ['tea', 'چای و دمنوش', 'انواع چای و دمنوش‌های گیاهی', 'LocalCafe', '#228B22', 3],
      ['cold-drinks', 'نوشیدنی سرد', 'نوشیدنی‌های بدون کافئین', 'FreeBreakfast', '#00CED1', 4],
      ['snacks', 'میان‌وعده', 'انواع کیک و شیرینی', 'BakeryDining', '#DAA520', 5],
      ['smoothies', 'اسموتی', 'اسموتی‌های میوه‌ای', 'Blender', '#FF69B4', 6],
      ['shakes', 'شیک', 'شیک‌های خوشمزه', 'Blender', '#DEB887', 7],
      ['syrups', 'شربت', 'شربت‌های خانگی', 'LocalBar', '#9370DB', 8],
      ['cakes', 'کیک', 'انواع کیک تازه', 'Cake', '#FF6347', 9]
    ];

    for (const [id, title, desc, icon, color, order] of defaultCategories) {
      await connection.execute(`
        INSERT INTO menu_categories (category_id, title, description, icon, color, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE title = VALUES(title)
      `, [id, title, desc, icon, color, order]);
    }
    console.log('   ✅ Default menu categories inserted\n');

    console.log('🎉 Database setup completed successfully!\n');
    console.log('📝 Next steps:');
    console.log('   1. Update your .env.local with correct MySQL credentials');
    console.log('   2. Run "npm run db:seed" to add sample menu items');
    console.log('   3. Run "npm run dev" to start the development server');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await connection.end();
    console.log('🔌 Database connection closed.');
  }
}

// Run setup
setupDatabase().catch(console.error);
