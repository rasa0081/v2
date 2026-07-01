// scripts/seed-data.js - Sample Data Seeding Script
require('dotenv').config();
const mysql = require('mysql2/promise');

async function seedData() {
  console.log('🌱 Seeding sample data...\n');

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'cafe_website'
  });

  try {
    // Sample menu items for each category
    console.log('🍽️  Adding sample menu items...\n');

    const sampleMenuItems = [
      // Espresso Hot Drinks
      { name: 'اسپرسو', description: 'اسپرسوی خالص ایتالیایی', price: 45000, category: 'espresso-hot', popular: true, ingredients: ['اسپرسو'], calories: 5 },
      { name: 'دبل اسپرسو', description: 'دو شات اسپرسو', price: 65000, category: 'espresso-hot', popular: false, ingredients: ['اسپرسو'], calories: 10 },
      { name: 'آمریکانو', description: 'اسپرسو با آب جوش', price: 50000, category: 'espresso-hot', popular: true, ingredients: ['اسپرسو', 'آب'], calories: 10 },
      { name: 'کاپوچینو', description: 'اسپرسو با شیر کف‌دار', price: 65000, category: 'espresso-hot', popular: true, ingredients: ['اسپرسو', 'شیر', 'کاکائو'], calories: 120 },
      { name: 'لاته', description: 'اسپرسو با شیر بخارپز', price: 65000, category: 'espresso-hot', popular: true, ingredients: ['اسپرسو', 'شیر'], calories: 150 },
      { name: 'موکا', description: 'شکلات داغ با اسپرسو', price: 75000, category: 'espresso-hot', popular: false, ingredients: ['اسپرسو', 'شکلات', 'شیر'], calories: 200 },
      { name: 'کارامل ماکیاتو', description: 'اسپرسو با شیر و سیروپ کارامل', price: 70000, category: 'espresso-hot', popular: false, ingredients: ['اسپرسو', 'شیر', 'کارامل'], calories: 180 },
      { name: 'وانیل لاته', description: 'لاته با سیروپ وانیل', price: 75000, category: 'espresso-hot', popular: true, ingredients: ['اسپرسو', 'شیر', 'وانیل'], calories: 170 },

      // Espresso Cold Drinks
      { name: 'آیس آمریکانو', description: 'آمریکایو سرو سرد', price: 55000, category: 'espresso-cold', popular: true, ingredients: ['اسپرسو', 'آب', 'یخ'], calories: 15 },
      { name: 'آیس لاته', description: 'لاته سرد با یخ', price: 70000, category: 'espresso-cold', popular: true, ingredients: ['اسپرسو', 'شیر', 'یخ'], calories: 100 },
      { name: 'آیس موکا', description: 'موکا سرد با یخ', price: 80000, category: 'espresso-cold', popular: false, ingredients: ['اسپرسو', 'شکلات', 'شیر', 'یخ'], calories: 180 },
      { name: 'کلد برو', description: 'قهوه سرد دم‌کرده', price: 60000, category: 'espresso-cold', popular: true, ingredients: ['قهوه سرد'], calories: 5 },
      { name: 'اسپرسو تونیک', description: 'اسپرسو با آب‌تونیک', price: 70000, category: 'espresso-cold', popular: false, ingredients: ['اسپرسو', 'آب‌تونیک', 'لیمو'], calories: 50 },

      // Tea
      { name: 'چای سیاه', description: 'چای سیاه ایرانی', price: 35000, category: 'tea', popular: true, ingredients: ['چای سیاه'], calories: 2 },
      { name: 'چای سبز', description: 'چای سبز با عسل', price: 45000, category: 'tea', popular: true, ingredients: ['چای سبز', 'عسل'], calories: 30 },
      { name: 'دمنوش نعناع', description: 'دمنوش تازه نعناع', price: 50000, category: 'tea', popular: true, ingredients: ['نعناع', 'لیمو'], calories: 10 },
      { name: 'دمنوش بابونه', description: 'دمنوش آرام‌بخش بابونه', price: 50000, category: 'tea', popular: false, ingredients: ['بابونه', 'عسل'], calories: 25 },
      { name: 'چای ماسالا', description: 'چای هندی با ادویه', price: 60000, category: 'tea', popular: false, ingredients: ['چای', 'شیر', 'ادویه', 'عسل'], calories: 80 },
      { name: 'دمنوش زنجبیل', description: 'دمنوش گرم زنجبیل', price: 55000, category: 'tea', popular: true, ingredients: ['زنجبیل', 'لیمو', 'عسل'], calories: 40 },

      // Cold Drinks
      { name: 'لیموناد', description: 'لیموناد خانگی', price: 40000, category: 'cold-drinks', popular: true, ingredients: ['لیمو', 'شکر', 'آب'], calories: 80 },
      { name: 'موهیتو', description: 'موهیتو بدون الکل', price: 55000, category: 'cold-drinks', popular: true, ingredients: ['نعناع', 'لیمو', 'شکر', 'سودا'], calories: 60 },
      { name: 'آب‌میوه طبیعی', description: 'آب‌میوه فصل', price: 60000, category: 'cold-drinks', popular: true, ingredients: ['میوه‌های تازه'], calories: 100 },
      { name: 'چای سرد', description: 'چای سرد با لیمو', price: 45000, category: 'cold-drinks', popular: false, ingredients: ['چای', 'لیمو', 'یخ'], calories: 40 },

      // Snacks
      { name: 'کرواسان', description: 'کرواسان کره‌ای', price: 45000, category: 'snacks', popular: true, ingredients: ['آرد', 'کره', 'شیر'], calories: 250 },
      { name: 'مافین شکلاتی', description: 'مافین با مغز شکلات', price: 50000, category: 'snacks', popular: true, ingredients: ['آرد', 'شکلات', 'کره'], calories: 300 },
      { name: 'کوکی جو دوسر', description: 'کوکی سالم با جو دوسر', price: 40000, category: 'snacks', popular: false, ingredients: ['جو دوسر', 'عسل', 'گردو'], calories: 180 },
      { name: 'ساندویچ تست', description: 'تست با پنیر و گوجه', price: 55000, category: 'snacks', popular: false, ingredients: ['نان تست', 'پنیر', 'گوجه'], calories: 220 },
      { name: 'دونات', description: 'دونات شکری', price: 45000, category: 'snacks', popular: true, ingredients: ['آرد', 'شکر', 'روغن'], calories: 280 },

      // Smoothies
      { name: 'اسموتی موز', description: 'موز با شیر و عسل', price: 75000, category: 'smoothies', popular: true, ingredients: ['موز', 'شیر', 'عسل'], calories: 200 },
      { name: 'اسموتی توت‌فرنگی', description: 'توت‌فرنگی با ماست', price: 80000, category: 'smoothies', popular: true, ingredients: ['توت‌فرنگی', 'ماست', 'شکر'], calories: 180 },
      { name: 'اسموزی مخلوط', description: 'میوه‌های تازه فصل', price: 85000, category: 'smoothies', popular: false, ingredients: ['میوه‌های تازه'], calories: 150 },
      { name: 'اسموتی انبه', description: 'انبه با شیر نارگیل', price: 90000, category: 'smoothies', popular: true, ingredients: ['انبه', 'شیر نارگیل'], calories: 220 },

      // Shakes
      { name: 'شیک شکلات', description: 'شیک شکلات با بستنی', price: 85000, category: 'shakes', popular: true, ingredients: ['شکلات', 'بستنی', 'شیر'], calories: 350 },
      { name: 'شیک توت‌فرنگی', description: 'شیک توت‌فرنگی با بستنی', price: 85000, category: 'shakes', popular: true, ingredients: ['توت‌فرنگی', 'بستنی', 'شیر'], calories: 320 },
      { name: 'شیک کارامل', description: 'شیک کارامل با بستنی', price: 90000, category: 'shakes', popular: false, ingredients: ['کارامل', 'بستنی', 'شیر'], calories: 380 },
      { name: 'شیک وانیل', description: 'شیک کلاسیک وانیل', price: 80000, category: 'shakes', popular: false, ingredients: ['وانیل', 'بستنی', 'شیر'], calories: 300 },

      // Syrups
      { name: 'شربت آلبالو', description: 'شربت خانگی آلبالو', price: 35000, category: 'syrups', popular: true, ingredients: ['آلبالو', 'شکر', 'آب'], calories: 120 },
      { name: 'شربت زعفران', description: 'شربت زعفران با یخ', price: 40000, category: 'syrups', popular: true, ingredients: ['زعفران', 'شکر', 'آب'], calories: 100 },
      { name: 'شربت بهارنارنج', description: 'شربت گل بهارنارنج', price: 40000, category: 'syrups', popular: false, ingredients: ['بهارنارنج', 'شکر'], calories: 110 },
      { name: 'شربت سکنجبین', description: 'سکنجبین با تخم‌مرغ', price: 45000, category: 'syrups', popular: false, ingredients: ['سرکه', 'شکر', 'تخم‌مرغ'], calories: 150 },

      // Cakes
      { name: 'چیزکیک', description: 'چیزکیک نیویورکی', price: 85000, category: 'cakes', popular: true, ingredients: ['پنیر خامه‌ای', 'بیسکویت', 'خامه'], calories: 400 },
      { name: 'تیرامیسو', description: 'دسر ایتالیایی', price: 95000, category: 'cakes', popular: true, ingredients: ['ماسکارپونه', 'قهوه', 'بیسکویت'], calories: 450 },
      { name: 'براونی', description: 'کیک شکلاتی', price: 75000, category: 'cakes', popular: true, ingredients: ['شکلات', 'کره', 'آرد'], calories: 380 },
      { name: 'کیک شاه‌توت', description: 'کیک با شاه‌توت تازه', price: 90000, category: 'cakes', popular: false, ingredients: ['شاه‌توت', 'خامه', 'کیک'], calories: 350 },
      { name: 'پانکیک', description: 'پانکیک با عسل و میوه', price: 70000, category: 'cakes', popular: true, ingredients: ['آرد', 'شیر', 'تخم‌مرغ', 'عسل'], calories: 300 }
    ];

    // Check if data already exists
    const [existingItems] = await connection.execute('SELECT COUNT(*) as count FROM menu_items');
    if (existingItems[0].count > 0) {
      console.log('⚠️  Menu items already exist. Skipping...');
    } else {
      let count = 0;
      for (const item of sampleMenuItems) {
        await connection.execute(`
          INSERT INTO menu_items (name, description, price, category_id, popular, ingredients, calories, image, available, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, '/menu-images/default-item.jpg', true, ?)
        `, [
          item.name,
          item.description,
          item.price,
          item.category,
          item.popular,
          JSON.stringify(item.ingredients),
          item.calories,
          count++
        ]);
      }
      console.log(`✅ Added ${sampleMenuItems.length} menu items\n`);
    }

    // Sample gallery images
    console.log('🖼️  Adding sample gallery images...');
    const [existingGallery] = await connection.execute('SELECT COUNT(*) as count FROM gallery_images');
    if (existingGallery[0].count > 0) {
      console.log('⚠️  Gallery images already exist. Skipping...');
    } else {
      const sampleGallery = [
        { title: 'فضای داخلی کافه', category: 'interior', url: '/gallery/interior-1.jpg' },
        { title: 'بار اسپرسو', category: 'coffee', url: '/gallery/coffee-1.jpg' },
        { title: 'کاپوچینو', category: 'coffee', url: '/gallery/cappuccino.jpg' },
        { title: 'دسرها', category: 'food', url: '/gallery/desserts.jpg' },
        { title: 'فضای باغ', category: 'interior', url: '/gallery/garden.jpg' },
        { title: 'لاته آرت', category: 'coffee', url: '/gallery/latte-art.jpg' }
      ];

      for (let i = 0; i < sampleGallery.length; i++) {
        await connection.execute(`
          INSERT INTO gallery_images (title, description, url, category, sort_order, is_active, uploaded_by)
          VALUES (?, ?, ?, ?, ?, true, 'system')
        `, [
          sampleGallery[i].title,
          '',
          sampleGallery[i].url,
          sampleGallery[i].category,
          i
        ]);
      }
      console.log(`✅ Added ${sampleGallery.length} gallery images\n`);
    }

    console.log('🎉 Sample data seeded successfully!\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Run seeding
seedData().catch(console.error);
