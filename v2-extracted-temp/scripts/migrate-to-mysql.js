// scripts/migrate-to-mysql.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const { MongoClient } = require('mongodb');

async function migrate() {
  console.log('🚀 Starting migration from MongoDB to MySQL...');
  
  // Connect to MongoDB
  const mongoClient = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
  await mongoClient.connect();
  const mongoDb = mongoClient.db('cafe-website');
  
  // Connect to MySQL
  const mysqlConnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'cafe_website'
  });
  
  try {
    // 1. Migrate menu categories
    console.log('📦 Migrating menu categories...');
    const categories = await mongoDb.collection('menucategories').find({}).toArray();
    for (const category of categories) {
      await mysqlConnection.execute(
        `INSERT INTO menu_categories (category_id, title, description, icon, sort_order, active) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          category.id,
          category.title,
          category.description,
          category.icon || 'LocalCafe',
          category.order || 0,
          category.active !== false
        ]
      );
    }
    
    // 2. Migrate menu items
    console.log('🍽️  Migrating menu items...');
    const menuItems = await mongoDb.collection('menuitems').find({}).toArray();
    for (const item of menuItems) {
      await mysqlConnection.execute(
        `INSERT INTO menu_items (name, description, price, category_id, popular, ingredients, calories, image, available, sort_order) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.name,
          item.description,
          item.price,
          item.category,
          item.popular || false,
          JSON.stringify(item.ingredients || []),
          item.calories || null,
          item.image || '/menu-images/default-item.jpg',
          item.available !== false,
          item.order || 0
        ]
      );
    }
    
    // 3. Migrate gallery images
    console.log('🖼️  Migrating gallery images...');
    const galleryImages = await mongoDb.collection('galleryimages').find({}).toArray();
    for (const image of galleryImages) {
      await mysqlConnection.execute(
        `INSERT INTO gallery_images (title, description, url, thumbnail_url, category, tags, alt_text, sort_order, is_active, uploaded_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          image.title,
          image.description || '',
          image.url,
          image.thumbnailUrl || image.url,
          image.category || 'other',
          JSON.stringify(image.tags || []),
          image.altText || image.title,
          image.sortOrder || 0,
          image.isActive !== false,
          image.uploadedBy || 'admin'
        ]
      );
    }
    
    // 4. Migrate contact messages
    console.log('📧 Migrating contact messages...');
    const messages = await mongoDb.collection('contactmessages').find({}).toArray();
    for (const message of messages) {
      const [result] = await mysqlConnection.execute(
        `INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message, status, is_read) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          message.firstName,
          message.lastName,
          message.email,
          message.phone || null,
          message.subject,
          message.message,
          message.status || 'new',
          message.read || false
        ]
      );
      
      // Migrate admin notes if they exist
      if (message.adminNotes && message.adminNotes.length > 0) {
        for (const note of message.adminNotes) {
          await mysqlConnection.execute(
            `INSERT INTO admin_notes (message_id, note, admin_id) VALUES (?, ?, ?)`,
            [result.insertId, note.note, note.adminId || 'admin']
          );
        }
      }
    }
    
    // 5. Migrate notifications
    console.log('🔔 Migrating notifications...');
    const notifications = await mongoDb.collection('notifications').find({}).toArray();
    for (const notification of notifications) {
      await mysqlConnection.execute(
        `INSERT INTO notifications (type, title, message, data, is_read, priority) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          notification.type,
          notification.title,
          notification.message,
          JSON.stringify(notification.data || {}),
          notification.read || false,
          notification.priority || 'medium'
        ]
      );
    }
    
    // 6. Insert default admin user
    console.log('👤 Creating admin user...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    
    await mysqlConnection.execute(
      `INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)`,
      [process.env.ADMIN_USERNAME, hashedPassword, 'admin']
    );
    
    // 7. Insert default settings
    console.log('⚙️  Inserting default settings...');
    const defaultSettings = [
      ['site_name', JSON.stringify('کافه کاریبو')],
      ['site_description', JSON.stringify('کافه مورد علاقه شما در محله')],
      ['currency', JSON.stringify('IRR')],
      ['currency_symbol', JSON.stringify('ریال')],
      ['opening_hours', JSON.stringify('همه روزه 11 صبح الی 10 شب')],
      ['contact_address', JSON.stringify('تهران - شهر قدس بلوار ۴۵ متری انقلاب نبش کوچه توحید')],
      ['contact_phone', JSON.stringify('09212620316')],
      ['contact_email', JSON.stringify('info@cariboucafe.ir')],
      ['social_instagram', JSON.stringify('https://www.instagram.com/cafecaribou')]
    ];
    
    for (const [key, value] of defaultSettings) {
      await mysqlConnection.execute(
        `INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, value]
      );
    }
    
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoClient.close();
    await mysqlConnection.end();
    console.log('🔌 Connections closed.');
  }
}

migrate();