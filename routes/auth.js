const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// ✅ Register user
router.post('/register', async (req, res) => {
  try {
    // const { email, password } = req.body;
    const email = req.body.email;
    const password = req.body.password?.trim();

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('signup',req.body);
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ email, password });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    
    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login user and send JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('login', req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials1' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials2' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log('reset',req.body);
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;