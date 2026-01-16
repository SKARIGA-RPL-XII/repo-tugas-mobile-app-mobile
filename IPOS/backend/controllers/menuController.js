const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getAllMenu = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menus ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data menu' });
  }
};

exports.createMenu = async (req, res) => {
  try {
    const { nama, deskripsi, harga, kategori } = req.body;
    const foto = req.file ? req.file.filename : null;

    if (!nama || !harga || !foto || !deskripsi) {
      return res.status(400).json({ message: 'Semua kolom dan foto wajib diisi!' });
    }

    // Pembersihan harga dari titik (agar aman masuk ke database INT/DECIMAL)
    const hargaBersih = typeof harga === 'string' ? harga.replace(/\./g, '') : harga;

    const query = `INSERT INTO menus (nama, deskripsi, foto, harga, kategori) VALUES (?, ?, ?, ?, ?)`;

    const [result] = await db.query(query, [
      nama, 
      deskripsi, 
      foto, 
      parseInt(hargaBersih), 
      kategori.toLowerCase() 
    ]);

    res.status(201).json({ 
      message: 'Menu berhasil ditambahkan!', 
      id: result.insertId,
      filename: foto 
    });

  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ 
      message: 'Gagal menyimpan menu ke database',
      error: error.message 
    });
  }
};

exports.getMenuById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM menus WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Menu tidak ditemukan' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateMenu = async (req, res) => {
    const { id } = req.params;
    const { nama, harga, kategori, deskripsi } = req.body;
    let fotoBaru = req.file ? req.file.filename : null;

    try {
        const [oldData] = await db.query('SELECT foto FROM menus WHERE id = ?', [id]);
        if (oldData.length === 0) return res.status(404).json({ message: 'Menu tidak ditemukan' });

        const fotoLama = oldData[0].foto;
        let sql = 'UPDATE menus SET nama=?, harga=?, kategori=?, deskripsi=?';
        let params = [nama, harga, kategori, deskripsi];

        if (fotoBaru) {
            sql += ', foto=?';
            params.push(fotoBaru);
            const pathFotoLama = path.join(__dirname, '../public/menus/', fotoLama);
            if (fs.existsSync(pathFotoLama)) {
                fs.unlinkSync(pathFotoLama);
            }
        }

        sql += ' WHERE id=?';
        params.push(id);

        await db.query(sql, params);
        res.json({ message: 'Menu berhasil diperbarui' });

    } catch (error) {
      // Jika error dan sudah terlanjur upload foto baru, hapus foto baru tersebut (cleanup)
      if (fotoBaru) {
          const pathFotoBaru = path.join(__dirname, '../public/menus/', fotoBaru);
          if (fs.existsSync(pathFotoBaru)) fs.unlinkSync(pathFotoBaru);
      }
      res.status(500).json({ message: error.message });
    }
};

exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Cari nama file foto sebelum data di hapus di DB
    const [menu] = await db.query('SELECT foto FROM menus WHERE id = ?', [id]);

    if (menu.length === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }

    const fileName = menu[0].foto;
    // Sesuaikan path ke folder public/menus kamu
    const filePath = path.join(__dirname, '../public/menus/', fileName);

    // 2. Hapus data di database
    await db.query('DELETE FROM menus WHERE id = ?', [id]);

    // 3. Hapus file fisik jika ada
    if (fileName) {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error('Gagal menghapus file foto:', err);
        });
      }
    }

    res.json({ message: 'Menu dan foto berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus menu' });
  }
};