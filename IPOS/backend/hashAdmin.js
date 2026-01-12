const bcrypt = require('bcrypt');
const db = require('./db');

// DATA ADMIN
const plainPassword = '532008';
const email = 'ravlor@email.com';

(async () => {
  try {
    const hash = await bcrypt.hash(plainPassword, 10);

    await db.query(
      'UPDATE users SET password = ?, roles = "admin" WHERE email = ?',
      [hash, email]
    );

    console.log('Password admin berhasil di-hash & role diset admin');
    process.exit();
  } catch (error) {
    console.error('Gagal update password admin:', error);
    process.exit(1);
  }
})();
