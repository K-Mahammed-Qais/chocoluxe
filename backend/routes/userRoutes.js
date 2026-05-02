const { User } = require('../models');
const { protect, admin } = require('../middleware/auth');
const express = require('express');
const router = express.Router();

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  const users = await User.findAll();
  res.json(users.map(u => ({ ...u.toJSON(), _id: u.id })));
});

// @desc    Toggle block/unblock user (Admin only)
// @route   PUT /api/users/:id/block
// @access  Private/Admin
router.put('/:id/block', protect, admin, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    user.isBlocked = req.body.isBlocked;
    await user.save();
    res.json({ ...user.toJSON(), _id: user.id });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = router;