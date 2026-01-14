const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { nama, email, no_telepon, password } = req.body;

    if (!nama || !email || !no_telepon || !password) {
      return res.status(400).json({ message: 'Data wajib diisi' });
    }

    const [exist] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (exist.length > 0) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (nama, email, no_telepon, password, roles)
       VALUES (?, ?, ?, ?, ?)`,
      [nama, email, no_telepon, hashedPassword, 'user']
    );

    return res.status(201).json({ message: 'Register berhasil' });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const [users] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (!users.length) {
    return res.status(401).json({ message: 'Email tidak ditemukan' });
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Password salah' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.roles,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.roles,
    },
  });
};
