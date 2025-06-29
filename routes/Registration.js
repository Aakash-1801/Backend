const express = require('express');
const upload = require('../middleware/multer');
const path = require('path');
const Registration = require('../models/Registration');
const opp = require('../models/Opp');

const router = express.Router();

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
    } = req.body;
    // console.log('Registration data:', registration);
    const resumePath = req.file ? req.file.path : null;
    const exists = await Registration.findOne({ email, opportunity });
    if (exists || !opportunity) {
      return res.status(400).json({ message: 'User already registared' });
    }
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
      resume: resumePath
    });
    await registration.save();
    await opp.findOneAndUpdate(
      { opportunity: opportunity },
      { $inc: { applied: 1 } }
    );
    res.status(201).json({ message: 'Registration successful', resumePath });

  } catch (err) {
    console.error('Registration error: 123', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;