const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const uploadMenu = require('../middleware/uploadMenu');

router.get('/getAll', menuController.getAllMenu);
router.post('/create', uploadMenu.single('foto'), menuController.createMenu);
router.delete('/:id', menuController.deleteMenu);
router.get('/:id', menuController.getMenuById);
router.put('/update/:id', uploadMenu.single('foto'), menuController.updateMenu);

module.exports = router;