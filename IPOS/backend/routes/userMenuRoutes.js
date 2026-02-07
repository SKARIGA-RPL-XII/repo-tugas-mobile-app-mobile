const express = require('express');
const router = express.Router();
const UserMenuController = require('../controllers/userMenuController');

router.get('/menus', UserMenuController.getMenus);

module.exports = router;