const express = require('express');
const router = express.Router();
const mejaController = require('../controllers/mejaController');

router.get('/', mejaController.getAllMeja);
router.post('/', mejaController.addMeja);
router.put('/:id', mejaController.updateMeja);
router.delete('/:id', mejaController.deleteMeja);

module.exports = router;