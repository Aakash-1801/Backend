const express = require('express');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: 'Welcome to your profile!',
    userId: req.user.userId
  });
});

module.exports = router;
