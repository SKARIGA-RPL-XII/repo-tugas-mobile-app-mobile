const db = require('../config/db');

exports.addToCart = async (req, res) => {
    const { user_id, menu_id, quantity } = req.body;

    try {
        // 1. Cek apakah menu sudah ada di keranjang user ini
        const [existing] = await db.query(
            "SELECT * FROM keranjang WHERE user_id = ? AND menu_id = ?",
            [user_id, menu_id]
        );

        if (existing.length > 0) {
            // 2. Jika ada, UPDATE quantity-nya
            await db.query(
                "UPDATE keranjang SET quantity = quantity + ? WHERE user_id = ? AND menu_id = ?",
                [quantity, user_id, menu_id]
            );
        } else {
            // 3. Jika belum ada, INSERT data baru
            await db.query(
                "INSERT INTO keranjang (user_id, menu_id, quantity) VALUES (?, ?, ?)",
                [user_id, menu_id, quantity]
            );
        }

        res.status(200).json({ message: "Berhasil ditambahkan ke keranjang" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCart = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity minimal 1" });
        }

        await db.query("UPDATE keranjang SET quantity = ? WHERE id = ?", [quantity, id]);
        res.status(200).json({ message: "Jumlah berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCartItem = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query("DELETE FROM keranjang WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item tidak ditemukan" });
        }

        res.status(200).json({ message: "Item berhasil dihapus dari keranjang" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};