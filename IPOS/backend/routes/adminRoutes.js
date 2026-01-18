const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/VerifyToken');
const upload = require('../middleware/upload');

router.get("/profile/:id", verifyToken, adminController.getProfile);
router.put("/update-profile/:id", verifyToken, upload.single("foto"), adminController.updateProfile);
router.post('/delete-account/:id', verifyToken, adminController.deleteAccount);
router.get('/users', verifyToken, adminController.getAllUsers);
router.delete('/users/:id', verifyToken, adminController.deleteUser);
router.get("/stats", adminController.getStats);

module.exports = router;