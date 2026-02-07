const db = require('../config/db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

exports.getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "SELECT id, nama, email, no_telepon, foto FROM users WHERE id = ?"; 
        
        const [results] = await db.query(query, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { id } = req.params; 
    const { nama, email, no_telepon, password } = req.body;
    let fotoBaru = req.file ? req.file.filename : null;

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        const userLama = rows[0];

        if (userLama.roles !== 'user') {
            return res.status(403).json({ message: "Akses ditolak: Hanya akun user yang dapat diubah" });
        }

        let updatedFields = [];
        let queryParams = [];

        if (nama) { updatedFields.push("nama = ?"); queryParams.push(nama); }
        if (email) { updatedFields.push("email = ?"); queryParams.push(email); }
        if (no_telepon) { updatedFields.push("no_telepon = ?"); queryParams.push(no_telepon); }

        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updatedFields.push("password = ?");
            queryParams.push(hashedPassword);
        }

        if (fotoBaru) {
            updatedFields.push("foto = ?");
            queryParams.push(fotoBaru);

            if (userLama.foto && userLama.foto !== 'default-avatar.png') {
                const oldPath = path.join(__dirname, '../public/avatars', userLama.foto);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        if (updatedFields.length === 0) {
            return res.status(400).json({ message: "Tidak ada perubahan data" });
        }

        queryParams.push(id);
        const queryUpdate = `UPDATE users SET ${updatedFields.join(", ")} WHERE id = ?`;
        await db.query(queryUpdate, queryParams);

        const [userTerbaru] = await db.query(
            "SELECT id, nama, email, no_telepon, foto, roles FROM users WHERE id = ?", 
            [id]
        );

        res.json({
            message: "Profil berhasil diperbarui",
            user: userTerbaru[0]
        });

    } catch (error) {
        console.error("UPDATE ERROR:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.deleteAccount = async (req, res) => {
    const { id } = req.params; 
    const { password } = req.body; 

    console.log("DEBUG: Menghapus User ID =", id);

    try {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        console.log("DEBUG: Hasil Query =", rows);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan di database" });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password salah" });
        }

        await db.query("DELETE FROM users WHERE id = ?", [id]);
        
        return res.json({ message: "Akun berhasil dihapus" });

    } catch (error) {
        console.error("ERROR DELETE:", error);
        return res.status(500).json({ message: error.message });
    }
};