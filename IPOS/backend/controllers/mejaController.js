const db = require('../config/db');

// 1. Ambil semua data meja
exports.getAllMeja = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM meja ORDER BY no_meja ASC");
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil data meja" });
    }
};

// 2. Tambah meja baru
exports.addMeja = async (req, res) => {
    const { no_meja, status } = req.body;
    try {
        // Cek apakah nomor meja sudah ada
        const [existing] = await db.query("SELECT id FROM meja WHERE no_meja = ?", [no_meja]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "Nomor meja sudah terdaftar" });
        }

        await db.query("INSERT INTO meja (no_meja, status) VALUES (?, ?)", [no_meja, status]);
        res.status(201).json({ success: true, message: "Meja berhasil ditambahkan" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal menambah meja" });
    }
};

// 3. Update nomor meja dan status
exports.updateMeja = async (req, res) => {
    const { id } = req.params;
    const { no_meja, status } = req.body;
    try {
        await db.query(
            "UPDATE meja SET no_meja = ?, status = ? WHERE id = ?",
            [no_meja, status, id]
        );
        res.status(200).json({ success: true, message: "Meja berhasil diperbarui" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal memperbarui meja" });
    }
};

// 4. Hapus meja
exports.deleteMeja = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM meja WHERE id = ?", [id]);
        res.status(200).json({ success: true, message: "Meja berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal menghapus meja" });
    }
};