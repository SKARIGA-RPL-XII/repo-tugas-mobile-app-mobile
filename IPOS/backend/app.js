const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/AuthRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

app.use('/api/auth', authRoutes);

module.exports = app;
