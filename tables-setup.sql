-- tables-setup.sql
-- Run AFTER orders-setup.sql

USE cafe_website;

-- Cafe tables
CREATE TABLE IF NOT EXISTS cafe_tables (
  id INT PRIMARY KEY AUTO_INCREMENT,
  table_number VARCHAR(10) NOT NULL,
  label VARCHAR(100) NOT NULL,
  capacity INT DEFAULT 4,
  active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add table_id to orders
ALTER TABLE orders ADD COLUMN table_id INT DEFAULT NULL AFTER customer_note;
ALTER TABLE orders ADD COLUMN table_label VARCHAR(100) DEFAULT NULL AFTER table_id;

-- Insert some default tables
INSERT INTO cafe_tables (table_number, label, capacity, sort_order, active) VALUES
('1', 'میز ۱', 2, 1, 1),
('2', 'میز ۲', 4, 2, 1),
('3', 'میز ۳', 4, 3, 1),
('4', 'میز ۴', 6, 4, 1),
('5', 'میز ۵', 2, 5, 1),
('6', 'میز ۶', 4, 6, 1),
('7', 'میز ۷ (VIP)', 8, 7, 1),
('8', 'میز ۸ (تراس)', 4, 8, 1);

SELECT '✅ Tables created with 8 defaults!' as message;