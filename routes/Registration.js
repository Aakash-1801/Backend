const express = require('express');
// const multer = require('multer');
// const path = require('path');
const Registration = require('../models/Registration');

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const allowed = ['.pdf', '.doc', '.docx'];
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (allowed.includes(ext)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only .pdf, .doc, .docx files are allowed.'));
//     }
//   }
// });

// router.post('/registeration', upload.single('resume'), async (req, res) => {
router.post('/registration', async (req, res) => {
  try {
    // console.log('Request body:', req.body);
    const {
      fullName,
      email,
      phone,
    //   dob,
      gender,
      qualification,
      stream,
      cgpa,
      opportunity
    } = req.body;
    const registration = new Registration({
      fullName,
      email,
      phone,
    //   dob,
      gender,
      qualification,
      stream,
      cgpa,
      opportunity,
      // resume: req.file ? req.file.filename : ''
    });
    // console.log('Registration data:', registration);
    await registration.save();
    res.status(201).json({ message: 'Registration successful' });

  } catch (err) {
    console.error('Registration error: 123', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;