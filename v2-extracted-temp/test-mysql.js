// check-databases.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Cannot connect to MySQL:', err.message);
    return;
  }
  
  console.log('✅ Connected to XAMPP MySQL');
  
  connection.query('SHOW DATABASES', (error, results) => {
    if (error) throw error;
    
    const databases = results.map(r => r.Database);
    console.log('\n📊 All databases on your system:');
    databases.forEach(db => console.log('  -', db));
    
    console.log('\n🔍 Looking for cafe databases:');
    const cafeDbs = databases.filter(db => db.includes('cafe'));
    if (cafeDbs.length > 0) {
      cafeDbs.forEach(db => console.log('  ✅ Found:', db));
    } else {
      console.log('  ❌ No cafe database found');
    }
    
    connection.end();
  });
});