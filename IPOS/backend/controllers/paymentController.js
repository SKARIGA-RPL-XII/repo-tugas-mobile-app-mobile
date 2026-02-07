const midtransClient = require('midtrans-client');
const db = require('../config/db');

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-XPw3F_xcgAvwMDukyJ2FwlSh',
    clientKey: 'SB-Mid-client-1u4Fe9fnrPCr4ne4'
});

exports.checkout = async (req, res) => {
    try {
        const { amount, customer_name, customer_email, items, meja_id, no_antrian_id } = req.body;
        
        // Pastikan variabel didefinisikan dengan benar
        const customer_id = req.user.id; 
        const kodeOrder = `INV-${Date.now()}`;

        const [result] = await db.execute(
            `INSERT INTO orders 
            (customer_id, kode_order, order_date, total_harga, total_pembayaran, meja_id, no_antrian_id, status_order) 
            VALUES (?, ?, NOW(), ?, ?, ?, ?, 'pending')`,
            [
                customer_id, 
                kodeOrder, 
                amount, 
                amount, 
                meja_id || null, 
                no_antrian_id || null, 
            ]
        );

        const newOrderId = result.insertId; // Menggunakan 'result' sesuai baris di atas

        // Masukkan ke detail_order
        const detailPromises = items.map(item => {
            return db.execute(
                `INSERT INTO detail_order (order_id, menu_id, quantity, subtotal) 
                 VALUES (?, ?, ?, ?)`,
                [newOrderId, item.id, item.qty, (item.price * item.qty)]
            );
        });
        await Promise.all(detailPromises);
        
        // 4. Konfigurasi Midtrans
        const parameter = {
            "transaction_details": {
                "order_id": kodeOrder,
                "gross_amount": amount
            },
            "customer_details": {
                "first_name": customer_name,
                "email": customer_email
            },
            "item_details": items.map(item => ({
                id: item.id.toString(), // Midtrans biasanya minta string untuk ID
                price: item.price,
                quantity: item.qty,
                name: item.name
            }))
        };

        const transaction = await snap.createTransaction(parameter);

        res.json({ 
            redirect_url: transaction.redirect_url,
            order_id: newOrderId,
            kode_order: kodeOrder // Opsional: kirim kode order juga
        });

    } catch (error) {
        console.error('PAYMENT ERROR:', error);
        res.status(500).json({ message: "Gagal memproses pesanan" });
    }
};

exports.notification = async (req, res) => {
    try {
        const statusResponse = await snap.transaction.notification(req.body);
        const { order_id, transaction_status, fraud_status } = statusResponse;

        console.log(`Log Midtrans: Order ${order_id} is ${transaction_status}`);

        let orderStatusInDb = '';

        if (transaction_status == 'settlement' || transaction_status == 'capture') {
            orderStatusInDb = 'sudah';
        } else if (transaction_status == 'pending') {
            orderStatusInDb = 'pending';
        } else {
            orderStatusInDb = 'belum'; 
        }

        if (orderStatusInDb !== '') {
            // Gunakan kode_order untuk update
            await db.execute(
                `UPDATE orders SET status_order = ? WHERE kode_order = ?`,
                [orderStatusInDb, order_id]
            );
            console.log(`✅ Database Updated: ${order_id} -> ${orderStatusInDb}`);
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).send('Error');
    }
};

exports.myOrder = async (req, res) => {
  try {
    const userId = req.user.id; 
    const [orders] = await db.execute(
      "SELECT * FROM orders WHERE customer_id = ? ORDER BY id DESC LIMIT 1",
      [userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Belum ada pesanan." });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error di myOrder Controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};