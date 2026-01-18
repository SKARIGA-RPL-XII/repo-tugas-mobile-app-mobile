const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/AuthRoutes');
const menuRoutes = require('./routes/menuRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mejaRoutes = require('./routes/mejaRoutes');
const app = express();

app.use(cors());
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));
app.use('/avatars', express.static('public/avatars'));

app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/meja', mejaRoutes); 
module.exports = app;