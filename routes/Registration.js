const express = require('express');
const multer = require('multer');
const path = require('path');
const Registration = require('../models/Registration');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

router.post('/registration', upload.single('resume'), async (req, res) => {
  try {
    // console.log('Request body:', req.body);
    const {
      fullName,
      email,
      phone,
      gender,
      type,
      institute,
      course,
      branch,
      cgpa,
      opportunity,
      resume
    } = req.body;
    const registration = new Registration({
      fullName,
      email,
      phone,
      gender,
      type,
      institute,
      course,
      branch,
      cgpa,
      opportunity,
      resume: req.file ? req.file.path : null
    });
    // console.log('Registration data:', registration);
    const resumePath = req.file ? req.file.path : null;
    await registration.save();
    res.status(201).json({ message: 'Registration successful', resumePath });

  } catch (err) {
    console.error('Registration error: 123', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;