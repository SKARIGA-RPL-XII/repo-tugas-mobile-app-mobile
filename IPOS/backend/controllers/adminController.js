const db = require("../config/db");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

exports.getStats = async (req, res) => {
  try {
    const [userResult] = await db.query("SELECT COUNT(*) as total FROM users");
    const [menuResult] = await db.query("SELECT COUNT(*) as total FROM menus");
    const [mejaResult] = await db.query("SELECT COUNT(*) as total FROM meja");

    res.status(200).json({
      totalUsers: userResult[0].total,
      totalMenus: menuResult[0].total,
      totalTables: mejaResult[0].total,
    });
  } catch (error) {
    console.error("Error Dashboard Stats:", error);
    res.status(500).json({ message: "Server Error saat mengambil statistik" });
  }
};

exports.getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT id, nama, email, foto, roles FROM users WHERE id = ?", 
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({
      user: rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const { nama, email, password } = req.body;
  let newFoto = req.file ? req.file.filename : null;

  try {
    const [oldData] = await db.query("SELECT foto FROM users WHERE id = ?", [id]);
    if (oldData.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });

    const oldFotoName = oldData[0].foto;

    let sql = "UPDATE users SET nama = ?, email = ?";
    let params = [nama, email];

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      sql += ", password = ?";
      params.push(hashed);
    }

    if (newFoto) {
      sql += ", foto = ?";
      params.push(newFoto);

      if (oldFotoName) {
        const oldPath = path.join(__dirname, "../public/avatars", oldFotoName);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    sql += " WHERE id = ?";
    params.push(id);

    await db.query(sql, params);

    const [updatedUser] = await db.query(
      "SELECT id, nama, email, foto, roles FROM users WHERE id = ?",
      [id]
    );

    res.json({
      message: "Profile berhasil diperbarui",
      user: updatedUser[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT password, foto FROM users WHERE id = ?",
      [id],
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) return res.status(401).json({ message: "Password salah" });

    if (rows[0].foto) {
      const filePath = path.join(__dirname, "../public/avatars", rows[0].foto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "Akun berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, nama, email, no_telepon, foto, roles, password FROM users WHERE roles = 'user'"
        );

        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Tidak ada data user yang ditemukan" 
            });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error pada getAllUsers:", error);
        res.status(500).json({ 
            success: false, 
            message: "Terjadi kesalahan internal server" 
        });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params; // Mengambil ID dari URL

    try {
        // 1. Cek apakah user yang akan dihapus ada
        const [user] = await db.query("SELECT id FROM users WHERE id = ?", [id]);
        
        if (user.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "User tidak ditemukan" 
            });
        }

        // 2. Lakukan penghapusan
        await db.query("DELETE FROM users WHERE id = ?", [id]);

        res.status(200).json({ 
            success: true, 
            message: "User berhasil dihapus" 
        });
    } catch (error) {
        console.error("Error pada deleteUser:", error);
        res.status(500).json({ 
            success: false, 
            message: "Gagal menghapus user" 
        });
    }
};