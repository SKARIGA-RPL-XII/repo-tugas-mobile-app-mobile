const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const verifyToken = require('../middleware/VerifyToken');

router.post('/add', verifyToken, cartController.addToCart);
router.put('/update/:id', verifyToken, cartController.updateCart);
router.delete('/delete/:id', verifyToken, cartController.deleteCartItem);

module.exports = router;