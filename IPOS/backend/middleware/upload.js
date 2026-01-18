const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder public/avatars ada, jika tidak, buat otomatis
const dir = './public/avatars';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// Konfigurasi Penyimpanan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/avatars');
    },
    filename: (req, file, cb) => {
        // Format nama: avatar-timestamp.ekstensi
        cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Filter file (Hanya izinkan gambar)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Hanya file gambar yang diizinkan!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, 
    fileFilter: fileFilter
});

module.exports = upload;