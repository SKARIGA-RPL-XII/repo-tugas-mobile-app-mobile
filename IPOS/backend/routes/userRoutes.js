const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const verifyToken = require('../middleware/VerifyToken');
const upload = require('../middleware/upload');

router.get('/profile/:id', UserController.getProfile);
router.delete('/delete/:id', verifyToken, UserController.deleteAccount);
router.put('/update/:id', verifyToken, upload.single('foto'), UserController.updateProfile);

module.exports = router;