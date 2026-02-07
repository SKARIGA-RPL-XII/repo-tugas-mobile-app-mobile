const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/VerifyToken'); 
const paymentMiddleware = require('../middleware/payment');
const paymentController = require('../controllers/paymentController');

router.post('/checkout', verifyToken, paymentMiddleware.validatePayment, paymentController.checkout);
router.post('/notification', paymentController.notification);
router.get("/my-orders", verifyToken, paymentController.myOrder);

module.exports = router;