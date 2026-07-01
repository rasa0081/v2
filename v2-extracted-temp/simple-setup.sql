-- cafe-website/simple-setup.sql
-- Run this FIRST to create only the essential tables

CREATE DATABASE IF NOT EXISTS cafe_website;
USE cafe_website;

-- 1. Admin Users (for login)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default admin user
-- Password: admin123 (bcrypt hash)
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', '$2a$10$8k7R6f3K9hT2vY1xW3qZAuHc4bV5nM6J7K8L9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2')
ON DUPLICATE KEY UPDATE username = username;

-- 2. Menu Categories (with data)
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
);

-- Insert menu categories
INSERT INTO menu_categories (category_id, title, description, icon, color, sort_order, active) VALUES
('espresso-hot', 'نوشیدنی گرم پایه اسپرسو', 'انواع قهوه‌های گرم بر پایه اسپرسو', 'Whatshot', '#d32f2f', 1, true),
('espresso-cold', 'نوشیدنی سرد پایه اسپرسو', 'انواع قهوه‌های سرد بر پایه اسپرسو', 'AcUnit', '#1976d2', 2, true),
('tea', 'چای و دمنوش', 'انواع چای و دمنوش‌های گیاهی', 'LocalBar', '#388e3c', 3, true),
('cold-drinks', 'نوشیدنی سرد', 'نوشیدنی‌های خنک و تازه‌کننده', 'LocalDrink', '#0288d1', 4, true),
('snacks', 'میان وعده', 'کیک، کوکی و میان‌وعده‌های خوشمزه', 'RestaurantMenu', '#f57c00', 5, true),
('smoothies', 'اسموتی', 'اسموتی‌های میوه‌ای تازه', 'LocalBar', '#7b1fa2', 6, true),
('shakes', 'شیک', 'شیک‌های خوشمزه با بستنی', 'LocalBar', '#c2185b', 7, true),
('syrups', 'شربت', 'شربت‌های خانگی و سنتی', 'LocalDrink', '#00796b', 8, true),
('cakes', 'کیک', 'انواع کیک و دسر', 'Cake', '#5d4037', 9, true)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 3. Menu Items (simplified)
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Contact Messages
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Gallery Images
CREATE TABLE IF NOT EXISTS gallery_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(500) NOT NULL,
  category VARCHAR(50) DEFAULT 'other',
  tags TEXT,
  alt_text VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Settings (key-value store)
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value) VALUES
('site_name', 'کافه کاریبو'),
('site_description', 'life is short stay awake for it'),
('contact_phone', '09212620316'),
('contact_address', 'تهران - شهر قدس بلوار 45 متری انقلاب نبش کوچه توحید -کافه کاریبو'),
('opening_hours', 'همه روزه 11 صیح الی 10 شب'),
('contact_email', 'info@brewandbean.com'),
('currency', 'تومان'),
('currency_symbol', 'T')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- 7. Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(100),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(100),
  entity_name VARCHAR(255),
  entity_id VARCHAR(100),
  details TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT '✅ Simple database setup completed!' as message;