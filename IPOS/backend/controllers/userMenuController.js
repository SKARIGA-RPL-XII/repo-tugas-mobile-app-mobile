const db = require('../config/db');

exports.getMenus = async (req, res) => {
    try {
        const query = "SELECT * FROM menus";
        
        const [results] = await db.query(query);

        const groupedData = {
            makanan: [],
            minuman: [],
            dessert: []
        };

        results.forEach(item => {
            const cat = item.kategori ? item.kategori.toLowerCase() : "";
            
            if (groupedData[cat]) {
                groupedData[cat].push({
                    id: item.id,
                    name: item.nama,
                    desc: item.deskripsi,
                    price: item.harga.toLocaleString('id-ID'),
                    imageUri: item.foto,
                    category: item.kategori
                });
            }
        });

        res.json(groupedData);

    } catch (error) {
        // Menangani error jika query gagal
        res.status(500).json({ 
            message: "Error fetching menus", 
            error: error.message 
        });
    }
};