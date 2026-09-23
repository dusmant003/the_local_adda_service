const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/auth.controller');
const authMiddleWare = require('../middleWares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleWare, getProfile);
router.put('/updateProfile', authMiddleWare, updateProfile)

module.exports = router;












module.exports = router;