// routes/auth.js
const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/multer');
const User = require('../models/User');
const Company = require('../models/Company');

const router = express.Router();

// REGISTER (User or Company)
router.post('/register', upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'companyLogo', maxCount: 1 }
]), async (req, res) => {
  try {
    const { role, email, password } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    const existsInUser = await User.findOne({ email });
    const existsInCompany = await Company.findOne({ email });

    if (existsInUser || existsInCompany) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    if (role === 'User') {
      const newUser = new User({
        ...req.body,
        password: hashedPassword,
        profilePic: req.files?.profilePic?.[0] ? `/uploads/${req.files.profilePic[0].filename}` : undefined
      });
      await newUser.save();

      const token = jwt.sign({ email: newUser.email, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(201).json({ message: 'User registered', token });
    } else if (role === 'Company') {
      const newCompany = new Company({
        ...req.body,
        password: hashedPassword,
        companyLogo: req.files?.companyLogo?.[0] ? `/uploads/${req.files.companyLogo[0].filename}` : undefined
      });
      await newCompany.save();

      const token = jwt.sign({ email: newCompany.email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(201).json({ message: 'Company registered', token });
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN (User or Company)
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const Model = role === 'Company' ? Company : User;
    const found = await Model.findOne({ email });

    if (!found) {
      return res.status(401).json({ message: `${role} not found` });
    }

    const isMatch = await bcrypt.compare(password, found.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: found.email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: `${role} login successful`, token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// reset password request
router.post('/request-reset', async (req, res) => {
  const { email, role } = req.body;

  const Model = role === 'Company' ? Company : User;
  const user = await Model.findOne({ email });

  if (!user) return res.status(404).json({ message: `${role} not found` });

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 15 * 60 * 1000; // 15 minutes

  user.resetToken = resetToken;
  user.resetTokenExpires = expires;
  await user.save();

  const resetLink = `http://localhost:3000/reset/${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.RESET_EMAIL,
      pass: process.env.RESET_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.RESET_EMAIL,
    to: email,
    subject: 'Password Reset Link',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
  });

  res.json({ message: 'Reset link sent to email.' });
});


router.post('/reset-password', async (req, res) => {
  const { token, newPassword, role } = req.body;

  const Model = role === 'Company' ? Company : User;
  const user = await Model.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = await bcrypt.hash(newPassword, 12);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});

module.exports = router;