const express = require('express');
const router = express.Router();
const mejaController = require('../controllers/mejaController');
const verifyToken = require('../middleware/VerifyToken'); 

router.get('/', mejaController.getAllMeja);
router.post('/', mejaController.addMeja);
router.put('/:id', mejaController.updateMeja);
router.delete('/:id', mejaController.deleteMeja);
router.put('/:id/status', verifyToken, mejaController.updateTableStatus);

module.exports = router;