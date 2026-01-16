const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/AuthRoutes');
const menuRoutes = require('./routes/menuRoutes');
const app = express();

app.use(cors());
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes); 

module.exports = app;