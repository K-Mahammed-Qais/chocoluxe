const express = require('express');
const { authUser, registerUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;