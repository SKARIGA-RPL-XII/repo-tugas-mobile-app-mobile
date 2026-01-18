const bcrypt = require('bcrypt');
const db = require('./config/db');

const adminData = {
  nama: 'admin',
  email: 'adm@email.com',
  password: '1234567890',
  no_telepon: '08123456789',
  roles: 'admin'
};

(async () => {
  try {
    console.log('--- Memulai Proses Setup Admin ---');
    
    // Cek koneksi database secara eksplisit
    const [testConn] = await db.query('SELECT 1 + 1 AS result');
    console.log('✅ Koneksi database berhasil.');

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
    console.log('✅ Password berhasil di-hash.');

    // Cek keberadaan user
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [adminData.email]);
    console.log(`🔍 Mencari email ${adminData.email}... Ditemukan: ${existingUsers.length}`);

    if (existingUsers.length > 0) {
      console.log('🔄 Mengupdate user yang sudah ada...');
      const [updateResult] = await db.query(
        'UPDATE users SET password = ?, roles = ? WHERE email = ?',
        [hashedPassword, adminData.roles, adminData.email]
      );
      console.log('✅ Berhasil Update. Baris terpengaruh:', updateResult.affectedRows);
    } else {
      console.log('➕ Membuat user baru...');
      const [insertResult] = await db.query(
        'INSERT INTO users (nama, email, password, no_telepon, roles) VALUES (?, ?, ?, ?, ?)',
        [adminData.nama, adminData.email, hashedPassword, adminData.no_telepon, adminData.roles]
      );
      console.log('✅ Berhasil Insert. ID Baru:', insertResult.insertId);
    }

    console.log('--- Selesai ---');
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR FATAL:', error);
    process.exit(1);
  }
})();