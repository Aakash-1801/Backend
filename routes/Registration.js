const express = require('express');
const upload = require('../middleware/multer');
const Registration = require('../models/Registration');
const companydata = require('../models/Company');
const opp = require('../models/Opp');
const verifyToken = require('../middleware/auth');
const checkPermission = require('../middleware/checkpermission');

const router = express.Router();

router.post('/registration', verifyToken, checkPermission('register-opportunity'), upload.single('resume'), async (req, res) => {
  try {
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

router.get('/my-registrations', verifyToken, checkPermission('view-own-registrations'), async (req, res) => {
  try {
    const userEmail = req.user.email;
    const registrations = await Registration.find({ email: userEmail }).sort({ createdAt: -1 });
    
    res.status(200).json(registrations);
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/company-registrations', verifyToken, verifyToken, checkPermission('view-registrations'), async (req, res) => {
  const { email, role } = req.user;

  if (role !== 'Company') {
    return res.status(403).json({ message: 'Access denied: not a company' });
  }

  try {
    const company = await companydata.findOne({ email: email });
    const jobs = await opp.find({ company: company.companyName }).select('opportunity');
    const jobNames = jobs.map(job => job.opportunity);

    // const registrations = await Registration.find({ opportunity: { $in: jobNames } });
    const allreg = [];
    for (const it of jobNames) {
      const rg = await Registration.find({ opportunity: it });
      allreg.push({
        opp: it,
        size: rg.length,
        regist: rg
      })
    }

    res.json(allreg);
  } catch (err) {
    console.error("Error fetching registrations for company:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;