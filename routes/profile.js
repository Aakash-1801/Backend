const express = require('express');
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/multer');
const User = require('../models/User');
const Company = require('../models/Company');
const checkPermission = require('../middleware/checkpermission')

const router = express.Router();

router.get('/profile', verifyToken, checkPermission('view-profile'), async (req, res) => {
  const { email, role } = req.user;

  try {
    let data = {};

    if (role === 'Company') {
      const company = await Company.findOne({ email }).select('companyName email phone address companyLogo');
      if (!company) return res.status(404).json({ message: 'Company not found' });
      data = company;
    } else {
      const user = await User.findOne({ email }).select('fullName email course typpe phone address profilePic');
      if (!user) return res.status(404).json({ message: 'User not found' });
      data = user;
    }

    res.status(200).json({
      message: `${role} profile fetched successfully`,
      role,
      profile: data
    });

  } catch (err) {
    console.error('Profile Fetch Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/editprofile', verifyToken, checkPermission('edit-profile'), upload.single('image'), async (req, res) => {
  const { email, role } = req.user;

  console.log(req);

  try {
    if (role === 'Company') {
      const company = await Company.findOne({ email });
      if (!company) return res.status(404).json({ message: 'Company not found' });

      company.companyName = req.body.companyName || company.companyName;
      company.phone = req.body.phone || company.phone;
      company.address = req.body.address || company.address;
      if (req.file) company.companyLogo = '/uploads/' + req.file.filename;

      await company.save();
      return res.json({ message: 'Company profile updated successfully', company });

    } else {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.fullName = req.body.fullName || user.fullName;
      user.course = req.body.course || user.course;
      user.typpe = req.body.typpe || user.typpe;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      if (req.file) user.profilePic = '/uploads/' + req.file.filename;

      await user.save();
      return res.json({ message: 'User profile updated successfully', user });
    }
  } catch (err) {
    console.error('Edit Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;