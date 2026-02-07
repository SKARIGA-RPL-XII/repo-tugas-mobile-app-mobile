const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/AuthRoutes');
const menuRoutes = require('./routes/menuRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mejaRoutes = require('./routes/mejaRoutes');
const userMenuRoutes = require('./routes/userMenuRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));
app.use('/avatars', express.static('public/avatars'));

app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/meja', mejaRoutes); 
app.use('/api/user-menu', userMenuRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);

module.exports = app;